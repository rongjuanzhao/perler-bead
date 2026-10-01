"use client";

import { useMemo, useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { templateData, type PatternTemplateData } from "./template-data";
import { formatMessage } from "./messages/format";
import type { HomeMessages } from "./messages/types";

type Messages = HomeMessages["templates"];

function getColorUsage(template: PatternTemplateData, messages: Messages) {
  const usage = new Map<string, number>();
  template.rows.forEach((row) => Array.from(row).forEach((key) => {
    if (key !== ".") usage.set(key, (usage.get(key) ?? 0) + 1);
  }));
  const item = messages.items[template.id];
  return Object.entries(template.colors).map(([key, hex]) => ({ name: item.colorNames[key], hex, count: usage.get(key) ?? 0 }));
}

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

function downloadTemplatePng(template: PatternTemplateData, messages: Messages) {
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
      context.fillStyle = template.colors[key] ?? "#21213b";
      context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
    context.strokeStyle = "rgba(59, 40, 36, .08)";
    context.lineWidth = 1;
    context.strokeRect(x * cellSize + .5, y * cellSize + .5, cellSize - 1, cellSize - 1);
  }));
  canvas.toBlob((blob) => {
    if (blob) saveBlob(blob, formatMessage(messages.patternFileName, { id: template.id }));
  }, "image/png");
}

function downloadTemplateColors(template: PatternTemplateData, messages: Messages) {
  const width = Math.max(...template.rows.map((row) => row.length));
  const item = messages.items[template.id];
  const usage = getColorUsage(template, messages);
  const rows = [messages.csvHeaders, ...usage.map((color) => [item.title, `${width}x${template.rows.length}`, color.name, color.hex, String(color.count)])];
  const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
  saveBlob(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }), formatMessage(messages.colorsFileName, { id: template.id }));
}

export default function TemplateGallery({ messages }: { messages: Messages }) {
  const [selectedId, setSelectedId] = useState(templateData[0].id);
  const selected = templateData.find((template) => template.id === selectedId) ?? templateData[0];
  const selectedMessages = messages.items[selected.id];
  const usage = useMemo(() => getColorUsage(selected, messages), [messages, selected]);
  const totalBeads = usage.reduce((sum, color) => sum + color.count, 0);
  const gridSize = `${Math.max(...selected.rows.map((row) => row.length))}×${selected.rows.length}`;
  const imageLabel = (template: PatternTemplateData) => formatMessage(messages.imageLabel, { title: messages.items[template.id].title });

  return (
    <section className="template-section" id="templates" aria-labelledby="templates-title">
      <div className="template-heading"><h2 id="templates-title">{messages.title}</h2><p>{messages.description}</p></div>
      <div className="template-grid">
        {templateData.map((template) => {
          const item = messages.items[template.id];
          const colorCount = Object.keys(template.colors).length;
          const isSelected = template.id === selected.id;
          return <button className={`template-card ${isSelected ? "is-selected" : ""}`} type="button" key={template.id} aria-pressed={isSelected} onClick={() => setSelectedId(template.id)}><span className="template-card-preview"><PixelPattern template={template} label={imageLabel(template)} /></span><span className="template-card-copy"><strong>{item.title}</strong><small>{template.rows[0].length}×{template.rows.length} · {formatMessage(messages.colors, { count: colorCount })}</small></span></button>;
        })}
      </div>
      <article className="template-detail" aria-live="polite">
        <div className="template-detail-preview"><PixelPattern template={selected} label={imageLabel(selected)} /></div>
        <div className="template-detail-content">
          <p className="eyebrow">{messages.detailsLabel}</p><h3>{selectedMessages.title}</h3><p className="template-description">{selectedMessages.description}</p>
          <div className="template-facts">
            <dl><dt>{messages.gridSize}</dt><dd>{gridSize}</dd><dt>{messages.totalBeads}</dt><dd>{totalBeads}</dd><dt>{messages.colorsLabel}</dt><dd>{usage.length}</dd></dl>
            <dl><dt>{messages.difficulty}</dt><dd>{selectedMessages.difficulty}</dd><dt>{messages.time}</dt><dd>{formatMessage(messages.minutes, { count: selected.minutes })}</dd><dt>{messages.pegboard}</dt><dd>{selectedMessages.pegboard}</dd></dl>
          </div>
          <div className="template-supplies"><h4>{messages.supplies}</h4><p>{formatMessage(messages.suppliesDescription, { pegboard: selectedMessages.pegboard })}</p><ul>{usage.map((color) => <li key={color.name}><i style={{ background: color.hex }} /><span>{color.count} × {color.name}</span></li>)}</ul></div>
          <div className="template-downloads"><button type="button" className="template-download-button primary" onClick={() => downloadTemplatePng(selected, messages)}><Download size={16} /> {messages.downloadPng}</button><button type="button" className="template-download-button" onClick={() => downloadTemplateColors(selected, messages)}><FileSpreadsheet size={16} /> {messages.downloadColors}</button></div>
        </div>
      </article>
    </section>
  );
}
