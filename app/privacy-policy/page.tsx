import type { Metadata } from "next";
import { LegalPageShell, legalContactEmail } from "@/src/components/legal/LegalPageShell";
import { siteUrl } from "@/src/config/site";

const lastUpdated = "October 1, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How the Perler Bead Pattern Maker handles local image processing, analytics, cookies, and privacy choices.",
  alternates: {
    canonical: siteUrl + "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description="This policy explains how perlerbeadmake handles images, technical data, analytics, cookies, and your privacy choices."
      lastUpdated={lastUpdated}
    >
      <section>
        <h2>1. Who we are</h2>
        <p className="mt-3">
          perlerbeadmake (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates <a href={siteUrl}>perlerbead.net</a> and provides a browser-based Perler bead pattern maker. For privacy questions or requests, contact us at{" "}
          <a href={"mailto:" + legalContactEmail}>{legalContactEmail}</a>.
        </p>
      </section>

      <section>
        <h2>2. What this policy covers</h2>
        <p className="mt-3">
          This policy applies to this website, its image-to-bead-pattern converter, template gallery, palette preview, pattern editor, downloadable output, analytics, and optional advertising technologies. Third-party websites, browsers, operating systems, and services have their own privacy practices.
        </p>
      </section>

      <section>
        <h2>3. Images and generated patterns</h2>
        <p className="mt-3">
          Images selected in the converter are processed locally in your browser using browser image and canvas APIs. The converter does not upload your source image, generated pattern, or color list to our servers. Your image remains on your device while you adjust the bead brand, pattern size, color limit, background, bead shape, grid, and color-code settings.
        </p>
        <p className="mt-3">
          Downloads such as PNG patterns and color or bead-count lists are created in your browser. Your browser may retain temporary object URLs, cached resources, or downloaded files according to its own settings. You control and may delete those files from your device.
        </p>
      </section>

      <section>
        <h2>4. Information we may process</h2>
        <h3>Technical and security information</h3>
        <p className="mt-2">
          When you visit the site, our hosting and security providers may process your IP address, browser and device information, requested URL, referring page, timestamps, and diagnostic or security logs. This information is used to deliver the site, prevent abuse, maintain security, and investigate technical problems.
        </p>
        <h3>Messages you send us</h3>
        <p className="mt-2">
          If you contact us, we process the contact details and message content you provide so we can respond, protect our rights, and keep appropriate records.
        </p>
        <h3>Analytics and marketing data</h3>
        <p className="mt-2">
          Google Analytics helps us understand aggregate site usage and may process online identifiers, browser or device details, pages viewed, and interaction data. Basic analytics remains enabled when you choose &quot;Basic analytics only.&quot; Advertising or personalization storage remains disabled unless you choose &quot;Accept all&quot; and an advertising component is enabled.
        </p>
      </section>

      <section id="cookies">
        <h2>5. Cookies and similar storage</h2>
        <p className="mt-3">We use browser storage and cookies for the following purposes:</p>
        <ul className="mt-3">
          <li><strong>Preference storage.</strong> The <code>cookieConsent</code> local-storage value remembers whether you selected &quot;Accept all&quot; or &quot;Basic analytics only.&quot;</li>
          <li><strong>Basic analytics.</strong> Google Analytics may use <code>_ga</code> and related identifiers to measure aggregate site usage. Advertising and personalization storage are denied under the basic option.</li>
          <li><strong>Marketing.</strong> Selecting &quot;Accept all&quot; permits optional advertising or marketing technologies when they are present on a page.</li>
        </ul>
        <p className="mt-3">
          You can reopen Cookie settings from the footer at any time. Selecting basic analytics does not restrict access to the pattern maker. You can also remove cookies and local-storage values through your browser settings.
        </p>
      </section>

      <section>
        <h2>6. Why we use information</h2>
        <ul className="mt-3">
          <li>To provide, maintain, secure, and improve the website and pattern-making tools.</li>
          <li>To respond to messages, enforce our terms, prevent misuse, and comply with legal obligations.</li>
          <li>To understand aggregate use through analytics where permitted by law.</li>
          <li>To use optional marketing technologies only when the required consent has been provided.</li>
        </ul>
      </section>

      <section>
        <h2>7. Service providers and disclosures</h2>
        <p className="mt-3">
          We may use providers such as Cloudflare for hosting, delivery, and security, and Google for analytics. Optional advertising providers are used only where their components are enabled and your consent choice permits them. These providers process information under their own terms and privacy policies and may process data in countries other than yours.
        </p>
        <p className="mt-3">
          We may disclose information when reasonably necessary to comply with law, investigate abuse, protect users or the public, or defend our rights and property.
        </p>
      </section>

      <section>
        <h2>8. Retention and international transfers</h2>
        <p className="mt-3">
          We do not retain source images or generated patterns through the converter because those files are not sent to us. Technical logs and correspondence are retained only as long as reasonably necessary for operations, security, legal obligations, and dispute resolution. Cookie preferences remain on your device until changed or cleared. Third-party retention is governed by each provider&apos;s policies and configuration.
        </p>
        <p className="mt-3">
          Service providers may process information internationally. Where required, appropriate contractual or other legally recognized safeguards are used.
        </p>
      </section>

      <section>
        <h2>9. Your privacy rights</h2>
        <p className="mt-3">
          Depending on your location, you may have rights to request access to, correction of, deletion of, restriction of, or objection to processing of personal information, as well as portability and withdrawal of consent. You may also have the right to complain to a data-protection authority.
        </p>
        <p className="mt-3">
          To submit a request, email <a href={"mailto:" + legalContactEmail}>{legalContactEmail}</a>. We may need to verify a request before responding. You can withdraw optional marketing consent through Cookie settings at any time.
        </p>
      </section>

      <section>
        <h2>10. Children and security</h2>
        <p className="mt-3">
          The service is not directed to children under the age at which parental consent is required in their location, and we do not knowingly collect personal information from children. We use reasonable safeguards to protect information, but no online service can guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>11. Changes to this policy</h2>
        <p className="mt-3">
          We may update this policy when the service, technology, or legal requirements change. The revised version will be posted on this page with an updated date. Where required, material changes to optional tracking will be presented for a new consent choice.
        </p>
      </section>
    </LegalPageShell>
  );
}
