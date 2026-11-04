import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { exhibitions } from "@/data/exhibitions";

export const metadata: Metadata = { title: "Misc" };

export default function MiscPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-[var(--edge)] pb-8 pt-24">
      <div className="mx-auto w-[min(541px,100%)]">
      <TextEffect
        as="h1"
        per="word"
        preset="fade-in-blur"
        speedReveal={1.4}
        className="font-semibold"
      >
        Miscellaneous Archives
      </TextEffect>
      <Reveal className="mt-2 text-muted">
        <p>For personal record and interests.</p>
      </Reveal>

      <Reveal className="mt-10">
        <Link
          href="/misc/exhibitions"
          className="group flex items-end justify-between gap-6 border-y border-line py-4 transition-colors hover:border-fg"
        >
          <span className="flex gap-4">
            <span className="text-muted">Personal</span>
            <span>Exhibition Visits</span>
          </span>
          <span className="flex items-center gap-4">
            <span className="text-muted tabular-nums">{exhibitions.length} entries</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </Link>
      </Reveal>
      </div>
    </div>
  );
}
