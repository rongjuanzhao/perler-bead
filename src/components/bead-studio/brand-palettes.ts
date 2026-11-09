export type BrandSwatch = { name: string; hex: string; code: string; transparent?: boolean };
export type PaletteBrand = "MARD Basic" | "MARD Complete" | "Perler" | "Hama" | "Artkal S" | "Artkal C" | "Artkal M" | "COCO";

// Shared with the standalone editor.
import { externalPalettes as sharedExternalPalettes } from "../../../public/editor/src/palettes/brand-palettes.js";
export const externalPalettes: Record<Exclude<PaletteBrand, "MARD Basic" | "MARD Complete">, BrandSwatch[]> = sharedExternalPalettes;
