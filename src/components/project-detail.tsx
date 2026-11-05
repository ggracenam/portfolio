import Image from "next/image";
import Link from "next/link";
import { ProjectBlocks } from "@/components/project-blocks";
import { Reveal } from "@/components/reveal";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import type { Project } from "@/data/projects";

/** One project / studio piece, laid out like a dmcg.co case study. */
export function ProjectDetail({
  project,
  next,
  base,
}: {
  project: Project;
  next: Project;
  base: "projects" | "studio";
}) {
  const meta = [
    { label: "Client", value: project.client },
    { label: "Role", value: project.role },
    { label: "Timeframe", value: project.timeframe },
    ...(project.details ?? []),
  ].filter((m) => m.value);

  return (
    <article className="mx-auto max-w-[1280px] px-[var(--edge)] pb-8 pt-24">
      <div className="mx-auto w-[min(541px,100%)]">
      <Link
        href={base === "studio" ? "/studio" : "/"}
        className="inline-block text-muted transition-colors hover:text-fg"
      >
        {base === "studio" ? "← Studio" : "← All projects"}
      </Link>

      <header className={project.hideCover ? "mt-6 flex flex-col gap-4" : "mt-10 flex flex-col gap-6"}>
        <TextEffect
          as="h1"
          per="word"
          preset="fade-in-blur"
          speedReveal={1.4}
          className="font-semibold"
        >
          {project.title}
        </TextEffect>

        <dl className="grid grid-cols-[116px_1fr] gap-x-4 gap-y-1">
          {meta.map((m) =>
            // Gallery pages: "Personal" replaces the "Client" label, with no value beside it.
            project.hideCover && m.label === "Client" && m.value === "Personal" ? (
              <dt key={m.label} className="col-span-2 text-muted">
                Personal
              </dt>
            ) : (
              <div key={m.label} className="contents">
                <dt className="text-muted">{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ),
          )}
        </dl>
      </header>
      </div>

      {project.cover && !project.hideCover && (
        <Reveal className="mt-[clamp(48px,6.78vw,96px)]">
          <div className="media-round mx-auto w-[min(942px,100%)]">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              width={project.cover.w}
              height={project.cover.h}
              priority
              sizes="(min-width: 990px) 942px, 100vw"
            />
          </div>
        </Reveal>
      )}

      <div className={project.hideCover ? "mt-10" : "mt-[clamp(48px,6.78vw,96px)]"}>
        <ProjectBlocks blocks={project.blocks} />
      </div>

      <Reveal className="mt-[clamp(96px,13.56vw,192px)]">
        <Link
          href={`/${base}/${next.slug}`}
          className="group mx-auto flex w-[min(541px,100%)] items-baseline justify-between gap-6 border-t border-line pt-4"
        >
          <span className="flex gap-4">
            <span className="text-muted">Next project</span>
            <span>{next.short}</span>
          </span>
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </Reveal>
    </article>
  );
}
