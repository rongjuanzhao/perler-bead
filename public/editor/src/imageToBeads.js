import { colorDistance, nearestPaletteColor, nearestPaletteColorFromLab, palette, rgbToOklab, oklabDistance } from './palette.js';

export const styleProfiles = {
    cartoon: {
        sampleSide: 7,
        backgroundThreshold: 0.72,
        dominanceThreshold: 0.34,
        candidateTargetRatio: 0.58,
        candidateDistanceFactor: 1.35,
        postStrengthBias: 1,
        useAverageFallback: false,
        edgePreserve: true,
        ditherDefault: 0,
        ditherAlgorithm: 'atkinson',
        vibranceBoost: 1.12,
        bilateralSigmaSpatial: 2.2,
        bilateralSigmaRange: 28,
        reinforceDiagonals: true,
    },
    realistic: {
        sampleSide: 5,
        backgroundThreshold: 0.58,
        dominanceThreshold: 0.26,
        candidateTargetRatio: 0.95,
        candidateDistanceFactor: 0.65,
        postStrengthBias: -1,
        useAverageFallback: true,
        edgePreserve: false,
        ditherDefault: 0.45,
        ditherAlgorithm: 'atkinson',
        vibranceBoost: 1.05,
        bilateralSigmaSpatial: 1.8,
        bilateralSigmaRange: 35,
        reinforceDiagonals: true,
    },
};

/**
 * 核心拼豆图像转换入口（支持 File / Blob / HTMLImageElement / ImageData / HTMLCanvasElement）
 */
export async function convertSourceToBeads(source, options = {}) {
    const targetWidth = Math.max(1, Math.round(options.width || 29));
    const targetHeight = options.height ? Math.max(1, Math.round(options.height)) : null;
    const { data, sourceWidth, sourceHeight } = await extractSourceImageData(source, targetWidth, targetHeight);
    const width = targetWidth;
    const height = targetHeight ?? Math.max(1, Math.round((sourceHeight / sourceWidth) * width));

    const activePalette = (options.palette ?? palette).map(color => {
        if (!color.oklab && color.rgb) {
            color.oklab = rgbToOklab(color.rgb);
        }
        return color;
    });

    const styleKey = options.generationStyle ?? 'cartoon';
    const profile = styleProfiles[styleKey] ?? styleProfiles.cartoon;

    // 抖动强度处理
    let ditherStrength = profile.ditherDefault;
    if (typeof options.dither === 'number') {
        ditherStrength = Math.max(0, Math.min(1, options.dither));
    } else if (typeof options.dither === 'boolean') {
        ditherStrength = options.dither ? 0.45 : 0;
    }

    const requestedSpeckleStrength = options.speckleReduction ?? 0;
    const speckleStrength = requestedSpeckleStrength > 0
        ? clampStrength(requestedSpeckleStrength + profile.postStrengthBias)
        : (ditherStrength > 0 ? 1 : 0);

    const preprocessedData = adaptImageTone(data, sourceWidth, sourceHeight, profile, options);
    const backgroundColor = options.backgroundColor ?? estimateBackgroundColor(preprocessedData, sourceWidth, sourceHeight);
    const sampledCells = sampleGridCells(preprocessedData, sourceWidth, sourceHeight, width, height, options, backgroundColor, profile, speckleStrength);
    const candidates = selectCandidateColorsEnhanced(sampledCells, Math.max(2, options.maxColors || 16), activePalette, speckleStrength, profile, options);

    // 确保候选色都拥有 oklab 属性
    candidates.forEach(color => {
        if (!color.oklab && color.rgb) {
            color.oklab = rgbToOklab(color.rgb);
        }
    });

    // 创建感知色彩匹配 LUT 缓存加速
    const matcher = createLabColorMatcher(candidates);

    let cells;
    if (ditherStrength > 0) {
        cells = quantizeWithDithering(sampledCells, width, height, candidates, ditherStrength, profile, options, matcher);
    } else {
        cells = sampledCells.map(cell => chooseCellColor(cell, candidates, profile, matcher));
    }

    const mergedCells = mergeSimilarColors(cells, speckleStrength, candidates);
    const compactCells = reduceTinyRegions(mergedCells, width, height, speckleStrength, candidates);
    const reducedCells = reduceSpeckles(compactCells, width, height, speckleStrength, candidates);
    const robustCells = enforcePhysicalConnectivity(reducedCells, width, height, candidates);
    const patchedCells = profile.reinforceDiagonals ? patchDiagonalNecking(robustCells, width, height) : robustCells;
    const finalCells = pruneLowUsageColors(patchedCells, candidates, options.minBeadUsage ?? 2);

    const colorsUsed = new Set(finalCells.filter(Boolean)).size;
    const totalBeads = finalCells.filter(Boolean).length;

    return {
        width,
        height,
        cells: finalCells,
        colorsUsed,
        totalBeads,
        candidates,
    };
}

export async function imageFileToBeads(file, options) {
    return convertSourceToBeads(file, options);
}

async function extractSourceImageData(source, targetGridWidth = 29, targetGridHeight = null) {
    // 优先支持外部已提取的像素数据（如微信小程序 Canvas 提取的 Uint8ClampedArray / ImageData）
    if (source && source.data) {
        return {
            data: source.data,
            sourceWidth: Math.max(1, source.sourceWidth || source.width || 1),
            sourceHeight: Math.max(1, source.sourceHeight || source.height || 1),
        };
    }
    if (typeof window === 'undefined') {
        throw new Error('Canvas is only available in browser environments.');
    }
    let imageElement = null;
    let createdUrl = null;

    try {
        if (source instanceof Blob || source instanceof File) {
            createdUrl = URL.createObjectURL(source);
            imageElement = await loadImageUrl(createdUrl);
        } else if (typeof Image !== 'undefined' && source instanceof Image) {
            imageElement = source;
        } else if (typeof HTMLImageElement !== 'undefined' && source instanceof HTMLImageElement) {
            imageElement = source;
        } else if (typeof HTMLCanvasElement !== 'undefined' && source instanceof HTMLCanvasElement) {
            const ctx = source.getContext('2d', { willReadFrequently: true });
            return {
                data: ctx.getImageData(0, 0, source.width, source.height).data,
                sourceWidth: source.width,
                sourceHeight: source.height,
            };
        } else if (source && source.data && source.width && source.height) {
            return {
                data: source.data,
                sourceWidth: source.width,
                sourceHeight: source.height,
            };
        } else if (typeof source === 'string') {
            imageElement = await loadImageUrl(source);
        }

        if (!imageElement) {
            throw new Error('Invalid image source.');
        }

        const natWidth = Math.max(1, imageElement.naturalWidth || imageElement.width);
        const natHeight = Math.max(1, imageElement.naturalHeight || imageElement.height);

        // 两级抗混叠缩放：根据目标网格上限合理缩放中间位图，彻底解决超大原图（4K/8K）卡顿和内存暴涨
        const gridW = Math.max(1, targetGridWidth);
        const gridH = targetGridHeight ? Math.max(1, targetGridHeight) : Math.max(1, Math.round((natHeight / natWidth) * gridW));
        const maxGridDim = Math.max(gridW, gridH);
        const idealMaxDim = Math.max(640, maxGridDim * 14);

        let renderWidth = natWidth;
        let renderHeight = natHeight;
        if (Math.max(natWidth, natHeight) > idealMaxDim) {
            const scale = idealMaxDim / Math.max(natWidth, natHeight);
            renderWidth = Math.max(1, Math.round(natWidth * scale));
            renderHeight = Math.max(1, Math.round(natHeight * scale));
        }

        const canvas = document.createElement('canvas');
        canvas.width = renderWidth;
        canvas.height = renderHeight;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) throw new Error('Canvas is not available.');
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(imageElement, 0, 0, renderWidth, renderHeight);
        const data = context.getImageData(0, 0, renderWidth, renderHeight).data;

        return { data, sourceWidth: renderWidth, sourceHeight: renderHeight };
    } finally {
        if (createdUrl) {
            URL.revokeObjectURL(createdUrl);
        }
    }
}

function loadImageUrl(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Could not load image from URL.'));
        image.src = url;
    });
}

/**
 * 图像色彩动态范围与明度对比度自适应微调（提升实体塑料拼豆的发色鲜明度）
 */
function adaptImageTone(data, width, height, profile, options = {}) {
    if (options.autoTone === false) return data;

    const len = width * height * 4;
    const step = Math.max(1, Math.floor((width * height) / 400));
    let minLum = 255;
    let maxLum = 0;
    let totalChroma = 0;
    let count = 0;

    for (let i = 0; i < len; i += step * 4) {
        if (data[i + 3] < 24) continue;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const chroma = Math.max(r, g, b) - Math.min(r, g, b);
        if (lum < minLum) minLum = lum;
        if (lum > maxLum) maxLum = lum;
        totalChroma += chroma;
        count += 1;
    }

    if (count === 0) return data;
    const avgChroma = totalChroma / count;
    const lumRange = maxLum - minLum;

    const needsContrast = lumRange < 185 && lumRange > 40;
    const vibranceBoost = profile.vibranceBoost ?? (avgChroma < 65 ? 1.12 : 1.05);

    if (!needsContrast && vibranceBoost <= 1.0) return data;

    const out = new Uint8ClampedArray(data.length);
    const scale = needsContrast ? 255 / (lumRange + 1e-4) : 1;
    const offset = needsContrast ? minLum : 0;

    for (let i = 0; i < len; i += 4) {
        out[i + 3] = data[i + 3];
        if (data[i + 3] < 24) continue;

        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        if (needsContrast) {
            r = (r - offset) * scale;
            g = (g - offset) * scale;
            b = (b - offset) * scale;
        }

        if (vibranceBoost > 1.0) {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            r = lum + (r - lum) * vibranceBoost;
            g = lum + (g - lum) * vibranceBoost;
            b = lum + (b - lum) * vibranceBoost;
        }

        out[i] = Math.max(0, Math.min(255, Math.round(r)));
        out[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
        out[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
    }
    return out;
}

/**
 * 带有双边保边滤波与细线骨架保护特性的网格采样
 */
function sampleGridCells(data, sourceWidth, sourceHeight, width, height, options, detectedBackgroundColor, profile, speckleStrength) {
    const cells = [];
    const totalSamples = profile.sampleSide * profile.sampleSide;
    const edgePreserve = profile.edgePreserve ?? false;
    const centerIdx = (profile.sampleSide - 1) / 2;
    const sigmaSpatialSq2 = 2 * (profile.bilateralSigmaSpatial ?? 2.0) * (profile.bilateralSigmaSpatial ?? 2.0);
    const sigmaRangeSq2 = 2 * (profile.bilateralSigmaRange ?? 30) * (profile.bilateralSigmaRange ?? 30);

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const rawSamples = [];
            let backgroundCount = 0;

            let darkEdgeSamples = 0;
            let edgeR = 0;
            let edgeG = 0;
            let edgeB = 0;

            for (let sy = 0; sy < profile.sampleSide; sy += 1) {
                for (let sx = 0; sx < profile.sampleSide; sx += 1) {
                    const sourceX = Math.min(sourceWidth - 1, Math.max(0, Math.floor(((x + (sx + 0.5) / profile.sampleSide) / width) * sourceWidth)));
                    const sourceY = Math.min(sourceHeight - 1, Math.max(0, Math.floor(((y + (sy + 0.5) / profile.sampleSide) / height) * sourceHeight)));
                    const index = (sourceY * sourceWidth + sourceX) * 4;
                    const alpha = data[index + 3];
                    const rgb = [data[index], data[index + 1], data[index + 2]];

                    if (isBackgroundSample(alpha, rgb, options, detectedBackgroundColor)) {
                        backgroundCount += 1;
                        continue;
                    }

                    const simplified = simplifySourceRgb(rgb, speckleStrength);
                    const dx = sx - centerIdx;
                    const dy = sy - centerIdx;
                    const spatialWeight = Math.exp(-(dx * dx + dy * dy) / sigmaSpatialSq2);

                    let edgeWeight = 1.0;
                    if (edgePreserve) {
                        const lum = luminance(simplified);
                        const rightX = Math.min(sourceWidth - 1, sourceX + 1);
                        const bottomY = Math.min(sourceHeight - 1, sourceY + 1);
                        const rIdx = (sourceY * sourceWidth + rightX) * 4;
                        const bIdx = (bottomY * sourceWidth + sourceX) * 4;
                        const lumR = luminance([data[rIdx], data[rIdx + 1], data[rIdx + 2]]);
                        const lumB = luminance([data[bIdx], data[bIdx + 1], data[bIdx + 2]]);
                        const grad = Math.max(Math.abs(lum - lumR), Math.abs(lum - lumB));

                        // 细线暗色边缘检测
                        if (lum < 85 && grad > 20) {
                            edgeWeight = 3.6;
                            darkEdgeSamples += 1;
                            edgeR += simplified[0];
                            edgeG += simplified[1];
                            edgeB += simplified[2];
                        }
                    }

                    rawSamples.push({
                        rgb: simplified,
                        spatialWeight,
                        edgeWeight,
                    });
                }
            }

            const sampleCount = rawSamples.length;
            let avgRgb = null;

            if (sampleCount > 0) {
                // 细线条骨架最大响应保护：若暗线样点达到一定比例，骨架直接胜出，防止被大面积亮色冲淡
                const isProminentEdge = edgePreserve && darkEdgeSamples > 0 && (darkEdgeSamples / sampleCount >= 0.16);

                if (isProminentEdge) {
                    avgRgb = [
                        Math.round(edgeR / darkEdgeSamples),
                        Math.round(edgeG / darkEdgeSamples),
                        Math.round(edgeB / darkEdgeSamples),
                    ];
                } else {
                    // 双边保边滤波：计算空间高斯与色彩相似度联合权重
                    let centerR = 0, centerG = 0, centerB = 0, centerW = 0;
                    for (let i = 0; i < sampleCount; i += 1) {
                        const s = rawSamples[i];
                        centerR += s.rgb[0] * s.spatialWeight;
                        centerG += s.rgb[1] * s.spatialWeight;
                        centerB += s.rgb[2] * s.spatialWeight;
                        centerW += s.spatialWeight;
                    }
                    const baseR = centerW > 0 ? centerR / centerW : rawSamples[0].rgb[0];
                    const baseG = centerW > 0 ? centerG / centerW : rawSamples[0].rgb[1];
                    const baseB = centerW > 0 ? centerB / centerW : rawSamples[0].rgb[2];

                    let totalR = 0, totalG = 0, totalB = 0, totalWeight = 0;
                    for (let i = 0; i < sampleCount; i += 1) {
                        const s = rawSamples[i];
                        const diffR = s.rgb[0] - baseR;
                        const diffG = s.rgb[1] - baseG;
                        const diffB = s.rgb[2] - baseB;
                        const colorDiffSq = diffR * diffR + diffG * diffG + diffB * diffB;
                        const rangeWeight = Math.exp(-colorDiffSq / sigmaRangeSq2);
                        const weight = s.spatialWeight * rangeWeight * s.edgeWeight;

                        totalR += s.rgb[0] * weight;
                        totalG += s.rgb[1] * weight;
                        totalB += s.rgb[2] * weight;
                        totalWeight += weight;
                    }

                    avgRgb = totalWeight > 0
                        ? [Math.round(totalR / totalWeight), Math.round(totalG / totalWeight), Math.round(totalB / totalWeight)]
                        : [Math.round(baseR), Math.round(baseG), Math.round(baseB)];
                }
            }

            const edgeRgb = darkEdgeSamples > 0
                ? [Math.round(edgeR / darkEdgeSamples), Math.round(edgeG / darkEdgeSamples), Math.round(edgeB / darkEdgeSamples)]
                : null;

            cells.push({
                samples: rawSamples.map((s) => s.rgb),
                average: avgRgb,
                averageLab: avgRgb ? rgbToOklab(avgRgb) : null,
                edgeRgb,
                edgeLab: edgeRgb ? rgbToOklab(edgeRgb) : null,
                edgeShare: sampleCount > 0 ? darkEdgeSamples / sampleCount : 0,
                backgroundShare: backgroundCount / totalSamples,
            });
        }
    }
    return cells;
}

function rankPaletteColors(sampledCells, options, activePalette, profile) {
    const counts = new Map();
    let total = 0;
    sampledCells.forEach((cell) => {
        if (cell.backgroundShare >= profile.backgroundThreshold || cell.samples.length === 0)
            return;
        cell.samples.forEach((rgb) => {
            total += 1;
            const color = nearestPaletteColor(rgb, activePalette);
            const bucket = counts.get(color.id) ?? { color, count: 0 };
            bucket.count += 1;
            counts.set(color.id, bucket);
        });
    });
    const rows = [...counts.values()]
        .map((entry) => {
            const chroma = colorChroma(entry.color.rgb);
            const share = total > 0 ? entry.count / total : 0;
            const lightness = luminance(entry.color.rgb);
            const accentBoost = chroma > 48 ? 2.25 : chroma > 28 ? 1.4 : 1;
            const minorityAccentBoost = chroma > 58 && share < 0.018 ? 2.45 : 1;
            const darkLineBoost = lightness < 48 ? 1.55 : 1;
            const lightNeutralPenalty = lightness > 210 && chroma < 22 ? 0.82 : 1;
            return {
                ...entry,
                score: entry.count * accentBoost * minorityAccentBoost * darkLineBoost * lightNeutralPenalty,
            };
        })
        .sort((a, b) => b.score - a.score || b.count - a.count);
    return rows.length > 0
        ? rows
        : activePalette.slice(0, options.maxColors || 16).map((color) => ({ color, count: 1, score: 1 }));
}

function selectCandidateColorsEnhanced(sampledCells, maxColors, activePalette, strength, profile, options = {}) {
    const ranked = rankPaletteColors(sampledCells, options, activePalette, profile);

    const validCells = [];
    sampledCells.forEach((cell) => {
        if (cell.backgroundShare >= profile.backgroundThreshold || !cell.averageLab || !cell.average)
            return;
        const chroma = colorChroma(cell.average);
        const lightness = luminance(cell.average);
        let weight = 1.0;
        if (cell.edgeShare > 0.2) weight += 2.0;
        if (chroma > 45) weight += 1.5;
        if (lightness < 40) weight += 1.2;
        validCells.push({ lab: cell.averageLab, rgb: cell.average, weight });
    });

    const selected = [];
    const selectedIds = new Set();
    const add = (color) => {
        if (!color || selectedIds.has(color.id) || selected.length >= maxColors)
            return false;
        selected.push(color);
        selectedIds.add(color.id);
        return true;
    };

    // 1. 特征色优先保护：保留瞳孔、高对比暗线与鲜明亮点
    const protectedCount = Math.max(1, Math.min(Math.floor(maxColors * 0.25), 4));
    const featureCandidates = ranked.filter((entry) => isFeatureColor(entry.color, entry.count, ranked));
    for (let i = 0; i < featureCandidates.length && selected.length < protectedCount; i += 1) {
        add(featureCandidates[i].color);
    }

    // 2. 加权 K-Means++ 在 Oklab 空间聚类剩余调色板，获得感知色差最优覆盖
    const remainingK = maxColors - selected.length;
    if (remainingK > 0 && validCells.length > 0) {
        const clusterCentroids = runWeightedKMeans(validCells, remainingK);
        clusterCentroids.forEach((cent) => {
            const sorted = [...activePalette]
                .filter((c) => !selectedIds.has(c.id))
                .sort((a, b) => oklabDistance(cent, a.oklab) - oklabDistance(cent, b.oklab));
            if (sorted[0]) {
                add(sorted[0]);
            }
        });
    }

    // 3. 兜底补充
    if (selected.length < maxColors) {
        const legacyCandidates = selectCandidateColors(ranked, maxColors, activePalette, strength, profile);
        legacyCandidates.forEach((c) => add(c));
    }

    return selected.length > 0 ? selected : activePalette.slice(0, maxColors);
}

function runWeightedKMeans(validCells, targetK) {
    if (validCells.length <= targetK) {
        return validCells.map((c) => c.lab.slice());
    }

    const centroids = [];
    let bestWeight = -1;
    let firstIdx = 0;
    validCells.forEach((c, idx) => {
        if (c.weight > bestWeight) {
            bestWeight = c.weight;
            firstIdx = idx;
        }
    });
    centroids.push(validCells[firstIdx].lab.slice());

    const distSq = new Float64Array(validCells.length);
    while (centroids.length < targetK) {
        let totalD2 = 0;
        for (let i = 0; i < validCells.length; i += 1) {
            const cellLab = validCells[i].lab;
            let minDist = Number.POSITIVE_INFINITY;
            for (let c = 0; c < centroids.length; c += 1) {
                const d = oklabDistance(cellLab, centroids[c]);
                if (d < minDist) minDist = d;
            }
            const weightedD2 = minDist * minDist * validCells[i].weight;
            distSq[i] = weightedD2;
            totalD2 += weightedD2;
        }

        if (totalD2 <= 0) break;

        let threshold = Math.random() * totalD2;
        let selectedIdx = 0;
        for (let i = 0; i < validCells.length; i += 1) {
            threshold -= distSq[i];
            if (threshold <= 0) {
                selectedIdx = i;
                break;
            }
        }
        centroids.push(validCells[selectedIdx].lab.slice());
    }

    for (let iter = 0; iter < 8; iter += 1) {
        const clusterSums = centroids.map(() => [0, 0, 0]);
        const clusterWeights = new Float64Array(centroids.length);

        for (let i = 0; i < validCells.length; i += 1) {
            const cell = validCells[i];
            let bestC = 0;
            let bestDist = Number.POSITIVE_INFINITY;
            for (let c = 0; c < centroids.length; c += 1) {
                const d = oklabDistance(cell.lab, centroids[c]);
                if (d < bestDist) {
                    bestDist = d;
                    bestC = c;
                }
            }
            clusterSums[bestC][0] += cell.lab[0] * cell.weight;
            clusterSums[bestC][1] += cell.lab[1] * cell.weight;
            clusterSums[bestC][2] += cell.lab[2] * cell.weight;
            clusterWeights[bestC] += cell.weight;
        }

        for (let c = 0; c < centroids.length; c += 1) {
            if (clusterWeights[c] > 0) {
                centroids[c][0] = clusterSums[c][0] / clusterWeights[c];
                centroids[c][1] = clusterSums[c][1] / clusterWeights[c];
                centroids[c][2] = clusterSums[c][2] / clusterWeights[c];
            }
        }
    }

    return centroids;
}

function selectCandidateColors(ranked, maxColors, activePalette, strength, profile) {
    const level = Math.max(0, Math.min(4, Math.round(strength)));
    const selected = [];
    const selectedIds = new Set();
    const add = (color, allowSimilar = false) => {
        if (selectedIds.has(color.id) || selected.length >= maxColors)
            return false;
        if (!allowSimilar && selected.length > 0) {
            const chroma = colorChroma(color.rgb);
            const baseThreshold = luminance(color.rgb) < 48 || chroma > 58 ? 18 : 34;
            const threshold = (baseThreshold + level * (chroma > 58 ? 3 : 7)) * profile.candidateDistanceFactor;
            const nearestDistance = Math.min(...selected.map((item) => colorDistance(color.rgb, item.rgb)));
            if (nearestDistance < threshold)
                return false;
        }
        selected.push(color);
        selectedIds.add(color.id);
        return true;
    };
    const chooseDiverseUntil = (targetCount) => {
        while (selected.length < Math.min(maxColors, targetCount)) {
            const choices = ranked
                .filter((entry) => !selectedIds.has(entry.color.id))
                .map((entry) => ({
                    entry,
                    diversityScore: candidateDiversityScore(entry, selected),
                }))
                .sort((a, b) => b.diversityScore - a.diversityScore);
            const added = choices.some((choice) => add(choice.entry.color));
            if (!added)
                break;
        }
    };
    const sortedByCount = [...ranked].sort((a, b) => b.count - a.count);
    sortedByCount.forEach((entry) => {
        if (selected.length < Math.ceil(maxColors * 0.28))
            add(entry.color);
    });
    const protectedFeatureSlots = Math.max(2, Math.ceil(maxColors * (profile.useAverageFallback ? 0.28 : 0.22)));
    const featureCandidates = ranked
        .filter((entry) => isFeatureColor(entry.color, entry.count, ranked))
        .map((entry) => ({
            entry,
            featureScore: featureColorScore(entry, selected),
        }))
        .sort((a, b) => b.featureScore - a.featureScore);
    featureCandidates.forEach((choice) => {
        if (selected.length < maxColors && selected.filter((color) => isFeaturePaletteColor(color)).length < protectedFeatureSlots) {
            add(choice.entry.color, shouldAllowFeatureSimilarity(choice.entry.color, selected));
        }
    });
    ranked
        .filter((entry) => isFeaturePaletteColor(entry.color))
        .forEach((entry) => add(entry.color, shouldAllowFeatureSimilarity(entry.color, selected)));
    chooseDiverseUntil(Math.ceil(maxColors * profile.candidateTargetRatio));
    ranked.forEach((entry) => add(entry.color));
    if (profile.useAverageFallback || selected.length < Math.min(6, maxColors)) {
        ranked.forEach((entry) => add(entry.color, true));
    }
    return selected.length > 0 ? selected : activePalette.slice(0, maxColors);
}

function isFeatureColor(color, count, ranked) {
    const maxCount = Math.max(1, ranked[0]?.count ?? 1);
    const shareOfLargest = count / maxCount;
    const chroma = colorChroma(color.rgb);
    const lightness = luminance(color.rgb);
    if (chroma > 70 && shareOfLargest > 0.002)
        return true;
    if (chroma > 52 && shareOfLargest > 0.006)
        return true;
    if (lightness < 36 && shareOfLargest > 0.003)
        return true;
    return false;
}

function isFeaturePaletteColor(color) {
    return colorChroma(color.rgb) > 48 || luminance(color.rgb) < 45;
}

function shouldAllowFeatureSimilarity(color, selected) {
    if (selected.length === 0)
        return false;
    const nearestDistance = Math.min(...selected.map((item) => colorDistance(color.rgb, item.rgb)));
    const chroma = colorChroma(color.rgb);
    return chroma > 68 && nearestDistance > 14;
}

function featureColorScore(entry, selected) {
    const chroma = colorChroma(entry.color.rgb);
    const lightness = luminance(entry.color.rgb);
    const selectedDistance = selected.length > 0 ? Math.min(...selected.map((color) => colorDistance(entry.color.rgb, color.rgb))) : 90;
    const saturationBoost = 1 + Math.min(3.2, chroma / 34);
    const contrastBoost = lightness < 42 ? 1.8 : 1;
    const differenceBoost = Math.max(0.8, Math.min(4.5, selectedDistance / 22));
    return Math.sqrt(Math.max(1, entry.count)) * saturationBoost * contrastBoost * differenceBoost;
}

function candidateDiversityScore(entry, selected) {
    if (selected.length === 0)
        return entry.score;
    const distance = Math.min(...selected.map((color) => colorDistance(entry.color.rgb, color.rgb)));
    const chroma = colorChroma(entry.color.rgb);
    const lightness = luminance(entry.color.rgb);
    const distinctBoost = Math.max(0.35, Math.min(5.4, (distance / 26) ** 1.55));
    const featureBoost = chroma > 58 || lightness < 48 ? 2.15 : chroma > 34 ? 1.36 : 1;
    const countSignal = Math.sqrt(Math.max(1, entry.count));
    return countSignal * distinctBoost * featureBoost;
}

/**
 * 高性能感知色差查询缓存（基于离散 Oklab 整数哈希键的 O(1) LUT 缓存）
 */
function createLabColorMatcher(candidates) {
    const cache = new Map();
    const len = candidates.length;

    return function getNearest(lab) {
        if (!lab) return candidates[0];
        const qL = (lab[0] * 250) | 0;
        const qa = ((lab[1] + 0.5) * 250) | 0;
        const qb = ((lab[2] + 0.5) * 250) | 0;
        const key = (qL << 18) | (qa << 9) | qb;

        const cached = cache.get(key);
        if (cached !== undefined) return cached;

        let best = candidates[0];
        let bestDist = Number.POSITIVE_INFINITY;
        const l0 = lab[0], a0 = lab[1], b0 = lab[2];

        for (let i = 0; i < len; i += 1) {
            const c = candidates[i];
            const dL = l0 - c.oklab[0];
            const da = a0 - c.oklab[1];
            const db = b0 - c.oklab[2];
            const d = dL * dL + 1.25 * (da * da + db * db);
            if (d < bestDist) {
                bestDist = d;
                best = c;
            }
        }
        cache.set(key, best);
        return best;
    };
}

function chooseCellColor(cell, candidates, profile, matcher = null) {
    if (cell.backgroundShare >= profile.backgroundThreshold || cell.samples.length === 0)
        return null;

    const findNearest = matcher ?? ((lab) => nearestPaletteColorFromLab(lab, candidates));

    // 边缘保护：若网格存在高对比深色轮廓，倾向保留线条
    if (profile.edgePreserve && cell.edgeLab && cell.edgeShare >= 0.22) {
        return findNearest(cell.edgeLab).id;
    }

    const counts = new Map();
    cell.samples.forEach((rgb) => {
        const color = nearestPaletteColor(rgb, candidates);
        const bucket = counts.get(color.id) ?? { color, count: 0 };
        bucket.count += 1;
        counts.set(color.id, bucket);
    });
    const ranked = [...counts.values()].sort((a, b) => b.count - a.count);
    const primary = ranked[0];
    if (!primary)
        return null;
    const primaryShare = primary.count / cell.samples.length;
    if (primaryShare >= profile.dominanceThreshold || !profile.useAverageFallback || !cell.averageLab) {
        return primary.color.id;
    }
    return findNearest(cell.averageLab).id;
}

/**
 * 自适应 Atkinson / Floyd-Steinberg 误差扩散抖动（在 Oklab 感知空间中平滑扩散）
 */
function quantizeWithDithering(sampledCells, width, height, candidates, ditherStrength, profile, options = {}, matcher = null) {
    const cells = new Array(width * height).fill(null);
    const errors = new Float32Array(width * height * 3);
    const ditherAlgo = options.ditherAlgorithm ?? profile.ditherAlgorithm ?? 'atkinson';
    const isAtkinson = ditherAlgo === 'atkinson';
    const findNearest = matcher ?? createLabColorMatcher(candidates);

    const getCellGradient = (x, y) => {
        const center = sampledCells[y * width + x]?.averageLab;
        if (!center) return 0;
        let maxD = 0;
        const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (let i = 0; i < offsets.length; i++) {
            const nx = x + offsets[i][0];
            const ny = y + offsets[i][1];
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nLab = sampledCells[ny * width + nx]?.averageLab;
                if (nLab) {
                    const d = oklabDistance(center, nLab);
                    if (d > maxD) maxD = d;
                }
            }
        }
        return maxD;
    };

    for (let y = 0; y < height; y += 1) {
        const isReverse = (y % 2 === 1);
        const startX = isReverse ? width - 1 : 0;
        const endX = isReverse ? -1 : width;
        const stepX = isReverse ? -1 : 1;

        for (let x = startX; x !== endX; x += stepX) {
            const cellIndex = y * width + x;
            const cell = sampledCells[cellIndex];

            if (cell.backgroundShare >= profile.backgroundThreshold || !cell.averageLab) {
                cells[cellIndex] = null;
                continue;
            }

            // 边缘保护优先：轮廓线条直接取色，不参与扩散，保持轮廓坚挺纯净
            if (profile.edgePreserve && cell.edgeLab && cell.edgeShare >= 0.25) {
                const edgeColor = findNearest(cell.edgeLab);
                cells[cellIndex] = edgeColor.id;
                continue;
            }

            // 自适应抖动权重调制：
            // - 平坦区（梯度 < 12）抑制抖动，防止产生散点噪点
            // - 强边缘区（梯度 > 75）抑制抖动，防止轮廓模糊
            // - 连续过渡渐变区（12 <= 梯度 <= 75）充分应用抖动
            const grad = getCellGradient(x, y);
            let localDitherScale = 1.0;
            if (grad < 12) {
                localDitherScale = Math.max(0, (grad - 2) / 10);
            } else if (grad > 75) {
                localDitherScale = Math.max(0.1, 1 - (grad - 75) / 50);
            }
            const effectiveDither = ditherStrength * localDitherScale;

            const baseLab = cell.averageLab;
            const errOffset = cellIndex * 3;

            let curL = baseLab[0] + errors[errOffset] * effectiveDither;
            let curA = baseLab[1] + errors[errOffset + 1] * effectiveDither;
            let curB = baseLab[2] + errors[errOffset + 2] * effectiveDither;

            curL = Math.max(0, Math.min(1, curL));
            curA = Math.max(-0.4, Math.min(0.4, curA));
            curB = Math.max(-0.4, Math.min(0.4, curB));

            const chosenColor = findNearest([curL, curA, curB]);
            cells[cellIndex] = chosenColor.id;

            const chosenLab = chosenColor.oklab;
            let diffL = curL - chosenLab[0];
            let diffA = curA - chosenLab[1];
            let diffB = curB - chosenLab[2];

            // 误差阻尼截断，防止产生过多杂色孤立豆
            const clampLimit = isAtkinson ? 0.16 : 0.18;
            diffL = Math.max(-clampLimit, Math.min(clampLimit, diffL));
            diffA = Math.max(-clampLimit, Math.min(clampLimit, diffA));
            diffB = Math.max(-clampLimit, Math.min(clampLimit, diffB));

            const distribute = (nx, ny, weight) => {
                if (nx < 0 || nx >= width || ny < 0 || ny >= height) return;
                const nIdx = (ny * width + nx) * 3;
                errors[nIdx] += diffL * weight;
                errors[nIdx + 1] += diffA * weight;
                errors[nIdx + 2] += diffB * weight;
            };

            if (isAtkinson) {
                // Atkinson: 6 个邻居各分配 1/8 误差 (共扩散 75%，25% 误差自然衰减，颗粒分布紧凑无杂点)
                const sx = isReverse ? -1 : 1;
                distribute(x + sx, y, 1 / 8);
                distribute(x + 2 * sx, y, 1 / 8);
                distribute(x - sx, y + 1, 1 / 8);
                distribute(x, y + 1, 1 / 8);
                distribute(x + sx, y + 1, 1 / 8);
                distribute(x, y + 2, 1 / 8);
            } else {
                // Floyd-Steinberg 蛇形扫描
                if (!isReverse) {
                    distribute(x + 1, y, 7 / 16);
                    distribute(x - 1, y + 1, 3 / 16);
                    distribute(x, y + 1, 5 / 16);
                    distribute(x + 1, y + 1, 1 / 16);
                } else {
                    distribute(x - 1, y, 7 / 16);
                    distribute(x + 1, y + 1, 3 / 16);
                    distribute(x, y + 1, 5 / 16);
                    distribute(x - 1, y + 1, 1 / 16);
                }
            }
        }
    }
    return cells;
}

function reduceSpeckles(cells, width, height, strength, candidates) {
    const iterations = Math.max(0, Math.min(4, Math.round(strength)));
    if (iterations === 0)
        return cells;
    const colorMap = new Map(candidates.map((color) => [color.id, color]));
    let next = cells.slice();
    for (let pass = 0; pass < iterations; pass += 1) {
        const current = next;
        next = current.slice();
        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                const index = y * width + x;
                const colorId = current[index];
                if (!colorId)
                    continue;
                const neighbors = neighborColorIds(current, width, height, x, y);
                const sameCount = neighbors.filter((item) => item === colorId).length;
                const majority = majorityColor(neighbors);
                if (!majority.colorId)
                    continue;
                if (!areSimilarColors(colorMap.get(colorId), colorMap.get(majority.colorId), strength, false))
                    continue;
                const requiredMajority = iterations >= 4 ? (pass === 0 ? 3 : 4) : pass === 0 ? 4 : 5;
                const sameLimit = iterations >= 4 ? (pass === 0 ? 2 : 1) : pass === 0 ? 1 : 0;
                if (sameCount <= sameLimit && majority.count >= requiredMajority) {
                    next[index] = majority.colorId;
                }
            }
        }
    }
    return next;
}

/**
 * 物理工艺结构加固：消除四周无连接的完全悬挂孤岛豆，吸收杂散单点孤立色
 */
function enforcePhysicalConnectivity(cells, width, height, candidates) {
    const result = cells.slice();
    const colorMap = new Map(candidates.map((c) => [c.id, c]));

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const idx = y * width + x;
            const colorId = result[idx];
            if (!colorId) continue;

            const neighbors = [];
            let sameColorCount = 0;
            let nonNullNeighbors = 0;

            const offsets = [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
            ];
            for (let i = 0; i < offsets.length; i += 1) {
                const nx = x + offsets[i][0];
                const ny = y + offsets[i][1];
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const nId = result[ny * width + nx];
                    if (nId) {
                        nonNullNeighbors += 1;
                        neighbors.push(nId);
                        if (nId === colorId) {
                            sameColorCount += 1;
                        }
                    }
                }
            }

            // 物理悬空孤岛：周围没有任何非空豆子，熨烫脱模必然掉落，直接剔除
            if (nonNullNeighbors === 0) {
                result[idx] = null;
                continue;
            }

            // 单点异色孤岛：周围全是其他颜色，且非瞳孔极暗特征点，吸收进主要邻居色
            if (sameColorCount === 0 && nonNullNeighbors >= 2) {
                const currentColor = colorMap.get(colorId);
                const isExtremeDark = currentColor && luminance(currentColor.rgb) < 32;

                const counts = new Map();
                neighbors.forEach((n) => counts.set(n, (counts.get(n) || 0) + 1));
                const majority = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];

                if (majority && majority[1] >= 2) {
                    const majColor = colorMap.get(majority[0]);
                    const majLum = majColor ? luminance(majColor.rgb) : 255;
                    if (!isExtremeDark || majLum < 65) {
                        result[idx] = majority[0];
                    }
                }
            }
        }
    }
    return result;
}

/**
 * 物理对角弱连接修复：检测并桥接仅单点对角相连的脆弱细颈结构，防止熨烫起模时断裂
 */
function patchDiagonalNecking(cells, width, height) {
    const result = cells.slice();
    for (let y = 0; y < height - 1; y += 1) {
        for (let x = 0; x < width - 1; x += 1) {
            const idxTL = y * width + x;
            const idxTR = y * width + (x + 1);
            const idxBL = (y + 1) * width + x;
            const idxBR = (y + 1) * width + (x + 1);

            const cTL = result[idxTL];
            const cTR = result[idxTR];
            const cBL = result[idxBL];
            const cBR = result[idxBR];

            // 模式 1: 左上与右下同色（对角单点弱连），右上与左下全空
            if (cTL && cBR && !cTR && !cBL) {
                const trNeighbors = countOccupiedNeighbors(result, width, height, x + 1, y);
                const blNeighbors = countOccupiedNeighbors(result, width, height, x, y + 1);
                if (trNeighbors >= blNeighbors && trNeighbors > 0) {
                    result[idxTR] = cTL;
                } else if (blNeighbors > 0) {
                    result[idxBL] = cTL;
                }
            }

            // 模式 2: 右上与左下同色（对角单点弱连），左上与右下全空
            if (cTR && cBL && !cTL && !cBR) {
                const tlNeighbors = countOccupiedNeighbors(result, width, height, x, y);
                const brNeighbors = countOccupiedNeighbors(result, width, height, x + 1, y + 1);
                if (tlNeighbors >= brNeighbors && tlNeighbors > 0) {
                    result[idxTL] = cTR;
                } else if (brNeighbors > 0) {
                    result[idxBR] = cTR;
                }
            }
        }
    }
    return result;
}

function countOccupiedNeighbors(cells, width, height, x, y) {
    let count = 0;
    const offsets = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];
    for (let i = 0; i < offsets.length; i += 1) {
        const nx = x + offsets[i][0];
        const ny = y + offsets[i][1];
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            if (cells[ny * width + nx]) count += 1;
        }
    }
    return count;
}

/**
 * 极低用量色号智能吸收：避免整图仅需 1~2 颗某色号导致买家拆整包耗材
 */
function pruneLowUsageColors(cells, candidates, minUsage = 2) {
    const counts = new Map();
    cells.forEach((id) => {
        if (id) counts.set(id, (counts.get(id) || 0) + 1);
    });

    const colorMap = new Map(candidates.map((c) => [c.id, c]));
    const lowUsageIds = new Set();
    counts.forEach((count, id) => {
        if (count <= minUsage) {
            const color = colorMap.get(id);
            // 保护特殊高对比颜色（如极黑眼睛或高饱和特色）
            const isCritical = color && (luminance(color.rgb) < 28 || (colorChroma(color.rgb) > 75 && count >= 2));
            if (!isCritical) {
                lowUsageIds.add(id);
            }
        }
    });

    if (lowUsageIds.size === 0) return cells;

    const commonColors = [...counts.entries()]
        .filter(([id, count]) => !lowUsageIds.has(id) && count > minUsage)
        .map(([id]) => colorMap.get(id))
        .filter(Boolean);

    if (commonColors.length === 0) return cells;

    const replacementMap = new Map();
    lowUsageIds.forEach((lowId) => {
        const lowColor = colorMap.get(lowId);
        if (!lowColor) return;
        let bestDist = Number.POSITIVE_INFINITY;
        let bestReplacement = lowId;
        for (let i = 0; i < commonColors.length; i += 1) {
            const candidate = commonColors[i];
            const dist = colorDistance(lowColor.rgb, candidate.rgb);
            if (dist < bestDist) {
                bestDist = dist;
                bestReplacement = candidate.id;
            }
        }
        replacementMap.set(lowId, bestReplacement);
    });

    return cells.map((id) => (id && replacementMap.has(id) ? replacementMap.get(id) : id));
}

function reduceTinyRegions(cells, width, height, strength, candidates) {
    const level = Math.max(0, Math.min(4, Math.round(strength)));
    const maxRegionSize = [0, 1, 2, 5, 9][level];
    if (maxRegionSize <= 0)
        return cells;
    const colorMap = new Map(candidates.map((color) => [color.id, color]));
    const next = cells.slice();
    const visited = new Uint8Array(cells.length);
    const offsets = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];
    for (let start = 0; start < cells.length; start += 1) {
        const colorId = cells[start];
        if (!colorId || visited[start])
            continue;
        const region = [];
        const borderCounts = new Map();
        const queue = [start];
        visited[start] = 1;
        for (let cursor = 0; cursor < queue.length; cursor += 1) {
            const index = queue[cursor];
            region.push(index);
            const x = index % width;
            const y = Math.floor(index / width);
            offsets.forEach(([dx, dy]) => {
                const nx = x + dx;
                const ny = y + dy;
                if (nx < 0 || ny < 0 || nx >= width || ny >= height)
                    return;
                const neighborIndex = ny * width + nx;
                const neighborColorId = cells[neighborIndex];
                if (neighborColorId === colorId && !visited[neighborIndex]) {
                    visited[neighborIndex] = 1;
                    queue.push(neighborIndex);
                    return;
                }
                if (neighborColorId && neighborColorId !== colorId) {
                    borderCounts.set(neighborColorId, (borderCounts.get(neighborColorId) ?? 0) + 1);
                }
            });
        }
        if (region.length > maxRegionSize || borderCounts.size === 0)
            continue;
        const replacement = [...borderCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .find(([neighborColorId]) => areSimilarColors(colorMap.get(colorId), colorMap.get(neighborColorId), strength, true))?.[0];
        if (!replacement)
            continue;
        region.forEach((index) => {
            next[index] = replacement;
        });
    }
    return next;
}

function mergeSimilarColors(cells, strength, candidates) {
    const level = Math.max(0, Math.min(4, Math.round(strength)));
    if (level === 0)
        return cells;
    const colorMap = new Map(candidates.map((color) => [color.id, color]));
    const counts = new Map();
    cells.forEach((colorId) => {
        if (!colorId)
            return;
        counts.set(colorId, (counts.get(colorId) ?? 0) + 1);
    });
    const rows = [...counts.entries()]
        .flatMap(([colorId, count]) => {
            const color = colorMap.get(colorId);
            return color ? [{ colorId, color, count }] : [];
        })
        .sort((a, b) => b.count - a.count);
    const total = rows.reduce((sum, row) => sum + row.count, 0);
    const replacements = new Map();
    rows.forEach((row, index) => {
        const rare = row.count <= Math.max(3, total * (0.006 + level * 0.003));
        const target = rows.slice(0, index).find((candidate) => areSimilarColors(row.color, candidate.color, level, rare));
        if (target)
            replacements.set(row.colorId, replacements.get(target.colorId) ?? target.colorId);
    });
    if (replacements.size === 0)
        return cells;
    return cells.map((colorId) => (colorId ? replacements.get(colorId) ?? colorId : null));
}

function areSimilarColors(from, to, strength, rare) {
    if (!from || !to || from.id === to.id)
        return false;
    const level = Math.max(0, Math.min(4, Math.round(strength)));
    const baseThreshold = [0, 26, 42, 62, 84][level];
    if (baseThreshold <= 0)
        return false;
    const fromChroma = colorChroma(from.rgb);
    const toChroma = colorChroma(to.rgb);
    const fromLuminance = luminance(from.rgb);
    const toLuminance = luminance(to.rgb);
    const distance = colorDistance(from.rgb, to.rgb);
    const saturationMismatch = Math.abs(fromChroma - toChroma);
    const luminanceMismatch = Math.abs(fromLuminance - toLuminance);
    const bothDark = fromLuminance < 84 && toLuminance < 84;
    const bothLightNeutral = fromLuminance > 188 && toLuminance > 188 && fromChroma < 46 && toChroma < 46;
    const bothMuted = fromLuminance > 96 && toLuminance > 96 && fromChroma < 82 && toChroma < 82;
    let threshold = baseThreshold * (rare ? 1.45 : 1);
    if (bothDark || bothLightNeutral || bothMuted)
        threshold *= 1.15;
    if (fromChroma > 78 || toChroma > 78)
        threshold *= 0.7;
    if (saturationMismatch > 56)
        threshold *= 0.58;
    if (luminanceMismatch > 86 && !bothDark)
        threshold *= 0.55;
    return distance <= threshold;
}

function neighborColorIds(cells, width, height, x, y) {
    const result = [];
    for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
            if (dx === 0 && dy === 0)
                continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height)
                continue;
            result.push(cells[ny * width + nx]);
        }
    }
    return result;
}

function majorityColor(colors) {
    const counts = new Map();
    colors.forEach((colorId) => {
        if (!colorId)
            return;
        counts.set(colorId, (counts.get(colorId) ?? 0) + 1);
    });
    return [...counts.entries()]
        .map(([colorId, count]) => ({ colorId, count }))
        .sort((a, b) => b.count - a.count)[0] ?? { colorId: null, count: 0 };
}

function isBackgroundSample(alpha, rgb, options, detectedBackgroundColor) {
    if (alpha < 24)
        return true;
    if (options.backgroundMode === 'keep')
        return false;
    const distance = Math.sqrt((rgb[0] - detectedBackgroundColor[0]) ** 2 +
        (rgb[1] - detectedBackgroundColor[1]) ** 2 +
        (rgb[2] - detectedBackgroundColor[2]) ** 2);
    return distance <= (options.tolerance ?? 32);
}

function luminance(rgb) {
    return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
}

function colorChroma(rgb) {
    return Math.max(...rgb) - Math.min(...rgb);
}

function simplifySourceRgb(rgb, strength) {
    const level = Math.max(0, Math.min(4, Math.round(strength)));
    if (level === 0)
        return rgb;
    const channelStep = [1, 5, 9, 14, 20][level];
    const neutralThreshold = [0, 8, 14, 20, 28][level];
    const chroma = colorChroma(rgb);
    if (chroma <= neutralThreshold) {
        const value = quantizeChannel(luminance(rgb), channelStep);
        return [value, value, value];
    }
    return [
        quantizeChannel(rgb[0], channelStep),
        quantizeChannel(rgb[1], channelStep),
        quantizeChannel(rgb[2], channelStep),
    ];
}

function quantizeChannel(value, step) {
    return Math.max(0, Math.min(255, Math.round(value / step) * step));
}

function clampStrength(value) {
    return Math.max(0, Math.min(4, Math.round(value)));
}

function estimateBackgroundColor(data, width, height) {
    const samples = [];
    const maxSamplesPerEdge = 80;
    const xStep = Math.max(1, Math.floor(width / maxSamplesPerEdge));
    const yStep = Math.max(1, Math.floor(height / maxSamplesPerEdge));
    for (let x = 0; x < width; x += xStep) {
        pushOpaqueSample(samples, data, width, x, 0);
        pushOpaqueSample(samples, data, width, x, height - 1);
    }
    for (let y = 0; y < height; y += yStep) {
        pushOpaqueSample(samples, data, width, 0, y);
        pushOpaqueSample(samples, data, width, width - 1, y);
    }
    if (samples.length === 0)
        return [255, 255, 255];
    const buckets = new Map();
    samples.forEach((rgb) => {
        const key = rgb.map((channel) => Math.round(channel / 16) * 16).join(',');
        const bucket = buckets.get(key) ?? { rgb: [0, 0, 0], count: 0 };
        bucket.rgb[0] += rgb[0];
        bucket.rgb[1] += rgb[1];
        bucket.rgb[2] += rgb[2];
        bucket.count += 1;
        buckets.set(key, bucket);
    });
    const best = [...buckets.values()].sort((a, b) => b.count - a.count)[0];
    return [
        Math.round(best.rgb[0] / best.count),
        Math.round(best.rgb[1] / best.count),
        Math.round(best.rgb[2] / best.count),
    ];
}

function pushOpaqueSample(samples, data, width, x, y) {
    const index = (y * width + x) * 4;
    if (data[index + 3] < 24)
        return;
    samples.push([data[index], data[index + 1], data[index + 2]]);
}
