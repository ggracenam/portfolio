import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { exhibitions, exhibitionYear } from "@/data/exhibitions";

export const metadata: Metadata = {
  title: "Exhibition Visits",
  description: "A record of my art explorations from 2019 onwards.",
};

export default function ExhibitionsPage() {
  // Group by year, keeping the original (newest-first) order.
  const groups: { year: string; items: typeof exhibitions }[] = [];
  for (const e of exhibitions) {
    const year = exhibitionYear(e);
    const last = groups[groups.length - 1];
    if (last && last.year === year) last.items.push(e);
    else groups.push({ year, items: [e] });
  }

  return (
    <div className="mx-auto max-w-[1280px] px-[var(--edge)] pb-8 pt-24">
      <div className="mx-auto w-[min(541px,100%)]">
      <Link href="/misc" className="inline-block text-muted transition-colors hover:text-fg">
        ← Misc
      </Link>

      <TextEffect
        as="h1"
        per="word"
        preset="fade-in-blur"
        speedReveal={1.4}
        className="mt-10 font-semibold"
      >
        Exhibition Visits
      </TextEffect>
      <Reveal className="mt-2 text-muted">
        <p>A record of my art explorations from 2019 onwards.</p>
      </Reveal>

      <div className="mt-10 flex flex-col gap-10">
        {groups.map((g) => (
          <section key={g.year} className="grid gap-2">
            <h2 className="font-semibold tabular-nums">{g.year}</h2>
            <ul className="divide-y divide-line border-y border-line">
              {g.items.map((e, i) => (
                <li
                  key={`${e.title}-${i}`}
                  className="grid gap-1 py-3 sm:grid-cols-[1fr_auto] sm:gap-8"
                >
                  <div className="flex flex-col gap-0.5">
                    <span>{e.title}</span>
                    <span className="text-muted">
                      {e.venue}, {e.city}
                      {e.note ? ` · ${e.note}` : ""}
                    </span>
                  </div>
                  <span className="text-muted tabular-nums">{e.date}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      </div>
    </div>
  );
}
