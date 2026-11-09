import { brandPalettes, paletteOptions } from './palettes/catalog.js';
export { paletteOptions };
export const brandLabels = { MARD: 'MARD' };
export const paletteVersion = 'mard-291-v1';
export const editorPalettes = Object.fromEntries(Object.entries(brandPalettes).map(([brand, colors]) => {
    const isMard = brand.startsWith('MARD ');
    return [brand, colors.filter(color => !color.transparent).map(color => ({
        id: `${isMard ? 'mard' : brand.toLowerCase().replaceAll(' ', '-')}-${color.code.toLowerCase()}`,
        primaryBrand: isMard ? 'MARD' : brand,
        primaryCode: color.code,
        name: color.name,
        hex: color.hex,
        rgb: hexToRgb(color.hex),
        group: color.code.match(/^[A-Za-z]+/)?.[0] ?? brand,
        codes: { [isMard ? 'MARD' : brand]: color.code },
    }))];
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
    for (const color of colors) projectColors.set(color.id, color);
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
    let best = candidates[0];
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const color of candidates) {
        const distance = colorDistance(rgb, color.rgb);
        if (distance < bestDistance) {
            best = color;
            bestDistance = distance;
        }
    }
    return best;
}
export function colorDistance(a, b) {
    const redMean = (a[0] + b[0]) / 2;
    const r = a[0] - b[0];
    const g = a[1] - b[1];
    const blue = a[2] - b[2];
    return Math.sqrt((2 + redMean / 256) * r * r + 4 * g * g + (2 + (255 - redMean) / 256) * blue * blue);
}
export function mappedCode(color, brand) {
    return color.codes[brand] ?? color.primaryCode;
}
//# sourceMappingURL=palette.js.map
