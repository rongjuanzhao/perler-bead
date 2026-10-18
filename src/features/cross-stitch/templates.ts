// Starter patterns for the cross stitch designer. Each template is drawn with
// single-letter keys ("." = empty cell) mapped to DMC codes below the rows.
export type CrossStitchTemplate = {
  name: string;
  width: number;
  height: number;
  rows: string[];
  legend: Record<string, string>;
};

export const TEMPLATES: CrossStitchTemplate[] = [
  {
    name: "Heart",
    width: 13,
    height: 11,
    rows: [
      "..XXX...XXX..",
      ".XHHHX.XOOOX.",
      "XHOOOOXOOOOOX",
      "XOOOOOOOOOOOX",
      "XOOOOOOOOOOOX",
      ".XOOOOOOOOOX.",
      "..XOOOOOOOX..",
      "...XOOOOOX...",
      "....XOOOX....",
      ".....XOX.....",
      "......X......",
    ],
    legend: { X: "321", O: "350", H: "352" },
  },
  {
    name: "Star",
    width: 13,
    height: 13,
    rows: [
      "......D......",
      "......Y......",
      ".....YYY.....",
      ".....DWD.....",
      ".....YYY.....",
      "DYYYYYYYYYYYD",
      ".DYYYYYYYYYD.",
      "..DYYYYYYYD..",
      "...DYYYYYD...",
      "..DYYD.DYYD..",
      "..DYD...DYD..",
      ".DYD.....DYD.",
      ".DD.......DD.",
    ],
    legend: { Y: "727", D: "919", W: "745" },
  },
  {
    name: "Monogram A",
    width: 9,
    height: 10,
    rows: [
      "....B....",
      "...BBB...",
      "...B.B...",
      "..BB.BB..",
      "..BB.BB..",
      ".BB...BB.",
      ".BBBBBBB.",
      ".BB...BB.",
      "BBB...BBB",
      "BBB...BBB",
    ],
    legend: { B: "312" },
  },
  {
    name: "Corner Border",
    width: 15,
    height: 15,
    rows: [
      "TTTTTTTTTTTTTTT",
      "T.R............",
      "T..R...........",
      "T...R..........",
      "T....R.........",
      "T.....R........",
      "T......R.......",
      "T.......R......",
      "T........R.....",
      "T.........R....",
      "T..........R...",
      "T...........R..",
      "T............R.",
      "T.............R",
      "TRRRRRRRRRRRRRR",
    ],
    legend: { T: "3812", R: "817" },
  },
];

export function templateToCells(template: CrossStitchTemplate): (string | null)[] {
  const cells: (string | null)[] = Array<string | null>(template.width * template.height).fill(null);
  template.rows.forEach((row, y) => {
    for (let x = 0; x < template.width; x += 1) {
      const key = row[x];
      if (key && key !== "." && template.legend[key]) cells[y * template.width + x] = template.legend[key];
    }
  });
  return cells;
}
