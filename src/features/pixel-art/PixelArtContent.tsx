import Link from "next/link";
import styles from "./PixelArtStudio.module.css";

export function PixelArtHero() {
  return (
    <section className={styles.hero}>
      <div>
        <p className={styles.eyebrow}>CREATE, ONE PIXEL AT A TIME</p>
        <h1>Make your own <em>pixel art.</em></h1>
        <p>Draw a crisp sprite, icon, or tiny scene right in your browser. Everything stays on your device.</p>
      </div>
      <div className={styles.heroPixels} aria-hidden="true">
        {Array.from({ length: 42 }, (_, index) => <i key={index} />)}
      </div>
    </section>
  );
}

export function PixelArtInformation() {
  return (
    <div className={styles.information}>
      <section className={styles.infoSection} id="how-it-works">
        <p className={styles.eyebrow}>FROM BLANK CANVAS TO PIXEL ART</p>
        <h2>How it works</h2>
        <p className={styles.sectionIntro}>Create your artwork one square at a time, then save a crisp PNG.</p>
        <ol className={styles.infoGrid}>
          <li><span>01</span><h3>Choose a canvas size</h3><p>Pick 8 × 8 for a tiny icon, 16 × 16 for a simple sprite, or a larger grid when your design needs more detail.</p></li>
          <li><span>02</span><h3>Pick a color</h3><p>Choose from the built-in color palette or open the color picker to select a custom shade.</p></li>
          <li><span>03</span><h3>Draw and refine</h3><p>Paint pixels, fill connected areas, sample a color from your drawing, and erase squares as you work.</p></li>
          <li><span>04</span><h3>Export your artwork</h3><p>Download a sharp PNG with a transparent background, ready to share or use in a project.</p></li>
        </ol>
      </section>

      <section className={styles.infoSection} id="pixel-art-features">
        <p className={styles.eyebrow}>A LITTLE CANVAS, A LOT OF CONTROL</p>
        <h2>Features</h2>
        <div className={styles.featureGrid}>
          <article><h3>Six canvas sizes</h3><p>Start at 8 × 8 or choose 16, 24, 32, 48, or 64 pixels per side.</p></article>
          <article><h3>Pixel-by-pixel drawing</h3><p>Place individual squares for clear outlines, icons, characters, and small scenes.</p></article>
          <article><h3>Four handy tools</h3><p>Switch between pen, fill, color picker, and eraser as your design takes shape.</p></article>
          <article><h3>Custom color palette</h3><p>Use a curated set of colors or choose a precise shade with the color picker.</p></article>
          <article><h3>Optional grid lines</h3><p>Show or hide cell boundaries while keeping the artwork itself clean.</p></article>
          <article><h3>Undo and redo</h3><p>Step back through recent drawing changes and restore them whenever you need.</p></article>
          <article><h3>Transparent PNG export</h3><p>Export crisp square pixels without adding a background to empty cells.</p></article>
          <article><h3>Draw in your browser</h3><p>Start creating without installing an editor or uploading your artwork.</p></article>
        </div>
      </section>

      <section className={`${styles.infoSection} ${styles.definition}`} id="what-is-pixel-art">
        <p className={styles.eyebrow}>A DIGITAL ART FORM</p>
        <h2>What is pixel art?</h2>
        <p>Pixel art is digital artwork made by placing and editing individual pixels on a grid. Its deliberately visible squares and limited canvas sizes give it a distinctive look associated with classic video games, icons, and modern indie game art.</p>
        <p>Because every square matters, artists often begin with a clear silhouette, then add a few carefully chosen colors for outlines, shadows, and highlights. A small canvas can make a simple shape instantly recognizable.</p>
        <p>This editor gives you a blank grid to draw on, with tools for painting, filling, sampling, and erasing pixels. When you finish, export a transparent PNG to use your artwork elsewhere.</p>
      </section>

      <section className={styles.infoSection} id="pixel-art-faq">
        <p className={styles.eyebrow}>QUICK ANSWERS</p>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          <details><summary>How do I make pixel art with this editor?</summary><p>Choose a canvas size, select a color, and click or drag on the grid to draw. Use Fill for connected areas, Pick to sample a drawn color, and Erase to clear pixels.</p></details>
          <details><summary>Which canvas size should I use?</summary><p>Smaller canvases such as 8 × 8 or 16 × 16 work well for tiny icons and simple sprites. Choose 32 × 32 or larger when your design needs extra room for shape and detail.</p></details>
          <details><summary>Can I use my own colors?</summary><p>Yes. Choose a color from the palette or use the color input to select a custom shade.</p></details>
          <details><summary>Can I download my pixel art with a transparent background?</summary><p>Yes. Export PNG preserves empty pixels as transparent, so your artwork can sit on different backgrounds.</p></details>
          <details><summary>Can I turn a photo into pixel art here?</summary><p>This page is a drawing editor for making pixel art on a blank canvas. For animation with multiple frames, try the <Link href="/sprite-maker">Sprite Maker</Link>.</p></details>
          <details><summary>Do I need to install anything?</summary><p>No. Draw and export from your browser. Your canvas is not uploaded when you use the editor.</p></details>
        </div>
      </section>
    </div>
  );
}
