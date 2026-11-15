import Image from "next/image";
import Link from "next/link";
import { ProjectBlocks } from "@/components/project-blocks";
import { Reveal } from "@/components/reveal";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { HoverVideo } from "@/components/hover-video";
import { Phone } from "@/components/phone";
import type { Project } from "@/data/projects";

/** One project / studio piece, laid out like a dmcg.co case study. */
export function ProjectDetail({
  project,
  next,
  base,
  relatedLabel,
}: {
  project: Project;
  next: Project;
  base: "projects" | "archive";
  /** Replaces "Next project" in the footer link (set when the page names a related project). */
  relatedLabel?: string;
}) {
  const meta = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year ?? "" },
    { label: "Role", value: project.role },
  ].filter((m) => m.value);

  return (
    <article className={`mx-auto max-w-[1280px] px-[var(--edge)] pb-8 pt-24${project.noOutline ? " no-outline" : ""}`}>
      <div className="mx-auto w-[min(541px,100%)]">
      <Link
        href={base === "archive" ? "/archive" : "/"}
        className="inline-block text-muted transition-colors hover:text-fg"
      >
        {base === "archive" ? "← Studio" : "← All projects"}
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
        {project.subtitle && <p className="-mt-3 text-muted">{project.subtitle}</p>}

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

      {project.phone && (
        <Reveal className="mt-[clamp(48px,6.78vw,96px)]">
          <Phone
            src={project.phone.src}
            title={project.title}
            interactive
            className="mx-auto"
            style={{ width: "min(88vw, 360px, calc(var(--fit-h) * 696 / 1368))" }}
          />
        </Reveal>
      )}

      {project.cover && !project.hideCover && (
        <Reveal className={project.hero ? "mt-8" : "mt-[clamp(48px,6.78vw,96px)]"}>
          {!project.hero && project.spread?.length ? (
            // Poster sets: the first two pages side by side, like the opened cover on the home page.
            <div
              className="mx-auto grid grid-cols-2 gap-3"
              style={{ width: `min(942px, 100%, calc(var(--fit-h) * ${(project.cover.w / project.cover.h) * 2} + 12px))` }}
            >
              {[project.cover, project.spread[0]].map((img, i) => (
                <div key={img.src} className="media-round" style={{ borderRadius: 2 }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.w}
                    height={img.h}
                    priority={i === 0}
                    sizes="(min-width: 990px) 465px, 50vw"
                  />
                </div>
              ))}
            </div>
          ) : (
          <div
            className={project.video && !project.hero ? "relative mx-auto" : (project.reveal && !project.hero) || project.fold || project.wind || project.heroPlain ? "mx-auto" : "media-round mx-auto"}
            style={{ width: `min(${project.video && !project.hero ? "520px" : project.hero ? `${project.heroMax ?? 760}px` : "942px"}, 100%, calc(${project.heroFull ? "4000px" : project.heroPlain ? "var(--fit-h)" : project.hero ? "max(300px, 100svh - 390px)" : "var(--fit-h)"} * ${(project.hero ?? project.cover).w / (project.hero ?? project.cover).h}))` }}
          >
            <Image
              src={(project.hero ?? project.cover).src}
              alt={(project.hero ?? project.cover).alt}
              width={(project.hero ?? project.cover).w}
              height={(project.hero ?? project.cover).h}
              priority
              sizes="(min-width: 990px) 942px, 100vw"
            />
            {project.video && !project.hero && (
              <HoverVideo webm={project.video.webm} mp4={project.video.mp4} active autoPlay />
            )}
          </div>
          )}
        </Reveal>
      )}

      <div className={project.hideCover ? "mt-10" : project.spacing === "large" ? "mt-[clamp(96px,13.56vw,192px)]" : "mt-[clamp(48px,6.78vw,96px)]"}>
        <ProjectBlocks blocks={project.blocks} spacing={project.spacing} />
      </div>

      <Reveal className="mt-[clamp(96px,13.56vw,192px)]">
        <Link
          href={`/${base}/${next.slug}`}
          className="group mx-auto flex w-[min(541px,100%)] items-baseline justify-between gap-6 border-t border-line pt-4"
        >
          <span className="flex gap-4">
            <span className="text-muted">{relatedLabel ?? "Next project"}</span>
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
