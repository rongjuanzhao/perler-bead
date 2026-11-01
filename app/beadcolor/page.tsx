import type { Metadata } from "next";
import ColorCatalog from "@/src/features/beadcolor/ColorCatalog";
import { siteUrl } from "@/src/config/site";

export const metadata: Metadata = {
  title: "BeadColor: Perler, Hama, Artkal, MARD & COCO Color Charts",
  description: "Explore the bead color libraries in our pattern maker. Browse Perler, Hama, Artkal S, C and M, MARD, and COCO codes, HEX and RGB references.",
  alternates: { canonical: `${siteUrl}/beadcolor` },
};

export default function BeadColorPage() { return <ColorCatalog />; }
