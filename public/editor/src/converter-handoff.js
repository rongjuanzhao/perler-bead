import { takeConverterHandoff } from './handoff-store.js';
import { createProject, normalizeProject } from './project.js';

export async function readConverterHandoff() {
    const token = new URLSearchParams(location.search).get('handoff');
    if (!token) return null;
    const data = await takeConverterHandoff(token);
    if (!data) return null; // Reloads use the editor draft, not an old handoff.
    if (data.version !== 1 || Date.now() - data.createdAt > 86400000 ||
        !Number.isInteger(data.width) || data.width < 1 || data.width > 120 ||
        !Number.isInteger(data.height) || data.height < 1 || data.height > 120 ||
        !Array.isArray(data.palette) || !data.palette.length ||
        !Array.isArray(data.cells) || data.cells.length !== data.width * data.height) {
        throw new Error('The converter pattern could not be loaded. Return to the homepage and try again.');
    }
    const isMard = data.brand === 'MARD Basic' || data.brand === 'MARD Complete';
    const colors = data.palette.filter(color => !color.transparent).map(color => ({
        id: `${isMard ? 'mard' : data.brand.toLowerCase().replaceAll(' ', '-')}-${color.code.toLowerCase()}`,
        primaryBrand: isMard ? 'MARD' : data.brand,
        primaryCode: color.code,
        name: color.name,
        hex: color.hex,
        rgb: [1, 3, 5].map(offset => parseInt(color.hex.slice(offset, offset + 2), 16)),
        group: color.code.match(/^[A-Za-z]+/)?.[0] ?? data.brand,
        codes: { [isMard ? 'MARD' : data.brand]: color.code },
    }));
    const byCode = new Map(colors.map(color => [color.primaryCode, color.id]));
    const cells = data.cells.map(code => code === null ? null : byCode.get(code));
    if (cells.some(cell => cell === undefined)) throw new Error('The converter pattern contains an unknown color.');
    const project = createProject(data.width, data.height, data.fileName || 'Untitled Pattern');
    project.cells = cells;
    project.layers[0].cells = cells;
    project.activeBrand = isMard ? 'MARD' : data.brand;
    project.customPalette = { brand: data.brand, colors };
    project.editorPaletteMode = isMard ? (data.brand === 'MARD Basic' ? 'basic' : 'complete') : 'imported';
    project.converterConfig = { width: data.width, maxColors: data.maxColors, backgroundMode: data.backgroundMode };
    Object.assign(project.settings, { showGrid: data.showGrid, showColorCodes: data.showCodes, beadDisplayMode: data.beadShape });
    return {
        project: normalizeProject(project),
        imageFile: data.image ? new File([data.image], data.fileName || 'Source image', { type: data.image.type }) : null,
    };
}
