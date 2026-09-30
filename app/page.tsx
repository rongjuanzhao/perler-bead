import type { Metadata } from "next";
import BeadStudio from "@/src/components/bead-studio/BeadStudio";

export const metadata: Metadata = {
  title: {
    absolute: "Free Perler Bead Pattern Maker | Image to Pattern | Beadloom",
  },
  description: "Create a Perler bead pattern from any photo with Beadloom's free online pattern maker. Match real fuse bead colors and export a printable PNG pattern and color list.",
  keywords: [
    "perler bead pattern",
    "perler bead pattern maker",
    "perler bead patterns",
    "image to bead pattern",
    "photo to bead pattern",
    "fuse bead pattern",
    "bead pattern generator",
    "printable perler bead pattern",
    "pixel art converter",
    "hama bead pattern",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Free Perler Bead Pattern Maker | Beadloom",
    description: "Turn any photo into a color-matched Perler bead pattern with a printable grid, color codes, and bead counts.",
    type: "website",
    url: "/",
    siteName: "Beadloom",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Perler Bead Pattern Maker | Beadloom",
    description: "Create a printable Perler bead pattern from any photo for free.",
  },
};

export default function RootPage() {
  return <BeadStudio />;
}
