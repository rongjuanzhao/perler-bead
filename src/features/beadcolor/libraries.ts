import { externalPalettes, type BrandSwatch } from "@/src/components/bead-studio/brand-palettes";
import { mardBasicPalette, mardCompletePalette } from "@/src/components/bead-studio/mard-palettes";

export type ColorLibrary = {
  slug: string;
  name: string;
  series: string;
  reference: string;
  description: string;
  note: string;
  source: string;
  sourceName: string;
  colors: BrandSwatch[];
  group: "brands" | "mard";
};

export const colorLibraries: ColorLibrary[] = [
  { slug: "perler", name: "Perler", series: "Midi · 5 mm", reference: "Community reference", description: "Familiar names, P and C reference codes, and a colorful Midi collection.", note: "Community screen values supplied by BeadColor through MakeBead and maxcleme/beadcolors. Reference codes are not retail item numbers.", source: "https://beadcolor.com/perler-color-chart", sourceName: "BeadColor · Perler reference", colors: externalPalettes.Perler, group: "brands" },
  { slug: "hama", name: "Hama", series: "Midi · 5 mm", reference: "Community reference", description: "Explore classic colors, pastels, neons, and translucent Midi shades.", note: "Community measurements from the BeadSheet Hama Midi chart. Transparent and special finishes are represented by approximate screen colors.", source: "https://beadsheet.com/hama-bead-color-chart/", sourceName: "BeadSheet · Hama reference", colors: externalPalettes.Hama, group: "brands" },
  { slug: "artkal-s", name: "Artkal S", series: "Midi · 5 mm", reference: "Manufacturer RGB reference", description: "The S-series colors with numeric values in Artkal’s RGB chart.", note: "173 numeric entries from the official 2024 chart, including SE01–SE17. S41, S42 and S63 have no numeric RGB and are excluded. This is not the entire range advertised by the manufacturer.", source: "https://www.artkalfusebeads.com/pages/s-color-chart", sourceName: "Artkal · S color chart", colors: externalPalettes["Artkal S"], group: "brands" },
  { slug: "artkal-c", name: "Artkal C", series: "Mini · 2.6 mm", reference: "Manufacturer RGB reference", description: "Mini beads, big possibilities. Browse the C and CE color families.", note: "173 entries from the official 2024 RGB chart. C35 has no numeric RGB and is excluded. C152 uses the PDF’s embedded swatch RGB (189, 199, 237) because its printed blue value is invalid.", source: "https://www.artkalfusebeads.com/pages/c-color-chart", sourceName: "Artkal · C color chart", colors: externalPalettes["Artkal C"], group: "brands" },
  { slug: "artkal-m", name: "Artkal M", series: "Mini · 2.6 mm", reference: "Manufacturer + community", description: "A 221-color Mini collection with MA–MH and MM reference codes.", note: "220 entries are transcribed from Artkal’s official RGB PDF by HansBug. MH1 is a community transparent display placeholder, not a measured RGB value, and is excluded from automatic photo matching.", source: "https://github.com/HansBug/pindou-color-data/tree/main/artkal-m-221-official", sourceName: "HansBug · Artkal M dataset", colors: externalPalettes["Artkal M"], group: "brands" },
  { slug: "coco", name: "COCO", series: "291-color collection", reference: "Community reference", description: "Discover a generous palette of soft neutrals, bright hues, and rich shades.", note: "Third-party screen reference data supplied by HansBug/pindou-color-data. These are not official COCO manufacturer RGB standards.", source: "https://github.com/HansBug/pindou-color-data/tree/main/coco-291", sourceName: "HansBug · COCO dataset", colors: externalPalettes.COCO, group: "brands" },
  { slug: "mard-basic", name: "MARD Basic", series: "Standard collection", reference: "Community reference", description: "The standard 221-color library, covering the A–H and M families.", note: "Community reference from the Perler Beads Generator project. This collection is the standard subset of MARD Complete.", source: "https://github.com/Jett-Wu/Perler_Beads_Generator", sourceName: "Perler Beads Generator · MARD", colors: mardBasicPalette, group: "mard" },
  { slug: "mard-complete", name: "MARD Complete", series: "Extended collection", reference: "Community reference", description: "All 221 standard shades, plus 70 extension colors to explore.", note: "Community reference from the Perler Beads Generator project. Includes the standard palette and its 70 extension colors.", source: "https://github.com/Jett-Wu/Perler_Beads_Generator", sourceName: "Perler Beads Generator · MARD", colors: mardCompletePalette, group: "mard" },
];

export const totalColorReferences = colorLibraries.reduce((total, library) => total + library.colors.length, 0);
