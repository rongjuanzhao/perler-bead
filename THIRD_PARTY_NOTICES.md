# Third-party notices

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

## Artkal S Midi palette data

The Artkal S entries in `src/components/bead-studio/brand-palettes.ts` were
transcribed from the numeric RGB columns in the official Artkal S-5mm Midi
Beads RGB Color Chart (2024), linked from the manufacturer page:

- https://www.artkalfusebeads.com/pages/s-color-chart
- https://cdn.shopify.com/s/files/1/1323/8195/files/S_MIDI_Beads_RGB_Color_Chart_2024.pdf?v=1744686607

Retrieved 2026-10-31. Changes: RGB converted losslessly to uppercase HEX; codes
retained and used as display names because the source does not supply names.
The 173 numeric entries cover S01–S159 excluding S41, S42 and S63, plus
SE01–SE17. S41 (Gold), S42 (Silver) and S63 (Copper) have no numeric RGB in
the source and are excluded. The store page advertises 225 colors, but the
linked RGB document provides 173 numeric entries; unlisted RGB values were
not estimated. These replace the previous PinDou-derived Artkal S palette.

The source document and Artkal trademarks belong to their respective owners;
this manufacturer reference is not covered by the community MIT license above.
Artkal describes the RGB values as screen references and notes that they may
differ from the actual beads.

## Artkal C Mini palette data

The 173 Artkal C entries in `src/components/bead-studio/artkal-mini-palettes.ts`
were transcribed from the official C-2.6mm RGB chart linked at:

- https://www.artkalfusebeads.com/pages/c-color-chart
- https://cdn.shopify.com/s/files/1/1323/8195/files/C_MINI_Beads_RGB_Color_Chart_2024.pdf?v=1744700289

Retrieved 2026-11-01. RGB values are converted to HEX and codes are used as
display names. C01–C157 (excluding C35 Silver, which lacks numeric RGB) and
CE01–CE17 are included. C152 is printed as (189, 199, 273), an invalid RGB
triplet; its PDF swatch embeds (189, 199, 237), which is used instead. The
store advertises 197 colors, but its linked RGB chart supplies 173 entries.
The document and trademarks belong to Artkal; community MIT notices above
do not apply to this manufacturer reference.

## Artkal M Mini palette data

The 221 Artkal M entries in `src/components/bead-studio/artkal-mini-palettes.ts`
were imported from HansBug/pindou-color-data on 2026-11-01:

- https://github.com/HansBug/pindou-color-data/tree/main/artkal-m-221-official
- colors.json Git blob SHA: `f3cd006f99e95b14e7d8522fde31124a1b4b03b7`

Changes: codes are used as display names; source HEX values are retained.
The source identifies 220 entries as transcribed from the official 2025 Artkal
M RGB PDF. MH1 is supplied as transparent #FFFFFF00 from a public tool display
reference, not an official numeric RGB value. Its transparency is retained,
and it is excluded from automatic opaque-photo matching. Its alpha is a
display convention rather than a physical bead transparency measurement.

The imported dataset is distributed under this license:

MIT License

Copyright (c) 2026 HansBug

Permission is hereby granted, free of charge, to any person obtaining a copy
of this data and associated documentation files (the "Data"), to deal
in the Data without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Data, and to permit persons to whom the Data is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Data.

THE DATA IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE DATA OR THE USE OR OTHER DEALINGS IN THE
DATA.
