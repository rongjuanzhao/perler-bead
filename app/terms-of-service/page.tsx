import type { Metadata } from "next";
import { LegalPageShell, legalContactEmail } from "@/src/components/legal/LegalPageShell";

const lastUpdated = "August 29, 2026";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the Video to Frames browser-based video frame extraction tool.",
  alternates: {
    canonical: "/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      description="These terms explain the rules for using Video to Frames and the browser-based video frame extraction tool."
      lastUpdated={lastUpdated}
    >
      <section>
        <h2>1. Agreement to these terms</h2>
        <p className="mt-3">
          By accessing or using Video to Frames, you agree to these Terms of Service and our <a href="/privacy-policy">Privacy Policy</a>. If you do not agree, do not use the site or the tool. If you use the service for an organization, you confirm that you have authority to accept these terms for that organization.
        </p>
      </section>

      <section>
        <h2>2. The service</h2>
        <p className="mt-3">
          Video to Frames provides a free, browser-based tool for extracting still images from videos. The core processing takes place on your device in a compatible web browser. We may modify, improve, suspend, or discontinue features at any time, including for maintenance, security, or legal reasons.
        </p>
      </section>

      <section>
        <h2>3. Your responsibilities</h2>
        <p className="mt-3">
          You are responsible for the videos, images, and other content you choose to process. You represent that you have all rights, permissions, and legal authority needed to use that content and any extracted frames.
        </p>
        <p className="mt-3">
          You must not use the service to violate law, infringe intellectual-property or privacy rights, evade security measures, distribute malware, interfere with the service, or attempt unauthorized access to our systems or another person&apos;s data.
        </p>
      </section>

      <section>
        <h2>4. Local processing and your files</h2>
        <p className="mt-3">
          The core tool processes selected videos locally in your browser and does not upload the source video or extracted frames to our servers. You are responsible for keeping, deleting, backing up, sharing, and securing files on your device. Browser compatibility, codecs, device performance, and available memory can affect results.
        </p>
      </section>

      <section>
        <h2>5. Intellectual property</h2>
        <p className="mt-3">
          We retain all rights in the Video to Frames site, software, branding, and content, except for rights in your own files. Subject to these terms, we grant you a limited, revocable, non-transferable right to use the service for its intended purpose. You may not copy, sell, sublicense, reverse engineer, or exploit the service except where applicable law expressly permits it.
        </p>
      </section>

      <section>
        <h2>6. Third-party services</h2>
        <p className="mt-3">
          The service may use or link to third-party providers for hosting, basic analytics, advertising, or other functionality. Google Analytics and optional marketing technologies are governed by our Privacy Policy, your Cookie settings, and the provider&apos;s own terms and privacy notices. We are not responsible for third-party content, availability, or practices.
        </p>
      </section>

      <section>
        <h2>7. Availability and no warranty</h2>
        <p className="mt-3">
          The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the fullest extent permitted by law, we do not promise uninterrupted availability, compatibility with every video format, error-free results, or fitness for a particular purpose. You should independently verify any output before relying on it.
        </p>
      </section>

      <section>
        <h2>8. Limitation of liability</h2>
        <p className="mt-3">
          To the fullest extent permitted by law, Video to Frames and its operators will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of data, profits, goodwill, or business opportunity arising from your use of or inability to use the service. Nothing in these terms excludes liability that cannot legally be excluded or limited, including mandatory consumer rights.
        </p>
      </section>

      <section>
        <h2>9. Suspension and termination</h2>
        <p className="mt-3">
          We may suspend or restrict access if we reasonably believe you have violated these terms, created a security risk, or used the service unlawfully. You may stop using the service at any time.
        </p>
      </section>

      <section>
        <h2>10. Changes and contact</h2>
        <p className="mt-3">
          We may update these terms by posting a revised version on this page and changing the date above. Continued use after the effective date means you accept the revised terms, except where law requires additional notice or consent. If you have questions, contact <a href={"mailto:" + legalContactEmail}>{legalContactEmail}</a>.
        </p>
      </section>

      <section>
        <h2>11. Governing law and consumer rights</h2>
        <p className="mt-3">
          These terms are governed by the laws applicable to the operator of Video to Frames, without regard to conflict-of-law rules, except where mandatory law provides otherwise. Any dispute will be handled by a court with jurisdiction over the operator or as required by applicable law. Nothing in these terms removes rights you have under mandatory consumer-protection law.
        </p>
      </section>
    </LegalPageShell>
  );
}
