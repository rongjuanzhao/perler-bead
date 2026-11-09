import { brandPalettes } from "../../../public/editor/src/palettes/catalog.js";
import type { BrandSwatch, PaletteBrand } from "@/src/components/bead-studio/brand-palettes";
import type { PatternTemplateData } from "./template-data";

export type MatchedTemplate = PatternTemplateData & {
  brand: PaletteBrand;
  swatches: Record<string, BrandSwatch>;
  usage: Array<BrandSwatch & { count: number }>;
};

const rgb = (hex: string) => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));

export function matchTemplatePalette(template: PatternTemplateData, brand: PaletteBrand): MatchedTemplate {
  const palette: BrandSwatch[] = brandPalettes[brand].filter((color: BrandSwatch) => !color.transparent);
  const swatches = Object.fromEntries(Object.entries(template.colors).map(([key, hex]) => {
    const source = rgb(hex);
    const distance = (color: BrandSwatch) => rgb(color.hex).reduce((sum, channel, i) => sum + (channel - source[i]) ** 2 * [.3, .59, .11][i], 0);
    const nearest = palette.reduce((best, color) => distance(color) < distance(best) ? color : best);
    return [key, nearest];
  }));
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
