import type { Metadata } from "next";
import { LegalPageShell, legalContactEmail } from "@/src/components/legal/LegalPageShell";

const lastUpdated = "August 29, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Video to Frames handles local video processing, cookies, analytics, and privacy choices.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description="This policy explains what information Video to Frames handles, why it is used, and the choices available to you."
      lastUpdated={lastUpdated}
    >
      <section>
        <h2>1. Who we are</h2>
        <p className="mt-3">
          Video to Frames (&quot;Video to Frames,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates video2frames.net and its browser-based video frame extraction tool. For privacy questions or requests, contact us at{" "}
          <a href={"mailto:" + legalContactEmail}>{legalContactEmail}</a>.
        </p>
      </section>

      <section>
        <h2>2. What this policy covers</h2>
        <p className="mt-3">
          This policy applies to the Video to Frames website, its core in-browser video frame extraction tool, Google Analytics, and any optional advertising technologies described below. It does not cover third-party sites, browsers, operating systems, or services that have their own privacy notices.
        </p>
      </section>

      <section>
        <h2>3. Video files and generated images</h2>
        <p className="mt-3">
          The core Video to Frames tool processes the video you select locally in your browser. It uses browser video and canvas APIs to generate the image frames you download. We do not receive, upload, store, inspect, or process the source video or generated images on our servers as part of this core tool.
        </p>
        <p className="mt-3">
          Your browser may keep temporary copies, object URLs, or downloaded files under its own rules. You control those files and can remove them from your device or browser.
        </p>
      </section>

      <section>
        <h2>4. Information we may process</h2>
        <h3>Technical and security information</h3>
        <p className="mt-2">
          When you visit the site, our hosting and security providers may process technical information such as IP address, browser and device information, requested URL, referring page, timestamps, and diagnostic or security logs. We use this information to deliver the site, prevent abuse, maintain security, and diagnose technical problems.
        </p>
        <h3>Messages you send us</h3>
        <p className="mt-2">
          If you email us, we process the contact details and message content you provide in order to respond, protect our rights, and keep appropriate records of the request.
        </p>
        <h3>Analytics and marketing data</h3>
        <p className="mt-2">
          Google Analytics helps us understand aggregate use of the site. It may process online identifiers, device/browser information, pages viewed, and interaction data. Basic analytics remains enabled if you choose the &quot;Basic analytics only&quot; option in the cookie banner. Marketing is separate: advertising technologies remain disabled unless you choose &quot;Accept all&quot; and an advertising component is enabled on a page.
        </p>
      </section>

      <section id="cookies">
        <h2>5. Cookies and similar storage</h2>
        <p className="mt-3">
          Cookies are small text files and similar storage mechanisms are used to remember information in your browser. We separate them by purpose:
        </p>
        <ul className="mt-3">
          <li><strong>Preference storage.</strong> The <code>cookieConsent</code> local-storage value records whether you chose &quot;Accept all&quot; or &quot;Basic analytics only.&quot; It remains on your device until you change the setting or clear browser storage.</li>
          <li><strong>Basic analytics.</strong> Google Analytics is loaded to measure aggregate use of the site. It may use cookies such as <code>_ga</code> and related identifiers according to Google&apos;s configuration and privacy documentation. Choosing &quot;Basic analytics only&quot; keeps analytics enabled while denying Google advertising and personalization storage.</li>
          <li><strong>Marketing.</strong> Choosing &quot;Accept all&quot; permits advertising or marketing technologies if they are enabled on a page. Their cookies and storage are controlled by the relevant provider.</li>
        </ul>
        <p className="mt-3">
          You can choose &quot;Accept all&quot; or &quot;Basic analytics only&quot; when the banner appears, and reopen it later through the Cookie settings link in the footer. Choosing &quot;Basic analytics only&quot; does not block access to the core tool and does not enable advertising or personalization storage. You can also control or delete analytics cookies through your browser settings.
        </p>
      </section>

      <section>
        <h2>6. Why we use information and our legal bases</h2>
        <ul className="mt-3">
          <li>To provide and secure the website and respond to requests, where necessary to provide the service or pursue legitimate interests in operating a secure service.</li>
          <li>To comply with legal obligations and enforce our rights where applicable.</li>
          <li>To measure aggregate use through basic analytics where permitted by applicable law, and to use marketing technologies only with your consent where consent is required.</li>
        </ul>
        <p className="mt-3">
          You may withdraw marketing consent at any time by reopening Cookie settings and choosing &quot;Basic analytics only.&quot; You can also use browser controls and applicable privacy rights to manage analytics cookies. A changed choice does not affect processing that occurred before the change.
        </p>
      </section>

      <section>
        <h2>7. Service providers and disclosures</h2>
        <p className="mt-3">
          We use service providers to host, deliver, secure, and support the site. These may include Cloudflare for hosting and delivery, Google for basic analytics, and advertising providers only where an advertising component is enabled and you chose &quot;Accept all.&quot; Providers process information under their own terms and privacy documentation and may process data in countries other than yours.
        </p>
        <p className="mt-3">
          We may also disclose information where reasonably necessary to comply with law, protect users or the public, investigate abuse, or protect our rights and property.
        </p>
      </section>

      <section>
        <h2>8. Retention and international transfers</h2>
        <p className="mt-3">
          The core tool does not send your video or extracted images to us. We retain technical logs and correspondence only for as long as reasonably necessary for the purposes above, legal obligations, dispute resolution, and security. The local Cookie preference remains until you change it or clear browser storage. Third-party retention periods are governed by the applicable provider&apos;s configuration and policies.
        </p>
        <p className="mt-3">
          Our providers may process information internationally. Where required, we use appropriate safeguards for international transfers, such as contractual protections or other legally recognized transfer mechanisms.
        </p>
      </section>

      <section>
        <h2>9. Your privacy rights</h2>
        <p className="mt-3">
          Depending on where you live and applicable law, you may have rights to request access to, correction of, deletion of, restriction of, or objection to processing of your personal information, as well as data portability. You may also withdraw consent and, where applicable, lodge a complaint with your local data-protection authority.
        </p>
        <p className="mt-3">
          To make a request, email <a href={"mailto:" + legalContactEmail}>{legalContactEmail}</a>. We may need to verify your request before acting on it. We do not offer personal information for payment. Certain marketing implementations may be treated as a sale or sharing under applicable law; choosing &quot;Basic analytics only&quot; in Cookie settings acts as an opt-out for marketing technologies in that browser.
        </p>
      </section>

      <section>
        <h2>10. Children and security</h2>
        <p className="mt-3">
          Video to Frames is not directed to children, and we do not knowingly collect personal information from children. Please do not send us personal information about a child without appropriate authority. We use reasonable technical and organizational measures to protect information, but no online service can guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>11. Changes to this policy</h2>
        <p className="mt-3">
          We may update this policy when the service, technologies, or legal requirements change. We will post the revised version here and update the date above. Material changes to optional tracking purposes will require a fresh choice where required by law.
        </p>
      </section>
    </LegalPageShell>
  );
}
