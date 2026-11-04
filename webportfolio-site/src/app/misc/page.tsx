import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { exhibitions } from "@/data/exhibitions";

export const metadata: Metadata = { title: "Misc" };

export default function MiscPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-8 pt-28 md:pt-36">
      <TextEffect
        as="h1"
        per="word"
        preset="fade-in-blur"
        speedReveal={1.4}
        className="max-w-[10ch] text-[clamp(40px,8vw,104px)] leading-[0.95] tracking-[-0.04em]"
      >
        Miscellaneous Archives
      </TextEffect>
      <Reveal className="mt-8 text-[18px] text-muted md:text-[22px]">
        <p>For personal record and interests.</p>
      </Reveal>

      <Reveal className="mt-14 md:mt-20">
        <Link
          href="/misc/exhibitions"
          className="group flex items-end justify-between gap-6 border-y border-line py-6 transition-colors hover:border-fg"
        >
          <span className="flex flex-col gap-2">
            <span className="text-muted">Personal</span>
            <span className="text-[clamp(26px,4vw,52px)] leading-[1.03] tracking-[-0.03em]">
              Exhibition Visits
            </span>
          </span>
          <span className="flex items-center gap-4 pb-1">
            <span className="text-muted tabular-nums">{exhibitions.length} entries</span>
            <span
              aria-hidden
              className="text-[24px] transition-transform duration-300 group-hover:translate-x-1.5"
            >
              →
            </span>
          </span>
        </Link>
      </Reveal>
    </div>
  );
}
