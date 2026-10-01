import type { Metadata } from "next";
import BeadHomePage from "@/src/features/bead-home/BeadHomePage";
import { enMessages } from "@/src/features/bead-home/messages/en";
import { siteUrl } from "@/src/config/site";

export const metadata: Metadata = {
  title: {
    absolute: enMessages.metadata.title,
  },
  description: enMessages.metadata.description,
  keywords: enMessages.metadata.keywords,
  alternates: {
    canonical: siteUrl + "/",
    languages: {
      en: siteUrl + "/",
      "x-default": siteUrl + "/",
    },
  },
  openGraph: {
    title: enMessages.metadata.openGraphTitle,
    description: enMessages.metadata.openGraphDescription,
    type: "website",
    url: siteUrl + "/",
    siteName: enMessages.metadata.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: enMessages.metadata.twitterTitle,
    description: enMessages.metadata.twitterDescription,
  },
};

export default function RootPage() {
  return <BeadHomePage messages={enMessages} />;
}
