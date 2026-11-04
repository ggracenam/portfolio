import type { Metadata } from "next";
import Link from "next/link";
import { Cover } from "@/components/cover";
import { Reveal } from "@/components/reveal";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-8 pt-28 md:pt-36">
      <header className="mb-12 flex items-end justify-between gap-6 md:mb-16">
        <TextEffect
          as="h1"
          per="char"
          preset="fade-in-blur"
          speedReveal={1.6}
          className="text-[clamp(40px,8vw,104px)] leading-[0.95] tracking-[-0.04em]"
        >
          Work
        </TextEffect>
        <p className="pb-2 text-muted tabular-nums">{projects.length} projects</p>
      </header>

      <div className="grid gap-x-3 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 3) * 0.08}>
            <Link href={`/work/${project.slug}`} className="group block">
              <Cover project={project} mode="card" />
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <span>{project.short}</span>
                <span className="text-muted">{project.category}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
