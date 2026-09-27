import type { Metadata } from "next";
import BeadStudio from "@/src/components/bead-studio/BeadStudio";

export const metadata: Metadata = {
  title: {
    absolute: "Beadloom — Image to Bead Pattern Maker",
  },
  description: "Turn images into original fuse-bead patterns with an in-browser pixel grid and color guide.",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Beadloom — Image to Bead Pattern Maker",
    description: "Make a color-matched bead pattern from any image.",
    type: "website",
    url: "/",
    siteName: "Beadloom",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beadloom — Image to Bead Pattern Maker",
    description: "Make a color-matched bead pattern from any image.",
  },
};

export default function RootPage() {
  return <BeadStudio />;
}
