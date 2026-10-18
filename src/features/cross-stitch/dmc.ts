// DMC floss palette for the cross stitch designer. Codes are real DMC article
// numbers; hex values are screen approximations of the thread color (printed
// thread lists are what map to actual floss, so on-screen hex need not be exact).
// The set below covers the ~200 most-used codes; extend the arrays as needed.
export type DmcColor = { code: string; hex: string };
export type DmcFamily = { name: string; colors: DmcColor[] };

const family = (name: string, codes: Array<[string, string]>): DmcFamily => ({
  name,
  colors: codes.map(([code, hex]) => ({ code, hex })),
});

export const DMC_FAMILIES: DmcFamily[] = [
  family("Whites & Creams", [
    ["B5200", "#fdfdfd"], ["White", "#fafaf7"], ["Blanc", "#f7f5f0"], ["3865", "#f1f1ea"],
    ["Ecru", "#efe5ce"], ["712", "#f6eeda"], ["739", "#f1e0bf"], ["738", "#e7d0a4"],
    ["822", "#e3d4b4"], ["842", "#bda886"], ["3864", "#d6c5a6"], ["3031", "#c9b896"],
  ]),
  family("Yellows & Golds", [
    ["307", "#fcf3c3"], ["745", "#f8e9b0"], ["744", "#f3de8e"], ["743", "#ebd06c"],
    ["726", "#f1d46e"], ["727", "#eccb4c"], ["728", "#e3be3c"], ["725", "#dfc13f"],
    ["972", "#ebc44a"], ["973", "#fce05e"], ["676", "#e9c489"], ["677", "#dba961"],
    ["680", "#c2953f"],
  ]),
  family("Copper & Amber", [
    ["3853", "#e6c86b"], ["922", "#efc974"], ["921", "#dfb558"], ["729", "#e9bc52"],
    ["3852", "#d9a93e"], ["919", "#d6a21f"], ["920", "#c08f35"],
  ]),
  family("Oranges", [
    ["970", "#f7c89c"], ["740", "#f6be97"], ["722", "#f6b377"], ["945", "#f8a87b"],
    ["741", "#f5a26f"], ["742", "#f08b54"], ["946", "#f4874e"], ["721", "#ef8438"],
    ["720", "#e8722c"], ["900", "#d95f1e"], ["608", "#f96a12"],
  ]),
  family("Reds", [
    ["353", "#f4cfc8"], ["352", "#edb6ae"], ["351", "#e39d95"], ["350", "#de8a72"],
    ["349", "#c35147"], ["347", "#a54a3b"], ["666", "#e0242f"], ["321", "#af2e37"],
    ["498", "#a83c46"], ["815", "#ad4347"], ["816", "#9e1f2f"], ["817", "#87202b"],
    ["814", "#89303b"],
  ]),
  family("Pinks & Dusty Rose", [
    ["963", "#f0d3cf"], ["335", "#f0cdcb"], ["150", "#f6dfde"], ["962", "#e7bec0"],
    ["151", "#edc9c6"], ["818", "#edbfbc"], ["3326", "#e499a0"], ["152", "#dea2a0"],
    ["3806", "#e2a0a5"], ["3325", "#c8707d"], ["153", "#c57f80"], ["3713", "#e9b2a6"],
    ["326", "#e9a8a5"], ["3712", "#d68e86"], ["3805", "#d3758a"],
  ]),
  family("Purples & Lavender", [
    ["210", "#e7d6e9"], ["211", "#d9bee2"], ["3748", "#dcc3e0"], ["208", "#c6a0d6"],
    ["212", "#c6a0d0"], ["213", "#b18ac4"], ["209", "#a87fc0"], ["3747", "#c3a2c9"],
    ["554", "#c175b8"], ["553", "#a95b9f"], ["3746", "#8d5f98"], ["552", "#94478d"],
    ["327", "#b4508c"], ["551", "#7e3a78"], ["550", "#6b2d66"],
  ]),
  family("Blues", [
    ["775", "#c4d5e7"], ["3325", "#bfd1e4"], ["800", "#c9d6e8"], ["803", "#bfd0e2"],
    ["826", "#b8cde6"], ["813", "#a5bbd8"], ["806", "#a9c4e0"], ["3760", "#5c7fc0"],
    ["3752", "#9db3d8"], ["824", "#7e9bc7"], ["334", "#7fa6d3"], ["825", "#5c7bb2"],
    ["807", "#6fa0cf"], ["809", "#4e86c6"], ["336", "#4c6fac"], ["828", "#3f5c93"],
    ["312", "#33549b"], ["322", "#3e5da8"], ["796", "#4e5fa3"], ["798", "#4f5d8f"],
    ["797", "#2f3c7e"], ["799", "#37406e"], ["820", "#28417f"], ["3755", "#42568f"],
    ["3750", "#2e3f6f"],
  ]),
  family("Teals & Aquas", [
    ["958", "#b0e4d8"], ["991", "#9ad7e3"], ["501", "#a8deda"], ["992", "#63c1da"],
    ["502", "#6cc6c2"], ["598", "#6fc5c9"], ["993", "#2aa8c4"], ["503", "#3b9e9b"],
    ["599", "#46aeb4"], ["3815", "#7fd2cf"], ["996", "#38b6e0"], ["3847", "#74c3be"],
    ["959", "#5fd1b5"], ["3811", "#1e8fa8"], ["3848", "#3fa9a4"], ["504", "#2c7f82"],
    ["3812", "#2c8f97"], ["3766", "#2e7d8c"], ["995", "#1c8fbe"], ["3849", "#1e7f7d"],
    ["3813", "#1f6e78"], ["3814", "#155e67"], ["960", "#37a98c"],
  ]),
  family("Greens", [
    ["894", "#bfe0c5"], ["911", "#a6e5cb"], ["907", "#c0e876"], ["943", "#a9cb7b"],
    ["3349", "#79b879"], ["913", "#74d2be"], ["368", "#93a061"], ["3348", "#57a05f"],
    ["912", "#4fc4a8"], ["906", "#9cd84f"], ["905", "#7cc22f"], ["470", "#7f9a44"],
    ["471", "#6e8c3a"], ["3347", "#3f8a4c"], ["955", "#3f7d42"], ["700", "#1eb853"],
    ["701", "#0f9a44"], ["702", "#2f7d32"], ["893", "#8cc197"], ["892", "#5e9a6b"],
    ["369", "#74854a"], ["936", "#7b9649"], ["937", "#5b7c3f"], ["703", "#26662b"],
    ["891", "#3e7a50"], ["472", "#556e2c"], ["938", "#46603a"], ["890", "#22422b"],
    ["3345", "#1f5b2c"], ["3346", "#2c6e38"], ["939", "#35482d"], ["704", "#1e4d24"],
  ]),
  family("Browns & Tans", [
    ["3770", "#d6c3a0"], ["738", "#cfa876"], ["3771", "#c98f6b"], ["422", "#c1a87e"],
    ["841", "#be9e6f"], ["420", "#a78b5f"], ["436", "#a67f52"], ["840", "#9c7a4f"],
    ["402", "#96502f"], ["437", "#7d5b38"], ["3862", "#af8e6e"], ["3863", "#94755a"],
    ["3033", "#7a5b40"], ["433", "#8b5e34"], ["301", "#7e3a2b"], ["838", "#6b4a2b"],
    ["434", "#6e4526"], ["435", "#563722"], ["839", "#4e3520"], ["898", "#42301b"],
  ]),
  family("Grays & Blacks", [
    ["640", "#ddd3c2"], ["762", "#e1e2e5"], ["318", "#bfc3c7"], ["645", "#d6d1c7"],
    ["3074", "#c4beb2"], ["415", "#a8abb0"], ["644", "#c8c0b4"], ["642", "#bcb2a3"],
    ["646", "#b5aa9a"], ["647", "#9a9082"], ["414", "#74767b"], ["413", "#55565a"],
    ["3799", "#383838"], ["310", "#000000"],
  ]),
];

export const DMC_COLORS: DmcColor[] = DMC_FAMILIES.flatMap((item) => item.colors);

export const DMC_INDEX: Map<string, DmcColor> = new Map(DMC_COLORS.map((color) => [color.code, color]));

export const DMC_FAMILY_NAME: Map<string, string> = new Map(
  DMC_FAMILIES.flatMap((item) => item.colors.map((color) => [color.code, item.name] as const)),
);

// One unique mark per used color so printed charts can be stitched by symbol.
export const LEGEND_SYMBOLS = [
  "●", "■", "▲", "◆", "★", "✚", "✖", "◼", "▣", "◈",
  "◑", "◒", "⬤", "▤", "▥", "⊙", "⊘", "⊗", "♠", "♣",
  "♥", "♦", "♪", "♫", "☘", "✿", "❀", "❤", "☀", "☁",
  "☾", "✦", "✧", "✜", "⍟", "⌂", "☰", "☱", "☴", "☷",
];
