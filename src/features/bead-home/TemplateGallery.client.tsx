"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download, FileSpreadsheet } from "lucide-react";
import { templateData, type PatternTemplateData } from "./template-data";
import { formatMessage } from "./messages/format";
import type { HomeMessages } from "./messages/types";
import { paletteOptions } from "../../../public/editor/src/palettes/catalog.js";
import type { PaletteBrand } from "@/src/components/bead-studio/brand-palettes";
import { matchTemplatePalette, type MatchedTemplate } from "./template-palette";

type Messages = HomeMessages["templates"];

function PixelPattern({ template, label }: { template: PatternTemplateData; label: string }) {
  const width = Math.max(...template.rows.map((row) => row.length));
  return (
    <svg className="template-pixel-art" viewBox={`0 0 ${width} ${template.rows.length}`} role="img" aria-label={label} shapeRendering="crispEdges">
      {template.rows.flatMap((row, y) => Array.from(row).map((key, x) => key !== "." && <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={template.colors[key] ?? "#21213b"} />))}
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

function downloadTemplatePng(template: MatchedTemplate, messages: Messages) {
  const width = Math.max(...template.rows.map((row) => row.length));
  const height = template.rows.length;
  const cellSize = 48;
  const canvas = document.createElement("canvas");
  canvas.width = width * cellSize;
  const headerHeight = 96;
  canvas.height = headerHeight + height * cellSize + 32 + template.usage.length * 36;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.fillStyle = "#f3f3f3";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#30211f";
  context.font = "bold 28px sans-serif";
  context.fillText(`${messages.items[template.id].title} · ${template.brand}`, 24, 38);
  context.font = "20px sans-serif";
  context.fillText(`${width}×${height} · ${template.usage.reduce((sum, color) => sum + color.count, 0)} ${messages.totalBeads}`, 24, 72);
  template.rows.forEach((row, y) => Array.from(row).forEach((key, x) => {
    if (key !== ".") {
      context.fillStyle = template.colors[key] ?? "#21213b";
      context.fillRect(x * cellSize, (headerHeight + y * cellSize), cellSize, cellSize);
      const hex = template.colors[key];
      const brightness = [1, 3, 5].reduce((sum, offset, i) => sum + parseInt(hex.slice(offset, offset + 2), 16) * [.299, .587, .114][i], 0);
      context.fillStyle = brightness > 145 ? "#111111" : "#ffffff";
      context.font = "bold 12px sans-serif";
      context.textAlign = "center";
      context.fillText(template.swatches[key].code, (x + .5) * cellSize, headerHeight + (y + .5) * cellSize + 4);
    }
    context.strokeStyle = "rgba(59, 40, 36, .08)";
    context.lineWidth = 1;
    context.strokeRect(x * cellSize + .5, (headerHeight + y * cellSize) + .5, cellSize - 1, cellSize - 1);
  }));
  context.textAlign = "left";
  context.font = "20px sans-serif";
  template.usage.forEach((color, index) => {
    const y = headerHeight + height * cellSize + 24 + index * 36;
    context.fillStyle = color.hex;
    context.fillRect(24, y, 24, 24);
    context.fillStyle = "#30211f";
    context.fillText(`${color.code} · ${color.name} · ${color.count}`, 60, y + 20);
  });
  canvas.toBlob((blob) => {
    if (blob) saveBlob(blob, formatMessage(messages.patternFileName, { id: `${template.id}-${template.brand.toLowerCase().replaceAll(" ", "-")}` }));
  }, "image/png");
}

function downloadTemplateColors(template: MatchedTemplate, messages: Messages) {
  const width = Math.max(...template.rows.map((row) => row.length));
  const item = messages.items[template.id];
  const usage = template.usage;
  const rows = [messages.csvHeaders, ...usage.map((color) => [item.title, `${width}x${template.rows.length}`, template.brand, color.code, color.name, color.hex, String(color.count)])];
  const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
  saveBlob(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }), formatMessage(messages.colorsFileName, { id: `${template.id}-${template.brand.toLowerCase().replaceAll(" ", "-")}` }));
}

export default function TemplateGallery({ messages }: { messages: Messages }) {
  const [templateBrands, setTemplateBrands] = useState<Record<string, PaletteBrand>>({});
  const templates = useMemo(() => templateData.map((template) => matchTemplatePalette(template, templateBrands[template.id] ?? "Perler")), [templateBrands]);
  const [selectedId, setSelectedId] = useState(templateData[0].id);
  const selected = templates.find((template) => template.id === selectedId) ?? templates[0];
  const brand = selected.brand;
  const selectedMessages = messages.items[selected.id];
  const usage = selected.usage;
  const totalBeads = usage.reduce((sum, color) => sum + color.count, 0);
  const gridSize = `${Math.max(...selected.rows.map((row) => row.length))}×${selected.rows.length}`;
  const imageLabel = (template: PatternTemplateData) => formatMessage(messages.imageLabel, { title: messages.items[template.id].title });

  return (
    <section className="template-section" id="templates" aria-labelledby="templates-title">
      <div className="template-heading"><h2 id="templates-title">{messages.title}</h2><p>{messages.description}</p></div>
      <div className="template-grid">
        {templates.map((template) => {
          const item = messages.items[template.id];
          const colorCount = template.usage.length;
          const isSelected = template.id === selected.id;
          return <button className={`template-card ${isSelected ? "is-selected" : ""}`} type="button" key={template.id} aria-pressed={isSelected} onClick={() => setSelectedId(template.id)}><span className="template-card-preview"><PixelPattern template={template} label={imageLabel(template)} /></span><span className="template-card-copy"><strong>{item.title}</strong><small>{template.brand} · {template.rows[0].length}×{template.rows.length} · {formatMessage(messages.colors, { count: colorCount })}</small></span></button>;
        })}
      </div>
      <article className="template-detail" aria-live="polite">
        <div className="template-detail-preview"><PixelPattern template={selected} label={imageLabel(selected)} /></div>
        <div className="template-detail-content">
          <div className="template-detail-heading"><span className="eyebrow">{messages.detailsLabel} ·</span><span className="template-brand-inline"><select id="template-brand" aria-label={messages.brandLabel} title={messages.brandHint} value={brand} style={{ width: `${brand.length + 3}ch` }} onChange={(event) => setTemplateBrands((current) => ({ ...current, [selected.id]: event.target.value as PaletteBrand }))}>{paletteOptions.map(({ value }) => <option key={value} value={value}>{value}</option>)}</select><ChevronDown aria-hidden="true" size={20} strokeWidth={2.5} /></span></div><h3>{selectedMessages.title}</h3>
          <p className="template-description">{selectedMessages.description}</p>
          <div className="template-facts">
            <dl><dt>{messages.gridSize}</dt><dd>{gridSize}</dd><dt>{messages.totalBeads}</dt><dd>{totalBeads}</dd><dt>{messages.colorsLabel}</dt><dd>{usage.length}</dd></dl>
            <dl><dt>{messages.difficulty}</dt><dd>{selectedMessages.difficulty}</dd><dt>{messages.time}</dt><dd>{formatMessage(messages.minutes, { count: selected.minutes })}</dd><dt>{messages.pegboard}</dt><dd>{selectedMessages.pegboard}</dd></dl>
          </div>
          <div className="template-supplies"><h4>{messages.supplies}</h4><p>{formatMessage(messages.suppliesDescription, { pegboard: selectedMessages.pegboard })}</p><ul>{usage.map((color) => <li key={color.code}><i style={{ background: color.hex }} /><span title={`${brand} ${color.code} · ${color.name} · ${color.hex}`}>{color.count} × <strong>{color.code}</strong> · {color.name}</span></li>)}</ul></div>
          <div className="template-downloads"><button type="button" className="template-download-button primary" onClick={() => downloadTemplatePng(selected, messages)}><Download size={16} /> {messages.downloadPng}</button><button type="button" className="template-download-button" onClick={() => downloadTemplateColors(selected, messages)}><FileSpreadsheet size={16} /> {messages.downloadColors}</button></div>
        </div>
      </article>
    </section>
  );
}
