import Link from "next/link";
import base from "../pixel-art/PixelArtStudio.module.css";
import styles from "./SpriteMaker.module.css";
import { template } from "./sprite";

export function SpriteMakerHero() {
  const slime = template("Slime").frames[1];

  return (
    <section className={`${base.hero} ${styles.spriteHero}`}>
      <div>
        <p className={base.eyebrow}>DRAW · ANIMATE · PLAY</p>
        <h1>Sprite <em>Maker.</em></h1>
        <p>Bring tiny characters to life, one frame at a time. Draw pixel art, preview your animation, and export a looping GIF or game-ready sprite sheet.</p>
      </div>
      <div className={styles.heroAnimation} aria-hidden="true">
        <svg viewBox="0 0 16 16" shapeRendering="crispEdges">
          {slime.map((color, index) => color && (
            <rect key={index} x={index % 16} y={Math.floor(index / 16)} width="1" height="1" fill={color} />
          ))}
        </svg>
        <span>4 FRAMES · ENDLESS POSSIBILITIES</span>
      </div>
    </section>
  );
}

const steps = [
  ["01", "Choose the canvas size", "Start with a preset such as 16 × 16 or 32 × 32, or set any width and height from 4 to 100 pixels. The checkerboard marks transparent pixels."],
  ["02", "Draw the first pose", "Build a clear silhouette with the pen, fill, eraser, color picker, and a compact palette. You can also add a reference image to trace."],
  ["03", "Add frames and motion", "Duplicate the current frame, adjust only the moving pixels, and use onion skin to line up each new pose with the previous one."],
  ["04", "Preview and export", "Set a playback rate from 1 to 24 fps, test the loop, then download an animated GIF, a single PNG, or a row or grid sprite sheet."],
] as const;

const features = [
  ["Up to 32 frames", "Add, duplicate, delete, and reorder frames while keeping the whole animation in one project."],
  ["Onion-skin drawing", "See the previous frame beneath the current one so limbs, effects, and outlines move by controlled amounts."],
  ["Live playback", "Preview the loop as you edit and adjust its speed from 1 to 24 frames per second."],
  ["GIF and sheet export", "Create a shareable looping GIF or a transparent PNG sprite sheet arranged as a strip or grid."],
  ["Pixel editing tools", "Paint, fill, erase, replace colors, select areas, move pixels, and flip or rotate a frame."],
  ["Flexible palettes", "Choose any hex color, save colors you reuse, or load a Lospec palette for a consistent look."],
  ["Reference images", "Place an image behind the grid as a drawing guide and change its opacity without baking it into the sprite."],
  ["Automatic local saving", "Your work is kept in this browser as you draw, and project files or pattern codes make portable backups."],
] as const;

const sizes = [
  ["8 × 8", "Particles, bullets, tiny pickups, map markers, and minimalist icons."],
  ["16 × 16", "Tiles, inventory items, compact characters, and simple four-direction game art."],
  ["24 × 24", "Small characters that need a little more facial or costume detail."],
  ["32 × 32", "Player characters, enemies, expressive poses, and readable shading."],
  ["48 × 48", "Detailed props, larger characters, and attacks that need space around the body."],
  ["64 × 64", "Bosses, portraits, close-ups, and animation with more detailed silhouettes."],
] as const;

const faqs = [
  ["Is this sprite maker free?", "Yes. You can draw, animate, preview, and export from the browser without creating an account."],
  ["How many animation frames can I create?", "A sprite can contain up to 32 frames. Playback can be set anywhere from 1 to 24 fps."],
  ["How do I make an animated GIF?", "Create at least two frames, preview the movement, choose Export animation, select GIF and an output scale, then download the looping file."],
  ["How do I use a sprite sheet in a game engine?", "Export a sheet at 1×, then slice it into cells that match your canvas width and height. Use nearest-neighbor or point filtering and disable texture smoothing to preserve hard pixel edges."],
  ["Can I use my own color palette?", "Yes. Enter a hex color, save favorite colors, or load a Lospec palette. PNG exports retain the artwork's original colors."],
  ["Where is my sprite saved?", "The editor saves the current project in this browser. For a separate backup or another device, download the editable project or copy its pattern code."],
] as const;

export function SpriteMakerInformation() {
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
    <div className={base.information}>
      <section className={base.infoSection} id="how-to-make-an-animated-sprite">
        <p className={base.eyebrow}>FROM FIRST PIXEL TO FINISHED LOOP</p>
        <h2>How to make an animated sprite</h2>
        <p className={base.sectionIntro}>Create a small piece of game-ready animation in four practical steps.</p>
        <ol className={base.infoGrid}>
          {steps.map(([number, title, copy]) => (
            <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>
          ))}
        </ol>
      </section>

      <section className={base.infoSection} id="sprite-maker-features">
        <p className={base.eyebrow}>ANIMATION TOOLS IN ONE WORKSPACE</p>
        <h2>What the sprite maker does</h2>
        <p className={base.sectionIntro}>Draw and manage every frame, check the motion at full speed, and export without leaving the editor.</p>
        <div className={base.featureGrid}>
          {features.map(([title, copy]) => (
            <article key={title}><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className={`${base.infoSection} ${styles.readability}`} id="sprite-design-guide">
        <p className={base.eyebrow}>DESIGN FOR THE FINAL SCALE</p>
        <h2>Making a sprite that reads at game size</h2>
        <div className={styles.articleGrid}>
          <article>
            <h3>Choose the resolution before the detail</h3>
            <p>Your canvas is the resolution players will see, not a large illustration waiting to be reduced. Begin with the tile grid and camera scale used by your game. At 16 × 16, prioritize a strong silhouette and a few identifying pixels. At 32 × 32, there is room for a face, hands, and a controlled shading ramp.</p>
            <p>Judge the sprite at 100% zoom often. If the pose only works while enlarged in the editor, simplify it until the action remains recognizable at its real size.</p>
          </article>
          <article>
            <h3>Use a small, purposeful palette</h3>
            <p>Give every color a role: outline, base, shadow, highlight, or a small accent. A limited palette makes shapes easier to read and keeps frames visually consistent. Keep the light direction stable so highlights and shadows describe the same volume throughout the loop.</p>
            <p>A dark outer edge can separate a tiny character from changing backgrounds. On larger sprites, selective outlines in darker versions of each local color can create a softer result.</p>
          </article>
          <article>
            <h3>Animate key poses first</h3>
            <p>Block the poses that explain the action before drawing the in-between frames. A short idle may need only two to four frames, while a walk often works in four to eight. Duplicate a pose and move only what must change; this prevents the body from wobbling unintentionally.</p>
            <p>Use onion skin for alignment, but make the live preview your final test. Motion that feels smooth frame by frame may be unclear at game speed.</p>
          </article>
          <article>
            <h3>Export cleanly for games and sharing</h3>
            <p>For a game engine, export the sprite sheet at 1× and let the engine scale it using nearest-neighbor filtering. Frames are placed edge to edge, so the sheet can be sliced using the canvas dimensions.</p>
            <p>For chat, social posts, or documentation, a 4× or 8× GIF is easier to see. Integer scaling keeps each original pixel square and avoids the blur introduced by smooth image resizing.</p>
          </article>
        </div>
      </section>

      <section className={base.infoSection} id="common-sprite-sizes">
        <p className={base.eyebrow}>PICK A PRACTICAL CANVAS</p>
        <h2>Common sprite sizes</h2>
        <p className={base.sectionIntro}>There is no single correct size. Match the canvas to your game grid, camera, and animation workload.</p>
        <div className={styles.tableWrap}>
          <table className={styles.sizeTable}>
            <thead><tr><th scope="col">Size</th><th scope="col">Typical uses</th></tr></thead>
            <tbody>
              {sizes.map(([size, use]) => <tr key={size}><th scope="row">{size}</th><td>{use}</td></tr>)}
            </tbody>
          </table>
        </div>
        <p className={styles.tableNote}>The editor also supports rectangular canvases and custom dimensions from 4 to 100 pixels per side.</p>
      </section>

      <section className={base.infoSection} id="sprite-maker-faq">
        <p className={base.eyebrow}>QUICK ANSWERS</p>
        <h2>Frequently asked questions</h2>
        <div className={base.faqList}>
          {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
          <details>
            <summary>Can I turn a still image into a sprite?</summary>
            <p>Use the <Link href="/pixel-art">Pixel Art Maker</Link> to redraw or simplify an image on a pixel grid, then build the movement here frame by frame.</p>
          </details>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
