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
  props: PageProps<"/work/[slug]">,
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

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
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
    <article className="mx-auto max-w-[1100px] px-4 pb-8 pt-28 md:pt-36">
      <Link
        href="/work"
        className="inline-block text-muted transition-colors hover:text-fg"
      >
        ← All work
      </Link>

      <header className="mt-8 flex flex-col gap-8 md:mt-10 md:gap-12">
        <TextEffect
          as="h1"
          per="word"
          preset="fade-in-blur"
          speedReveal={1.4}
          className="max-w-[20ch] text-[clamp(30px,5.4vw,68px)] leading-[1.02] tracking-[-0.035em]"
        >
          {project.title}
        </TextEffect>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-5 md:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label} className="flex flex-col gap-1">
              <dt className="text-muted">{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {project.cover && (
        <Reveal className="mt-10 md:mt-14">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.w}
            height={project.cover.h}
            priority
            sizes="(min-width: 1100px) 1068px, 100vw"
            className="h-auto w-full rounded-md bg-fg/[0.04]"
          />
        </Reveal>
      )}

      <div className="mt-14 md:mt-24">
        <ProjectBlocks blocks={project.blocks} />
      </div>

      <Reveal className="mt-24 md:mt-36">
        <Link
          href={`/work/${next.slug}`}
          className="group flex items-end justify-between gap-6 border-t border-line pt-6"
        >
          <span className="flex flex-col gap-2">
            <span className="text-muted">Next project</span>
            <span className="text-[clamp(24px,4vw,48px)] leading-[1.05] tracking-[-0.03em]">
              {next.short}
            </span>
          </span>
          <span
            aria-hidden
            className="pb-1 text-[28px] transition-transform duration-300 group-hover:translate-x-1.5"
          >
            →
          </span>
        </Link>
      </Reveal>
    </article>
  );
}
