import { externalPalettes } from './brand-palettes.js';
import { mardBasicPalette, mardCompletePalette } from './mard-palettes.js';

// One catalog for the homepage converter, showcase, and standalone editor.
export const brandPalettes = {
    'MARD Basic': mardBasicPalette,
    'MARD Complete': mardCompletePalette,
    ...externalPalettes,
};
export const paletteOptions = Object.entries(brandPalettes).map(([value, colors]) => ({ value, count: colors.length }));
