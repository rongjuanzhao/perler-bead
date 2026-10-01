import type { TemplateId } from "./messages/types";

export type PatternTemplateData = {
  id: TemplateId;
  minutes: number;
  rows: string[];
  colors: Record<string, string>;
};

export const templateData: PatternTemplateData[] = [
  {
    id: "campfire", minutes: 12,
    rows: ["............", ".....O......", "....OO......", "....R.......", "...RRR......", "...OOO......", "..OYYY......", "..YYYYY.....", "...YYY......", "..BBBBB.....", ".BBBBBBB....", "............"],
    colors: { R: "#dc3a25", O: "#ff8b24", Y: "#ffd34e", B: "#754322" },
  },
  {
    id: "slime", minutes: 10,
    rows: ["............", "....GGGG....", "...GLLLLG...", "..GLLLLLLG..", ".GLLLLLLLLG.", ".GLLKLLKLLG.", ".GLLLLLLLLG.", "..GGLLLLGG..", "...GGGGGG...", "....GGGG....", "............", "............"],
    colors: { L: "#65ce68", G: "#25753b", K: "#25212a" },
  },
  {
    id: "heart", minutes: 14,
    rows: ["............", "..DD...DD...", ".DRRR.DRRR..", ".RRRRRRRRRR.", ".RRPHRRRRRR.", ".RRRRRRRRRR.", "..RRRRRRRR..", "...RRRRRR...", "....RRRR....", ".....RR.....", "............", "............"],
    colors: { R: "#ed3654", D: "#a91535", P: "#ff7890", H: "#ff9cac" },
  },
  {
    id: "cherry", minutes: 16,
    rows: [".......GG...", "......GLL...", ".....GG.G...", "....G..G....", "...RR.G.RR..", "..RPR..RPR..", ".RRRR.RRRR..", ".RDRR.RDRR..", "..RR...RR...", "............", "............", "............"],
    colors: { R: "#c72f58", D: "#812037", P: "#e96c86", G: "#547c1d", L: "#a5c83b" },
  },
  {
    id: "rainbow", minutes: 20,
    rows: ["............", "..RRRRRRRR..", ".ROOOOOOOOR.", "ROYYYYYYYYOR", "OYYGGGGGGYYO", "YYGCCCCCCGYY", "YGCCBBBBCCGY", "GCB........G", "CB..........", "............", "............", "............"],
    colors: { R: "#e94b45", O: "#ff8d32", Y: "#f8d64c", G: "#31b875", C: "#25b9cd", B: "#3677bd" },
  },
  {
    id: "flower", minutes: 15,
    rows: ["....W.W.....", "...WWYWW....", "....WYW.....", ".....G......", ".....G......", "..GG.G.GG...", "...GGGGG....", ".....G......", ".....G......", ".....G......", "............", "............"],
    colors: { W: "#fff7dc", Y: "#f3bd32", G: "#17936b" },
  },
];
