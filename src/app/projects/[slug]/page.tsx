import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectBlocks } from "@/components/project-blocks";
import { Reveal } from "@/components/reveal";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { getProject, projects } from "@/data/projects";

// Every project page is generated at build time (required for static export).
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.short,
    description: project.summary,
    openGraph: project.cover ? { images: [project.cover.src] } : undefined,
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  const meta = [
    { label: "Client", value: project.client },
    { label: "Role", value: project.role },
    { label: "Timeframe", value: project.timeframe },
    ...(project.details ?? []),
  ];

  return (
    <article className="mx-auto max-w-[1280px] px-[var(--edge)] pb-8 pt-24">
      <div className="mx-auto w-[min(541px,100%)]">
      <Link
        href="/projects"
        className="inline-block text-muted transition-colors hover:text-fg"
      >
        ← All projects
      </Link>

      <header className="mt-10 flex flex-col gap-6">
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
          {meta.map((m) => (
            <div key={m.label} className="contents">
              <dt className="text-muted">{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>
      </div>

      {project.cover && (
        <Reveal className="mt-[clamp(48px,6.78vw,96px)]">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.w}
            height={project.cover.h}
            priority
            sizes="(min-width: 1280px) 1232px, 100vw"
            className="h-auto w-full rounded-sm bg-fg/[0.04]"
          />
        </Reveal>
      )}

      <div className="mt-[clamp(48px,6.78vw,96px)]">
        <ProjectBlocks blocks={project.blocks} />
      </div>

      <Reveal className="mt-[clamp(96px,13.56vw,192px)]">
        <Link
          href={`/projects/${next.slug}`}
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
