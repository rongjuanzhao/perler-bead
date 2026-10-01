import type { Metadata } from "next";
import { LegalPageShell, legalContactEmail } from "@/src/components/legal/LegalPageShell";
import { siteUrl } from "@/src/config/site";

const lastUpdated = "October 1, 2026";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the perlerbeadmake browser-based Perler bead pattern maker.",
  alternates: {
    canonical: siteUrl + "/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      description="These terms govern your use of perlerbeadmake and its browser-based Perler bead pattern maker."
      lastUpdated={lastUpdated}
    >
      <section>
        <h2>1. Agreement to these terms</h2>
        <p className="mt-3">
          By accessing or using perlerbeadmake, you agree to these Terms of Service and our <a href="/privacy-policy">Privacy Policy</a>. If you do not agree, do not use the website or tools. If you use the service for an organization, you confirm that you have authority to accept these terms for that organization.
        </p>
      </section>

      <section>
        <h2>2. The service</h2>
        <p className="mt-3">
          perlerbeadmake provides browser-based tools that convert images into fuse-bead or pixel-art patterns. Features may include image upload, brand-palette matching, pattern-size and color controls, grid and color-code previews, templates, editing tools, and downloadable pattern or color-list files. We may modify, improve, suspend, or discontinue features for maintenance, security, operational, or legal reasons.
        </p>
      </section>

      <section>
        <h2>3. Local processing and your files</h2>
        <p className="mt-3">
          The core converter processes selected images locally in a compatible browser and does not upload source images or generated patterns to our servers. You are responsible for saving, deleting, backing up, sharing, and securing files on your device. Browser compatibility, device performance, memory, image dimensions, and file format may affect results.
        </p>
      </section>

      <section>
        <h2>4. Your content and responsibilities</h2>
        <p className="mt-3">
          You retain your rights in images and other content you process. You represent that you have the rights, permissions, and legal authority necessary to use that content and to create, download, publish, or share the resulting pattern.
        </p>
        <p className="mt-3">
          You must not use the service to violate law, infringe intellectual-property or privacy rights, distribute harmful content or malware, interfere with the website, evade security controls, scrape the service abusively, or attempt unauthorized access to systems or another person&apos;s data.
        </p>
      </section>

      <section>
        <h2>5. Bead brands, palettes, and results</h2>
        <p className="mt-3">
          Brand names, product names, color codes, and trademarks such as Perler, Hama, Artkal, and MARD belong to their respective owners. Their appearance identifies compatible color collections and does not imply sponsorship, endorsement, or affiliation unless expressly stated.
        </p>
        <p className="mt-3">
          Palette values and color matching are provided as practical references. Screen calibration, lighting, manufacturing batches, material availability, image quality, and conversion settings can cause physical beads to differ from the preview. Verify important colors and quantities before purchasing materials or beginning a project.
        </p>
      </section>

      <section>
        <h2>6. Downloads and project use</h2>
        <p className="mt-3">
          Generated PNG, PDF, CSV, color-list, bead-count, and other downloadable outputs are provided for your personal or otherwise lawful use. You are responsible for checking dimensions, counts, color codes, print scale, and assembly instructions before relying on an output. The service does not guarantee that every generated pattern will be structurally suitable for a particular pegboard or finished craft.
        </p>
      </section>

      <section>
        <h2>7. Our intellectual property</h2>
        <p className="mt-3">
          We retain rights in the website, software, interface, original templates, branding, and original content, excluding rights in your source files and third-party materials. Subject to these terms, you receive a limited, revocable, non-transferable right to use the service for its intended purpose. You may not sell, sublicense, reverse engineer, or exploit the service itself except where applicable law expressly permits it.
        </p>
      </section>

      <section>
        <h2>8. Third-party services</h2>
        <p className="mt-3">
          The website may rely on or link to third-party services for hosting, delivery, analytics, fonts, advertising, or other functionality. Those services are governed by their own terms and privacy notices. We are not responsible for third-party content, products, availability, or practices.
        </p>
      </section>

      <section>
        <h2>9. Availability and no warranty</h2>
        <p className="mt-3">
          The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the fullest extent permitted by law, we do not guarantee uninterrupted availability, compatibility with every image or device, exact color reproduction, error-free calculations, continued availability of any palette, or fitness for a particular craft or commercial purpose. Verify outputs independently before relying on them.
        </p>
      </section>

      <section>
        <h2>10. Limitation of liability</h2>
        <p className="mt-3">
          To the fullest extent permitted by law, perlerbeadmake and its operators will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost data, materials, profits, goodwill, or opportunities arising from use of or inability to use the service. Nothing in these terms excludes liability that cannot legally be excluded or limits mandatory consumer rights.
        </p>
      </section>

      <section>
        <h2>11. Suspension and changes</h2>
        <p className="mt-3">
          We may restrict access when we reasonably believe these terms have been violated, the service is being abused, or use creates a security or legal risk. You may stop using the service at any time. We may revise these terms by posting an updated version and changing the date above. Continued use after the effective date constitutes acceptance where permitted by law.
        </p>
      </section>

      <section>
        <h2>12. Governing law and contact</h2>
        <p className="mt-3">
          These terms are governed by the laws applicable to the service operator, without regard to conflict-of-law rules, except where mandatory law provides otherwise. Disputes will be handled by a court with jurisdiction over the operator or as required by applicable law. For questions, contact <a href={"mailto:" + legalContactEmail}>{legalContactEmail}</a>.
        </p>
      </section>
    </LegalPageShell>
  );
}
