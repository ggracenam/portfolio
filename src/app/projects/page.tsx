import type { Metadata } from "next";
import Link from "next/link";
import { Cover } from "@/components/cover";
import { Reveal } from "@/components/reveal";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Projects" };

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-[var(--edge)] pb-8 pt-24">
      <header className="mb-8 flex items-baseline justify-between gap-6">
        <TextEffect
          as="h1"
          per="char"
          preset="fade-in-blur"
          speedReveal={1.6}
          className="font-semibold"
        >
          Projects
        </TextEffect>
        <p className="text-muted tabular-nums">{projects.length} projects</p>
      </header>

      <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 3) * 0.08}>
            <Link href={`/projects/${project.slug}`} className="group block">
              <Cover project={project} mode="card" />
              <div className="mt-2.5 flex items-baseline justify-between gap-4">
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
