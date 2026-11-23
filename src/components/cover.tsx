import Image from "next/image";
import type { Project } from "@/data/projects";
import { HoverVideo } from "@/components/hover-video";
import { Phone } from "@/components/phone";

/** Grid card hover, matched to dmcg.co: lifts 2px with a soft shadow falling beneath (outline only on keyboard focus). */
const CARD_HOVER =
  "transition-[transform,box-shadow] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:shadow-[0_22px_22px_-20px_rgb(0_0_0/0.5)] group-focus-visible:-translate-y-0.5 group-focus-visible:shadow-[0_22px_22px_-20px_rgb(0_0_0/0.5),0_0_0_3px_#fff,0_0_0_4px_rgb(0_0_0/0.7)]";

function Placeholder({ project }: { project: Project }) {
  return (
    <div className="flex h-full w-full flex-col justify-between border border-line bg-white p-4 text-left">
      <span className="text-[length:var(--fs-cap)] text-muted">
        {project.category}
      </span>
      <span className="font-semibold">{project.short}</span>
    </div>
  );
}

/**
 * "showcase": sized to the image's own proportions, capped by viewport (home page).
 * "card": fixed 4:3 frame; the whole design fits inside it, uncropped (work grid).
 */
export function Cover({
  project,
  mode,
  playing = false,
}: {
  project: Project;
  mode: "showcase" | "card";
  /** Plays the project's hover video over the cover. */
  playing?: boolean;
}) {
  const img = project.cover;

  if (project.phone) {
    if (mode === "card") {
      return (
        <div
          className={`flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-white ${CARD_HOVER}`}
        >
          <Phone
            src={project.phone.src}
            title={project.short}
            className="h-[88%]"
          />
        </div>
      );
    }
    return (
      <Phone
        src={project.phone.src}
        title={project.short}
        style={{ width: "min(56vw, calc(62svh * 696 / 1368), 300px)" }}
      />
    );
  }

  // Poster sets: the grid card shows the first two pages as a pair (two 2:3 pages make a 4:3 frame).
  if (mode === "card" && img && project.spread?.length) {
    const pair = [img, project.spread[0]];
    return (
      <div
        className={`grid aspect-[4/3] grid-cols-2 gap-px overflow-hidden rounded-[2px] bg-white ${CARD_HOVER}`}
      >
        {pair.map((p, i) => (
          <div key={p.src} className="relative">
            <Image
              src={p.src}
              alt={i === 0 ? p.alt : ""}
              fill
              sizes="(min-width: 768px) 17vw, 50vw"
              className="object-contain"
            />
          </div>
        ))}
      </div>
    );
  }

  if (mode === "card") {
    // The whole design always shows (never cropped); any spare space is white.
    const fit = "object-contain";
    return (
      <div
        className={`relative aspect-[4/3] overflow-hidden bg-white ${CARD_HOVER} ${project.wind ? "rounded-none" : "rounded-md"}`}
      >
        {img ? (
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className={fit}
          />
        ) : (
          <Placeholder project={project} />
        )}
        {img && project.video && (
          <HoverVideo
            webm={project.video.webm}
            mp4={project.video.mp4}
            active={playing}
            fit={fit}
          />
        )}
        {project.hoverCover && (
          <Image
            src={project.hoverCover.src}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className={`${fit} transition-opacity duration-[600ms] ease-out ${playing ? "opacity-100" : "opacity-0"}`}
          />
        )}
      </div>
    );
  }

  const ratio = img ? img.w / img.h : 4 / 3;
  return (
    <div
      className={`relative overflow-hidden ${project.sharpCover ? "" : project.spread?.length || project.wind ? "rounded-[2px]" : "rounded-md"}`}
      style={{
        aspectRatio: ratio,
        width: project.coverSvh
          ? `calc(0.9 * min(82vw, calc(${project.coverSvh}svh * ${ratio})))`
          : project.video
            ? `min(82vw, calc(min(40vw, 64svh) * ${ratio}))`
            : `min(82vw, clamp(560px, 32vw, 800px), calc(56svh * ${ratio}))`,
      }}
    >
      {img ? (
        <Image
          src={img.src}
          alt={img.alt}
          fill
          priority={false}
          sizes="(min-width: 768px) 800px, 82vw"
          className="object-cover"
        />
      ) : (
        <Placeholder project={project} />
      )}
      {img && project.video && (
        <HoverVideo
          webm={project.video.webm}
          mp4={project.video.mp4}
          active={playing}
        />
      )}
      {project.hoverCover && (
        <Image
          src={project.hoverCover.src}
          alt=""
          fill
          sizes="(min-width: 768px) 800px, 82vw"
          className={`object-cover transition-opacity duration-[600ms] ease-out ${playing ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
