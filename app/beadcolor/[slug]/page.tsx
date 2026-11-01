import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ColorChart from "@/src/features/beadcolor/ColorChart.client";
import { colorLibraries } from "@/src/features/beadcolor/libraries";
import { siteUrl } from "@/src/config/site";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return colorLibraries.map(library => ({ slug: library.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const library = colorLibraries.find(item => item.slug === slug);
  if (!library) return {};
  return { title: `${library.name} Color Chart: ${library.colors.length} Colors, HEX & RGB`, description: `Explore ${library.colors.length} ${library.name} bead color references with original codes, HEX and RGB values, source notes and a downloadable JSON palette.`, alternates: { canonical: `${siteUrl}/beadcolor/${slug}` } };
}
export default async function ColorChartPage({ params }: Props) {
  const { slug } = await params;
  const library = colorLibraries.find(item => item.slug === slug);
  if (!library) notFound();
  return <ColorChart key={library.slug} library={library} />;
}
