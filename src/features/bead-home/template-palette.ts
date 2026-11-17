import { brandPalettes } from "../../../public/editor/src/palettes/catalog.js";
import { rgbToOklab, oklabDistance } from "../../../public/editor/src/palette.js";
import type { BrandSwatch, PaletteBrand } from "@/src/components/bead-studio/brand-palettes";
import type { PatternTemplateData } from "./template-data";

export type MatchedTemplate = PatternTemplateData & {
  brand: PaletteBrand;
  swatches: Record<string, BrandSwatch>;
  usage: Array<BrandSwatch & { count: number }>;
};

const hexToRgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

export function matchTemplatePalette(template: PatternTemplateData, brand: PaletteBrand): MatchedTemplate {
  const palette: BrandSwatch[] = brandPalettes[brand].filter((color: BrandSwatch) => !color.transparent);
  const paletteWithLab = palette.map((color) => ({
    color,
    lab: rgbToOklab(hexToRgb(color.hex)),
  }));

  const swatches = Object.fromEntries(
    Object.entries(template.colors).map(([key, hex]) => {
      const sourceLab = rgbToOklab(hexToRgb(hex));
      let best = paletteWithLab[0];
      let bestDist = Number.POSITIVE_INFINITY;
      for (let i = 0; i < paletteWithLab.length; i++) {
        const item = paletteWithLab[i];
        const dist = oklabDistance(sourceLab, item.lab);
        if (dist < bestDist) {
          best = item;
          bestDist = dist;
        }
      }
      return [key, best.color];
    })
  );
  // Several source colors can map to one brand code; count those beads together.
  const usage = new Map<string, BrandSwatch & { count: number }>();
  template.rows.forEach((row) => Array.from(row).forEach((key) => {
    if (key === ".") return;
    const color = swatches[key];
    const entry = usage.get(color.code) ?? { ...color, count: 0 };
    entry.count++;
    usage.set(color.code, entry);
  }));
  return {
    ...template,
    brand,
    swatches,
    colors: Object.fromEntries(Object.entries(swatches).map(([key, color]) => [key, color.hex])),
    usage: Array.from(usage.values()),
  };
}
