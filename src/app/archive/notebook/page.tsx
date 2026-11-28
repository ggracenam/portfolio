import type { Metadata } from "next";
import { MediaPage } from "@/components/media-page";
import { Reveal } from "@/components/reveal";
import { notebook } from "@/data/media";

export const metadata: Metadata = { title: "Notebook" };

const story = [
  "In the summer of 2026, I hurt my back so badly I couldn’t stand or walk. Stuck at home, I picked up drawing again and started posting under an account made just for my illustrations, with no plan beyond giving the days something to hold onto.",
  "A piece of fan art was noticed by the art community, and people began to find me. One reel reached 1.47M views. Since then I’ve shifted toward sharing individual illustrations as posts, choosing a closer-knit community and more meaningful conversations over numbers.",
];

/** Bolds the reach numbers in a paragraph. */
function withItalics(text: string) {
  return text.split(/(1\.47M|198K)/).map((part, i) =>
    part === "1.47M" || part === "198K" ? <strong key={i} className="font-semibold">{part}</strong> : part,
  );
}

export default function NotebookPage() {
  return (
    <MediaPage title="Notebook" items={notebook} layout="pages">
      <Reveal className="mt-10">
        <h2 className="font-semibold">Analog in a Digital World</h2>
        <p className="mt-2 text-muted">
          Inspired by graphic fashion illustrations and popular culture
        </p>
        <p className="mt-6">
          An exploration of traditional drawing aesthetics through a digital medium.
        </p>
      </Reveal>

      <Reveal className="mt-10">
        <h2 className="font-semibold">The Story</h2>
        <div className="mt-2 space-y-[22px]">
          {story.map((para) => (
            <p key={para}>{withItalics(para)}</p>
          ))}
        </div>
      </Reveal>
    </MediaPage>
  );
}
