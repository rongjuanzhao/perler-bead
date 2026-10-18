import Link from "next/link";
import styles from "./CrossStitchDesigner.module.css";

export function CrossStitchHero() {
  return (
    <section className={styles.hero}>
      <div>
        <p className={styles.eyebrow}>STITCH IT, ONE CROSS AT A TIME</p>
        <h1>Design your own <em>cross stitch.</em></h1>
        <p>Draw an original chart stitch by stitch with real DMC floss colors, then export a printable PDF with a symbol legend and full thread list. Everything stays on your device.</p>
      </div>
      <div className={styles.heroPixels} aria-hidden="true">
        {Array.from({ length: 42 }, (_, index) => <i key={index} />)}
      </div>
    </section>
  );
}

const steps = [
  ["01", "Set up the grid", "Choose a preset or enter a custom width and height from 4 to 100 stitches. Pick the dimensions from the finished project you want to make."],
  ["02", "Choose DMC floss colors", "Search the palette by DMC code, select a color, then click or drag across the grid to place individual stitches."],
  ["03", "Build the chart in sections", "Sketch the main motif first, add borders and smaller details, and use fill, picker, eraser, undo, and redo as the design develops."],
  ["04", "Export a stitching guide", "Open the print-ready export with a color chart, symbol chart, and a thread list showing every DMC code and stitch count."],
] as const;

const features = [
  ["DMC embroidery palette", "Design with real floss codes so every chart color corresponds to thread you can source for the finished piece."],
  ["Four focused tools", "Place stitches with the pen, color connected areas with fill, sample existing stitches, or erase cells back to bare fabric."],
  ["Adjustable chart size", "Use a quick preset or create any rectangular grid from 4 × 4 up to 100 × 100 stitches."],
  ["Non-destructive resizing", "Change the chart dimensions while preserving stitches that remain inside the overlapping area."],
  ["Undo and redo", "Move backward and forward through up to 50 drawing changes while testing layouts and color combinations."],
  ["Starter templates", "Load a small ready-made motif to explore the editor or use it as a starting point for a custom chart."],
  ["Symbol and color charts", "The print view includes both a full-color chart and a high-contrast symbol chart with heavier lines every ten stitches."],
  ["Thread usage list", "See each DMC code beside its chart symbol, color swatch, and exact number of stitches before buying supplies."],
] as const;

const tools = [
  ["/pixel-art", "Pixel Art Maker", "Draw icons, motifs, and grid-based artwork with a custom color palette and transparent PNG export."],
  ["/sprite-maker", "Sprite Maker", "Turn pixel drawings into frame-by-frame animation and export a GIF or game-ready sprite sheet."],
  ["/editor", "Perler Bead Designer", "Create a bead pattern from scratch in the full editor and refine every cell of the design."],
  ["/", "Image Pattern Converter", "Convert a photo into a gridded craft pattern when you would rather start from an existing image."],
] as const;

const faqs = [
  ["What is the difference between a designer and a photo converter?", "A designer starts with a blank grid and lets you place every stitch yourself. A converter analyzes an existing image and generates a first draft automatically. Use the designer for original lettering, borders, geometric motifs, and charts that do not begin as photographs."],
  ["What grid size should I choose?", "A 30 × 30 grid suits a small motif, while 50 × 70 gives a sampler more room. The right choice depends on your fabric count and desired finished dimensions, and the editor accepts any width and height from 4 to 100 stitches."],
  ["How does fabric count affect the finished size?", "Fabric count is the number of stitches per inch. Divide the chart's stitch width and height by the fabric count to estimate the stitched dimensions. The chart itself stays the same when you switch fabric; only its physical size changes."],
  ["Does the export include a symbol chart?", "Yes. Each used DMC color receives a distinct symbol. The print-ready export includes color and symbol charts plus a legend with DMC codes and stitch counts."],
  ["Can I resize a chart after I start drawing?", "Yes. Stitches inside the area shared by the old and new grid are preserved. If you make the grid smaller, stitches outside the new boundaries cannot be retained, so resize carefully."],
  ["How do I save the chart as a PDF?", "Choose Export PDF to open the browser's print dialog, then select Save as PDF. The printable layout contains the charts and thread key rather than the editor controls."],
] as const;

export function CrossStitchInformation() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <div className={styles.information}>
      <section className={styles.infoSection} id="how-to-design-a-cross-stitch-pattern">
        <p className={styles.eyebrow}>FROM BLANK GRID TO PRINTABLE CHART</p>
        <h2>How to Design a Cross Stitch Pattern</h2>
        <p className={styles.sectionIntro}>Plan the dimensions, place each stitch, and produce a practical guide for the fabric.</p>
        <ol className={styles.infoGrid}>
          {steps.map(([number, title, copy]) => (
            <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>
          ))}
        </ol>
      </section>

      <section className={styles.infoSection} id="cross-stitch-designer-features">
        <p className={styles.eyebrow}>EVERYTHING NEEDED TO BUILD A CHART</p>
        <h2>Features</h2>
        <p className={styles.sectionIntro}>Work stitch by stitch with familiar drawing controls and export the details needed at the hoop.</p>
        <div className={styles.featureGrid}>
          {features.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className={`${styles.infoSection} ${styles.definition}`} id="what-is-a-cross-stitch-pattern-designer">
        <p className={styles.eyebrow}>A BLANK CANVAS FOR NEEDLEWORK</p>
        <h2>What Is a Cross Stitch Pattern Designer?</h2>
        <p>A cross stitch pattern designer is a grid-based drawing tool for creating an original chart one stitch at a time. Unlike a photo converter, it does not decide the shapes or colors for you. You control the placement of every cross, which makes it especially useful for monograms, geometric borders, small motifs, and typographic samplers.</p>
        <p>Each colored cell represents one full cross stitch and is tied to a DMC embroidery floss code. That direct relationship turns the screen design into a useful materials plan: the exported legend identifies the thread colors and counts how many stitches use each one.</p>
        <p>This browser-based designer combines the blank grid, floss palette, editing tools, templates, and print layout in one workspace. You can test an idea at several sizes before committing it to fabric.</p>
      </section>

      <section className={styles.infoSection} id="planning-an-original-cross-stitch-chart">
        <p className={styles.eyebrow}>PLAN BEFORE YOU THREAD THE NEEDLE</p>
        <h2>Planning an Original Cross Stitch Chart</h2>
        <div className={styles.articleGrid}>
          <article>
            <h3>Turn stitch count into finished size</h3>
            <p>Fabric count tells you how many stitches fit in one inch. Divide the chart dimensions by that number: a 56 × 70 design on 14-count Aida stitches out to approximately 4 × 5 inches. The same chart will be larger on 11-count and smaller on 18-count.</p>
            <p>Add generous blank fabric around the stitched area for a hoop, finishing, or framing. Planning that allowance now avoids discovering later that a centered design has too little border.</p>
          </article>
          <article>
            <h3>Keep the palette intentional</h3>
            <p>Every additional color means another floss purchase, chart symbol, and thread change. Start with the colors that define the subject, then add shades only when they make an important edge or form clearer.</p>
            <p>Before exporting, review colors with very small stitch counts. A nearby shade may be able to absorb those isolated stitches and make the project easier to read and sew.</p>
          </article>
          <article>
            <h3>Lay out motifs and lettering first</h3>
            <p>Place the largest or central motif before decorating the surrounding space. For text, decide on a consistent letter height and spacing before drawing the full phrase; even one extra column between letters changes the total width.</p>
            <p>Use the grid center and ten-stitch intervals as landmarks. Working outward from a clear anchor helps keep borders balanced and makes the printed chart easier to follow.</p>
          </article>
          <article>
            <h3>Estimate the stitching commitment</h3>
            <p>Canvas area grows quickly: a filled 100 × 100 chart can contain ten thousand stitches. Empty background cells reduce that total, while a stitched background can turn a small-looking design into a much longer project.</p>
            <p>Check the live stitch total and the exported per-color counts. They are useful for simplifying dense areas, comparing versions, and estimating how much floss the project will require.</p>
          </article>
        </div>
      </section>

      <section className={styles.infoSection} id="more-free-design-tools">
        <p className={styles.eyebrow}>KEEP CREATING</p>
        <h2>More Free Design Tools</h2>
        <p className={styles.sectionIntro}>Try another blank-canvas editor or start a pattern from an image.</p>
        <div className={styles.toolCards}>
          {tools.map(([href, title, copy]) => (
            <Link href={href} key={href}><span>FREE TOOL</span><h3>{title}</h3><p>{copy}</p><strong>Open tool →</strong></Link>
          ))}
        </div>
      </section>

      <section className={styles.infoSection} id="cross-stitch-faq">
        <p className={styles.eyebrow}>QUICK ANSWERS</p>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
