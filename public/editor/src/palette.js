import { brandPalettes, paletteOptions } from './palettes/catalog.js';
export { paletteOptions };
export const brandLabels = { MARD: 'MARD' };
export const paletteVersion = 'mard-291-v1';

export function srgbToLinear(c) {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function linearToSrgb(c) {
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1 / 2.4) - 0.055;
    return Math.max(0, Math.min(255, Math.round(v * 255)));
}

export function rgbToOklab(rgb) {
    const r = srgbToLinear(rgb[0]);
    const g = srgbToLinear(rgb[1]);
    const b = srgbToLinear(rgb[2]);

    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

    return [
        0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
    ];
}

export function oklabToRgb(lab) {
    const l_ = lab[0] + 0.3963377774 * lab[1] + 0.2158037573 * lab[2];
    const m_ = lab[0] - 0.1055613458 * lab[1] - 0.0638541728 * lab[2];
    const s_ = lab[0] - 0.0894841775 * lab[1] - 1.2914855480 * lab[2];

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    return [
        linearToSrgb(+4.0767434778 * l - 3.3077115913 * m + 0.2309699299 * s),
        linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
        linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
    ];
}

export function oklabDistance(lab1, lab2) {
    const dL = lab1[0] - lab2[0];
    const da = lab1[1] - lab2[1];
    const db = lab1[2] - lab2[2];
    return Math.sqrt(dL * dL + 1.25 * (da * da + db * db)) * 720;
}

export const editorPalettes = Object.fromEntries(Object.entries(brandPalettes).map(([brand, colors]) => {
    const isMard = brand.startsWith('MARD ');
    return [brand, colors.filter(color => !color.transparent).map(color => {
        const rgb = hexToRgb(color.hex);
        return {
            id: `${isMard ? 'mard' : brand.toLowerCase().replaceAll(' ', '-')}-${color.code.toLowerCase()}`,
            primaryBrand: isMard ? 'MARD' : brand,
            primaryCode: color.code,
            name: color.name,
            hex: color.hex,
            rgb,
            oklab: rgbToOklab(rgb),
            group: color.code.match(/^[A-Za-z]+/)?.[0] ?? brand,
            codes: { [isMard ? 'MARD' : brand]: color.code },
        };
    })];
}));
export const basicPalette = editorPalettes['MARD Basic'];
export const completePalette = editorPalettes['MARD Complete'];
export const palette = basicPalette;
const catalogColors = new Map(Object.values(editorPalettes).flat().map(color => [color.id, color]));
export function resolvePaletteMode(project) {
    const mode = project.editorPaletteMode;
    if (mode === 'basic') return 'MARD Basic';
    if (mode === 'complete') return 'MARD Complete';
    if (mode === 'imported') return project.customPalette?.brand ?? 'MARD Basic';
    return editorPalettes[mode] || mode === project.customPalette?.brand ? mode : 'MARD Basic';
}
export function getProjectPalette(project) {
    const mode = resolvePaletteMode(project);
    return editorPalettes[mode] ?? project.customPalette?.colors ?? basicPalette;
}
const projectColors = new Map();
export function registerProjectPalette(colors = []) {
    for (const color of colors) {
        if (!color.oklab && color.rgb) {
            color.oklab = rgbToOklab(color.rgb);
        }
        projectColors.set(color.id, color);
    }
}
export function hexToRgb(hex) {
    const normalized = hex.replace('#', '');
    const value = Number.parseInt(normalized, 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
export function getColor(id) {
    if (!id)
        return undefined;
    return projectColors.get(id) ?? catalogColors.get(id);
}
export function nearestPaletteColor(rgb, candidates = palette) {
    const targetLab = Array.isArray(rgb) && rgb.length === 3 ? rgbToOklab(rgb) : rgb;
    let best = candidates[0];
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < candidates.length; i++) {
        const color = candidates[i];
        if (!color.oklab) {
            color.oklab = rgbToOklab(color.rgb);
        }
        const dL = targetLab[0] - color.oklab[0];
        const da = targetLab[1] - color.oklab[1];
        const db = targetLab[2] - color.oklab[2];
        const distance = dL * dL + 1.25 * (da * da + db * db);
        if (distance < bestDistance) {
            best = color;
            bestDistance = distance;
        }
    }
    return best;
}
export function colorDistance(a, b) {
    const labA = a?.oklab ?? (Array.isArray(a) ? rgbToOklab(a) : (a?.rgb ? rgbToOklab(a.rgb) : null));
    const labB = b?.oklab ?? (Array.isArray(b) ? rgbToOklab(b) : (b?.rgb ? rgbToOklab(b.rgb) : null));
    if (labA && labB) {
        return oklabDistance(labA, labB);
    }
    const rgbA = Array.isArray(a) ? a : (a?.rgb ?? [0, 0, 0]);
    const rgbB = Array.isArray(b) ? b : (b?.rgb ?? [0, 0, 0]);
    const redMean = (rgbA[0] + rgbB[0]) / 2;
    const r = rgbA[0] - rgbB[0];
    const g = rgbA[1] - rgbB[1];
    const blue = rgbA[2] - rgbB[2];
    return Math.sqrt((2 + redMean / 256) * r * r + 4 * g * g + (2 + (255 - redMean) / 256) * blue * blue);
}
export function mappedCode(color, brand) {
    return color.codes[brand] ?? color.primaryCode;
}
//# sourceMappingURL=palette.js.map
