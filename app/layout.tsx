import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from "@/src/components/analytics/CookieConsent";
import GoogleAnalytics from "@/src/components/analytics/GoogleAnalytics";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://beadloom.studio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Beadloom: Image to Bead Pattern Maker",
    template: "%s | Beadloom",
  },
  description:
    "Turn images into original fuse-bead patterns with a free, private in-browser converter.",
  applicationName: "Beadloom",
  icons: {
    icon: [{ url: "/logo.jpg", type: "image/jpeg" }],
    shortcut: "/logo.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
