export type TemplateId = "campfire" | "slime" | "heart" | "cherry" | "rainbow" | "flower";

export type HomeMessages = {
  metadata: {
    siteName: string;
    title: string;
    description: string;
    keywords: string[];
    openGraphTitle: string;
    openGraphDescription: string;
    twitterTitle: string;
    twitterDescription: string;
  };
  header: {
    navigationLabel: string;
    homeLabel: string;
    templates: string;
    howItWorks: string;
    palette: string;
    questions: string;
  };
  hero: {
    rainbowAlt: string;
    starAlt: string;
    title: string;
    descriptionBefore: string;
    descriptionHighlight: string;
    descriptionAfter: string;
    benefitsLabel: string;
    benefits: string[];
  };
  converter: {
    sectionLabel: string;
    toolbarTitle: string;
    designer: string;
    discard: string;
    selectedSourceAlt: string;
    processed: string;
    replace: string;
    previewLabel: string;
    hoverLabel: string;
    canvasLabel: string;
    uploadTitle: string;
    uploadDescription: string;
    chooseImage: string;
    beadCollection: string;
    colors: string;
    patternWidth: string;
    beads: string;
    colorLimit: string;
    simple: string;
    detailed: string;
    background: string;
    keepBackground: string;
    removeBackground: string;
    beadShape: string;
    square: string;
    round: string;
    grid: string;
    colorCodes: string;
    colorList: string;
    usageSummary: string;
    emptyHint: string;
    exportImage: string;
    exportColors: string;
    openEditor: string;
    defaultFileName: string;
    imageFileName: string;
    colorsFileName: string;
    csvHeaders: string[];
  };
  templates: {
    title: string;
    description: string;
    colors: string;
    colorsLabel: string;
    detailsLabel: string;
    gridSize: string;
    totalBeads: string;
    difficulty: string;
    time: string;
    pegboard: string;
    minutes: string;
    supplies: string;
    suppliesDescription: string;
    downloadPng: string;
    downloadColors: string;
    imageLabel: string;
    patternFileName: string;
    colorsFileName: string;
    csvHeaders: string[];
    items: Record<TemplateId, {
      title: string;
      description: string;
      difficulty: string;
      pegboard: string;
      colorNames: Record<string, string>;
    }>;
  };
  steps: {
    title: string;
    description: string;
    items: Array<{ number: string; title: string; description: string }>;
  };
  palette: {
    title: string;
    description: string;
    chooserLabel: string;
    colors: string;
    available: string;
  };
  faq: {
    title: string;
    description: string;
    items: Array<{ question: string; answer: string }>;
  };
  footer: {
    homeLabel: string;
    tagline: string;
    copyright: string;
  };
};
