import type { HomeMessages } from "./messages/types";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Steps from "./components/Steps";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import QuickConverter from "./QuickConverter.client";
import TemplateGallery from "./TemplateGallery.client";
import PaletteShowcase from "./PaletteShowcase.client";

export default function BeadHomePage({ messages }: { messages: HomeMessages }) {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: messages.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main className="bead-shell">
      <Header messages={messages.header} />
      <section className="studio-panel" id="quick-studio" aria-label={messages.converter.sectionLabel}>
        <Hero messages={messages.hero} />
        <QuickConverter messages={messages.converter} />
      </section>
      <TemplateGallery messages={messages.templates} />
      <Steps messages={messages.steps} />
      <PaletteShowcase messages={messages.palette} />
      <FAQ messages={messages.faq} />
      <Footer messages={messages.footer} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
    </main>
  );
}
