# Third-party notices

## PinDou palette data

The Artkal S palette entries in
`src/components/bead-studio/brand-palettes.ts` are derived from the PinDou
project by mumu-0922:

https://github.com/mumu-0922/pindou

PinDou is distributed under the MIT License. The upstream palette records
identify their source and license as community-sourced/community data.

## Perler Beads Generator MARD palette data

The MARD Basic (221 colors) and MARD Complete (291 colors) palette entries in
`src/components/bead-studio/mard-palettes.ts` are derived from the
Perler Beads Generator project by Jett-Wu:

https://github.com/Jett-Wu/Perler_Beads_Generator

The project is distributed under the MIT License.

## Perler Midi palette data

The 103 Perler Midi (5 mm) entries in
`src/components/bead-studio/brand-palettes.ts` were downloaded using the
"Download palette JSON" button at https://beadcolor.com/perler-color-chart
on 2026-10-31. These replace the previous PinDou-derived Perler palette.

Community values originate from maxcleme/beadcolors and are distributed through
MakeBead craft-color-codes:

- https://github.com/maxcleme/beadcolors
- https://github.com/makebead/craft-color-codes/tree/84dbdc26a961247f2aba58c91f314966a38e64ae
- https://beadcolor.com/palettes/ATTRIBUTION.txt

Changes: mapped `id` to `code`, normalized HEX to uppercase, and retained the
supplied names and color values. These are community screen references, not
official manufacturer RGB values.

MIT License

Copyright (c) 2020 maxcleme

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Hama Midi palette data

The 92 Hama Midi (5 mm) entries in
`src/components/bead-studio/brand-palettes.ts` were extracted from the full
colour table at https://beadsheet.com/hama-bead-color-chart/ on 2026-10-31.
These replace the previous PinDou-derived Hama palette. Codes, names and HEX
values are retained exactly as supplied.

BeadSheet identifies the source as maxcleme/beadcolors (MIT License), snapshot
commit `f97ff42` (2026-08-17): https://github.com/maxcleme/beadcolors. The MIT
license and Copyright (c) 2020 maxcleme notice reproduced above also apply
to this data. These are community measurements, not official Hama RGB values.
