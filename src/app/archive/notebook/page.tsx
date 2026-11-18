import type { Metadata } from "next";
import { MediaPage } from "@/components/media-page";
import { Reveal } from "@/components/reveal";
import { notebook } from "@/data/media";

export const metadata: Metadata = { title: "Notebook" };

const story = [
  "In the summer of 2026, I hurt my back so badly that I couldn’t stand up or walk. A herniated disc at L4/L5 had left my spinal canal severely compressed, and I was stuck at home, staring at my bedroom ceiling.",
  "So I picked up drawing again. I made an account just for my illustrations and started posting, with no plan beyond giving the days something to hold onto. Then a piece of fan art was noticed by the art community, and people began to find me. Somewhere between the pain and the long days indoors, I found a community.",
  "Since then, my illustrations have reached an audience I never expected, with one of my most widely viewed reels reaching 1.47M views and 198K likes. More recently, I’ve shifted towards sharing individual illustrations as posts, choosing a closer-knit community and more meaningful conversations over numbers.",
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
