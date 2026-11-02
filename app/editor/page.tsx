import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bead Pattern Editor",
  description: "Create, edit, and export bead patterns in the perlerbeadmake editor.",
};

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ handoff?: string }> }) {
  const { handoff } = await searchParams;
  return (
    <main style={{ height: "100dvh", overflow: "hidden", background: "#151528" }}>
      <iframe
        title="Bead pattern editor"
        src={handoff ? `/editor/index.html?handoff=${encodeURIComponent(handoff)}` : "/editor/index.html"}
        style={{ display: "block", width: "100%", height: "100%", border: 0 }}
      />
    </main>
  );
}
