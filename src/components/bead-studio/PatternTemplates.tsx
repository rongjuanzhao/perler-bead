"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Download, FileSpreadsheet } from "lucide-react";

type TemplateColor = {
  name: string;
  hex: string;
};

type PatternTemplate = {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Easy" | "Intermediate";
  minutes: number;
  pegboard: string;
  rows: string[];
  colors: Record<string, TemplateColor>;
};

const templates: PatternTemplate[] = [
  {
    id: "campfire",
    title: "Campfire",
    description: "A warm miniature campfire with layered flames and a sturdy log base.",
    difficulty: "Beginner",
    minutes: 12,
    pegboard: "Small 29×29",
    rows: [
      "............", ".....O......", "....OO......", "....R.......",
      "...RRR......", "...OOO......", "..OYYY......", "..YYYYY.....",
      "...YYY......", "..BBBBB.....", ".BBBBBBB....", "............",
    ],
    colors: {
      R: { name: "Cherry Red", hex: "#dc3a25" },
      O: { name: "Tangerine", hex: "#ff8b24" },
      Y: { name: "Sun Yellow", hex: "#ffd34e" },
      B: { name: "Cocoa Brown", hex: "#754322" },
    },
  },
  {
    id: "slime",
    title: "Happy Slime",
    description: "A friendly green slime character designed as a quick first pattern.",
    difficulty: "Beginner",
    minutes: 10,
    pegboard: "Small 29×29",
    rows: [
      "............", "....GGGG....", "...GLLLLG...", "..GLLLLLLG..",
      ".GLLLLLLLLG.", ".GLLKLLKLLG.", ".GLLLLLLLLG.", "..GGLLLLGG..",
      "...GGGGGG...", "....GGGG....", "............", "............",
    ],
    colors: {
      L: { name: "Lime Green", hex: "#65ce68" },
      G: { name: "Forest Green", hex: "#25753b" },
      K: { name: "Black", hex: "#25212a" },
    },
  },
  {
    id: "heart",
    title: "Beating Heart",
    description: "A classic pixel heart with a bright highlight and deep shaded edge.",
    difficulty: "Easy",
    minutes: 14,
    pegboard: "Small 29×29",
    rows: [
      "............", "..DD...DD...", ".DRRR.DRRR..", ".RRRRRRRRRR.",
      ".RRPHRRRRRR.", ".RRRRRRRRRR.", "..RRRRRRRR..", "...RRRRRR...",
      "....RRRR....", ".....RR.....", "............", "............",
    ],
    colors: {
      R: { name: "Hot Coral", hex: "#ed3654" },
      D: { name: "Deep Berry", hex: "#a91535" },
      P: { name: "Pink", hex: "#ff7890" },
      H: { name: "Blush", hex: "#ff9cac" },
    },
  },
  {
    id: "cherry",
    title: "Sweet Cherry",
    description: "A pair of glossy cherries joined by a leafy green stem.",
    difficulty: "Easy",
    minutes: 16,
    pegboard: "Small 29×29",
    rows: [
      ".......GG...", "......GLL...", ".....GG.G...", "....G..G....",
      "...RR.G.RR..", "..RPR..RPR..", ".RRRR.RRRR..", ".RDRR.RDRR..",
      "..RR...RR...", "............", "............", "............",
    ],
    colors: {
      R: { name: "Cherry", hex: "#c72f58" },
      D: { name: "Dark Cherry", hex: "#812037" },
      P: { name: "Rose Highlight", hex: "#e96c86" },
      G: { name: "Leaf Green", hex: "#547c1d" },
      L: { name: "Lime", hex: "#a5c83b" },
    },
  },
  {
    id: "rainbow",
    title: "Rainbow Arc",
    description: "A cheerful six-color rainbow that works well as a magnet or keychain.",
    difficulty: "Intermediate",
    minutes: 20,
    pegboard: "Small 29×29",
    rows: [
      "............", "..RRRRRRRR..", ".ROOOOOOOOR.", "ROYYYYYYYYOR",
      "OYYGGGGGGYYO", "YYGCCCCCCGYY", "YGCCBBBBCCGY", "GCB........G",
      "CB..........", "............", "............", "............",
    ],
    colors: {
      R: { name: "Red", hex: "#e94b45" },
      O: { name: "Orange", hex: "#ff8d32" },
      Y: { name: "Yellow", hex: "#f8d64c" },
      G: { name: "Green", hex: "#31b875" },
      C: { name: "Aqua", hex: "#25b9cd" },
      B: { name: "Blue", hex: "#3677bd" },
    },
  },
  {
    id: "flower",
    title: "Daisy Bloom",
    description: "A bright daisy with a long stem and balanced leaves for easy assembly.",
    difficulty: "Easy",
    minutes: 15,
    pegboard: "Small 29×29",
    rows: [
      "....W.W.....", "...WWYWW....", "....WYW.....", ".....G......",
      ".....G......", "..GG.G.GG...", "...GGGGG....", ".....G......",
      ".....G......", ".....G......", "............", "............",
    ],
    colors: {
      W: { name: "Soft White", hex: "#fff7dc" },
      Y: { name: "Marigold", hex: "#f3bd32" },
      G: { name: "Garden Green", hex: "#17936b" },
    },
  },
];

const faqs = [
  {
    question: "How does the bead pattern maker work?",
    answer: "Upload an image and Beadloom converts it into a bead-sized grid while preserving the image's original proportions. Each cell is matched to the closest available color in your selected brand palette using a weighted RGB color-distance calculation. You can then adjust the pattern width, color limit, background, bead shape, grid, and color-code display before exporting.",
  },
  {
    question: "Is this tool really free?",
    answer: "Yes. Uploading, generating, previewing, and downloading your bead pattern and color list are completely free. No account, subscription, or sign-up is required.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No. Beadloom is free to use and does not require an account or sign-up. You can upload an image, generate a bead pattern, and download the result immediately.",
  },
  {
    question: "Which fuse bead brands are supported?",
    answer: "Beadloom supports MARD Basic, MARD Complete, Perler, Hama, and Artkal S palettes. Your image is matched to the closest available colors in the brand collection you choose.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer: "No. Images are processed locally in your browser and are not uploaded to our servers. Your source image stays on your device, and refreshing or closing the page clears the current session.",
  },
  {
    question: "What image formats are supported?",
    answer: "Beadloom supports JPEG, PNG, and WebP images. Transparent areas in PNG or WebP files are treated as empty cells, so they will not be filled with beads in the generated pattern.",
  },
  {
    question: "How many bead colors are available?",
    answer: "The available colors depend on the selected collection: MARD Basic includes 221 colors, MARD Complete includes 291, Perler includes 70, Hama includes 50, and Artkal S includes 35. You can use the color-limit control to reduce the number of colors in a pattern for an easier build.",
  },
];

function getColorUsage(template: PatternTemplate) {
  const usage = new Map<string, number>();
  template.rows.forEach((row) => Array.from(row).forEach((key) => {
    if (key !== ".") usage.set(key, (usage.get(key) ?? 0) + 1);
  }));
  return Object.entries(template.colors).map(([key, color]) => ({ ...color, count: usage.get(key) ?? 0 }));
}

function PixelPattern({ template }: { template: PatternTemplate }) {
  const width = Math.max(...template.rows.map((row) => row.length));
  return (
    <svg className="template-pixel-art" viewBox={`0 0 ${width} ${template.rows.length}`} role="img" aria-label={`${template.title} bead pattern`} shapeRendering="crispEdges">
      {template.rows.flatMap((row, y) => Array.from(row).map((key, x) => key !== "." && (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={template.colors[key]?.hex ?? "#21213b"} />
      )))}
    </svg>
  );
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function downloadTemplatePng(template: PatternTemplate) {
  const width = Math.max(...template.rows.map((row) => row.length));
  const height = template.rows.length;
  const cellSize = 48;
  const canvas = document.createElement("canvas");
  canvas.width = width * cellSize;
  canvas.height = height * cellSize;
  const context = canvas.getContext("2d");
  if (!context) return;

  context.fillStyle = "#f3f3f3";
  context.fillRect(0, 0, canvas.width, canvas.height);
  template.rows.forEach((row, y) => Array.from(row).forEach((key, x) => {
    if (key !== ".") {
      context.fillStyle = template.colors[key]?.hex ?? "#21213b";
      context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
    context.strokeStyle = "rgba(59, 40, 36, .08)";
    context.lineWidth = 1;
    context.strokeRect(x * cellSize + .5, y * cellSize + .5, cellSize - 1, cellSize - 1);
  }));

  canvas.toBlob((blob) => {
    if (blob) saveBlob(blob, `${template.id}-bead-pattern.png`);
  }, "image/png");
}

function downloadTemplateColors(template: PatternTemplate) {
  const width = Math.max(...template.rows.map((row) => row.length));
  const usage = getColorUsage(template);
  const rows = [
    ["Template", "Grid", "Color", "Hex", "Beads"],
    ...usage.map((color) => [template.title, `${width}x${template.rows.length}`, color.name, color.hex, String(color.count)]),
  ];
  const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
  saveBlob(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }), `${template.id}-color-list.csv`);
}

export default function PatternTemplates({ beforeFaq }: { beforeFaq?: ReactNode }) {
  const [selectedId, setSelectedId] = useState(templates[0].id);
  const selected = templates.find((template) => template.id === selectedId) ?? templates[0];
  const usage = useMemo(() => getColorUsage(selected), [selected]);
  const totalBeads = usage.reduce((sum, color) => sum + color.count, 0);
  const gridSize = `${Math.max(...selected.rows.map((row) => row.length))}×${selected.rows.length}`;

  return (
    <>
    <section className="template-section" id="templates" aria-labelledby="templates-title">
      <div className="template-heading">
        <h2 id="templates-title">Templates</h2>
        <p>Choose a Perler bead pattern to see its size, materials, and project details.</p>
      </div>

      <div className="template-grid">
        {templates.map((template) => {
          const templateUsage = getColorUsage(template);
          const isSelected = template.id === selected.id;
          return (
            <button className={`template-card ${isSelected ? "is-selected" : ""}`} type="button" key={template.id} aria-pressed={isSelected} onClick={() => setSelectedId(template.id)}>
              <span className="template-card-preview"><PixelPattern template={template} /></span>
              <span className="template-card-copy">
                <strong>{template.title}</strong>
                <small>{template.rows[0].length}×{template.rows.length} · {templateUsage.length} colors</small>
              </span>
            </button>
          );
        })}
      </div>

      <article className="template-detail" aria-live="polite">
        <div className="template-detail-preview"><PixelPattern template={selected} /></div>
        <div className="template-detail-content">
          <p className="eyebrow">PATTERN DETAILS</p>
          <h3>{selected.title}</h3>
          <p className="template-description">{selected.description}</p>

          <div className="template-facts">
            <dl><dt>Grid size</dt><dd>{gridSize}</dd><dt>Total beads</dt><dd>{totalBeads}</dd><dt>Colors</dt><dd>{usage.length}</dd></dl>
            <dl><dt>Difficulty</dt><dd>{selected.difficulty}</dd><dt>Time</dt><dd>~{selected.minutes} min</dd><dt>Pegboard</dt><dd>{selected.pegboard}</dd></dl>
          </div>

          <div className="template-supplies">
            <h4>Supplies</h4>
            <p>{selected.pegboard} pegboard · iron and parchment paper</p>
            <ul>{usage.map((color) => <li key={color.name}><i style={{ background: color.hex }} /><span>{color.count} × {color.name}</span></li>)}</ul>
          </div>

          <div className="template-downloads">
            <button type="button" className="template-download-button primary" onClick={() => downloadTemplatePng(selected)}><Download size={16} /> Download PNG</button>
            <button type="button" className="template-download-button" onClick={() => downloadTemplateColors(selected)}><FileSpreadsheet size={16} /> Download colors</button>
          </div>
        </div>
      </article>
    </section>

    <section className="template-process" id="how" aria-labelledby="process-title">
      <div className="template-process-heading">
        <h2 id="process-title">Create a Perler Bead Pattern in 3 Steps</h2>
        <p>Turn any image into a build-ready Perler bead pattern in just a few clicks.</p>
      </div>
      <div className="template-process-steps">
        <article>
          <span className="template-step-number">01</span>
          <h3>Upload Your Image</h3>
          <p>Drag and drop or choose a JPEG, PNG, or WebP image. Transparent areas are supported.</p>
        </article>
        <article>
          <span className="template-step-number">02</span>
          <h3>Adjust the Settings</h3>
          <p>Choose a bead brand, pattern width, color limit, background option, and bead shape.</p>
        </article>
        <article>
          <span className="template-step-number">03</span>
          <h3>Download Your Pattern</h3>
          <p>Export a printable Perler bead pattern as PNG and download the matching color and bead-count list.</p>
        </article>
      </div>
    </section>

    {beforeFaq}

    <section className="template-faq" id="faq" aria-labelledby="faq-title">
      <div className="template-faq-heading">
        <h2 id="faq-title">Frequently Asked Questions</h2>
        <p>Everything you need to know before creating your first bead pattern.</p>
      </div>
      <div className="template-faq-list">
        {faqs.map((faq) => (
          <details className="template-faq-item" key={faq.question}>
            <summary>
              <span>{faq.question}</span>
              <i aria-hidden="true" />
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
    </>
  );
}
