import { colorDistance, nearestPaletteColor, palette, rgbToOklab, oklabDistance } from './palette.js';

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
    },
};

/**
 * 核心拼豆图像转换入口（支持 File / Blob / HTMLImageElement / ImageData / HTMLCanvasElement）
 */
export async function convertSourceToBeads(source, options = {}) {
    const { data, sourceWidth, sourceHeight } = await extractSourceImageData(source);
    const width = Math.max(1, Math.round(options.width || 29));
    const height = Math.max(1, Math.round(options.height ?? ((sourceHeight / sourceWidth) * width)));

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

    const backgroundColor = options.backgroundColor ?? estimateBackgroundColor(data, sourceWidth, sourceHeight);
    const sampledCells = sampleGridCells(data, sourceWidth, sourceHeight, width, height, options, backgroundColor, profile, speckleStrength);
    const ranked = rankPaletteColors(sampledCells, options, activePalette, profile);
    const candidates = selectCandidateColors(ranked, Math.max(2, options.maxColors || 16), activePalette, speckleStrength, profile);

    // 确保候选色都拥有 oklab 属性
    candidates.forEach(color => {
        if (!color.oklab && color.rgb) {
            color.oklab = rgbToOklab(color.rgb);
        }
    });

    let cells;
    if (ditherStrength > 0) {
        cells = quantizeWithDithering(sampledCells, width, height, candidates, ditherStrength, profile);
    } else {
        cells = sampledCells.map(cell => chooseCellColor(cell, candidates, profile));
    }

    const mergedCells = mergeSimilarColors(cells, speckleStrength, candidates);
    const compactCells = reduceTinyRegions(mergedCells, width, height, speckleStrength, candidates);
    const reducedCells = reduceSpeckles(compactCells, width, height, speckleStrength, candidates);

    const colorsUsed = new Set(reducedCells.filter(Boolean)).size;
    const totalBeads = reducedCells.filter(Boolean).length;

    return {
        width,
        height,
        cells: reducedCells,
        colorsUsed,
        totalBeads,
        candidates,
    };
}

export async function imageFileToBeads(file, options) {
    return convertSourceToBeads(file, options);
}

async function extractSourceImageData(source) {
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

        const sourceWidth = Math.max(1, imageElement.naturalWidth || imageElement.width);
        const sourceHeight = Math.max(1, imageElement.naturalHeight || imageElement.height);
        const canvas = document.createElement('canvas');
        canvas.width = sourceWidth;
        canvas.height = sourceHeight;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) throw new Error('Canvas is not available.');
        context.imageSmoothingEnabled = true;
        context.drawImage(imageElement, 0, 0, sourceWidth, sourceHeight);
        const data = context.getImageData(0, 0, sourceWidth, sourceHeight).data;

        return { data, sourceWidth, sourceHeight };
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
 * 带有轮廓与边缘保护特性的网格采样
 */
function sampleGridCells(data, sourceWidth, sourceHeight, width, height, options, detectedBackgroundColor, profile, speckleStrength) {
    const cells = [];
    const totalSamples = profile.sampleSide * profile.sampleSide;
    const edgePreserve = profile.edgePreserve ?? false;

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const samples = [];
            let backgroundCount = 0;
            let weightedR = 0;
            let weightedG = 0;
            let weightedB = 0;
            let totalWeight = 0;

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
                    samples.push(simplified);

                    let weight = 1.0;
                    if (edgePreserve) {
                        const lum = luminance(simplified);
                        // 检测是否为深色轮廓边缘
                        const rightX = Math.min(sourceWidth - 1, sourceX + 1);
                        const bottomY = Math.min(sourceHeight - 1, sourceY + 1);
                        const rIdx = (sourceY * sourceWidth + rightX) * 4;
                        const bIdx = (bottomY * sourceWidth + sourceX) * 4;
                        const lumR = luminance([data[rIdx], data[rIdx + 1], data[rIdx + 2]]);
                        const lumB = luminance([data[bIdx], data[bIdx + 1], data[bIdx + 2]]);
                        const grad = Math.max(Math.abs(lum - lumR), Math.abs(lum - lumB));

                        if (lum < 75 && grad > 25) {
                            weight = 2.4;
                            darkEdgeSamples += 1;
                            edgeR += simplified[0];
                            edgeG += simplified[1];
                            edgeB += simplified[2];
                        }
                    }

                    weightedR += simplified[0] * weight;
                    weightedG += simplified[1] * weight;
                    weightedB += simplified[2] * weight;
                    totalWeight += weight;
                }
            }

            const avgRgb = totalWeight > 0
                ? [Math.round(weightedR / totalWeight), Math.round(weightedG / totalWeight), Math.round(weightedB / totalWeight)]
                : null;

            const edgeRgb = darkEdgeSamples > 0
                ? [Math.round(edgeR / darkEdgeSamples), Math.round(edgeG / darkEdgeSamples), Math.round(edgeB / darkEdgeSamples)]
                : null;

            cells.push({
                samples,
                average: avgRgb,
                averageLab: avgRgb ? rgbToOklab(avgRgb) : null,
                edgeRgb,
                edgeLab: edgeRgb ? rgbToOklab(edgeRgb) : null,
                edgeShare: samples.length > 0 ? darkEdgeSamples / samples.length : 0,
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

function chooseCellColor(cell, candidates, profile) {
    if (cell.backgroundShare >= profile.backgroundThreshold || cell.samples.length === 0)
        return null;

    // 边缘保护：若网格存在高对比深色轮廓，倾向保留线条
    if (profile.edgePreserve && cell.edgeLab && cell.edgeShare >= 0.22) {
        return nearestPaletteColor(cell.edgeLab, candidates).id;
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
    return nearestPaletteColor(cell.averageLab, candidates).id;
}

/**
 * Serpentine Floyd-Steinberg 误差扩散抖动（在 Oklab 感知空间中平滑扩散）
 */
function quantizeWithDithering(sampledCells, width, height, candidates, ditherStrength, profile) {
    const cells = new Array(width * height).fill(null);
    const errors = new Float32Array(width * height * 3);

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

            // 边缘保护优先
            if (profile.edgePreserve && cell.edgeLab && cell.edgeShare >= 0.25) {
                const edgeColor = nearestPaletteColor(cell.edgeLab, candidates);
                cells[cellIndex] = edgeColor.id;
                continue;
            }

            const baseLab = cell.averageLab;
            const errOffset = cellIndex * 3;

            let curL = baseLab[0] + errors[errOffset] * ditherStrength;
            let curA = baseLab[1] + errors[errOffset + 1] * ditherStrength;
            let curB = baseLab[2] + errors[errOffset + 2] * ditherStrength;

            curL = Math.max(0, Math.min(1, curL));
            curA = Math.max(-0.4, Math.min(0.4, curA));
            curB = Math.max(-0.4, Math.min(0.4, curB));

            const chosenColor = nearestPaletteColor([curL, curA, curB], candidates);
            cells[cellIndex] = chosenColor.id;

            const chosenLab = chosenColor.oklab;
            let diffL = curL - chosenLab[0];
            let diffA = curA - chosenLab[1];
            let diffB = curB - chosenLab[2];

            // 误差阻尼截断，防止产生过多杂色孤立豆
            const clampLimit = 0.18;
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
