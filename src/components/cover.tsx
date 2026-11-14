import Image from "next/image";
import type { Project } from "@/data/projects";

function Placeholder({ project }: { project: Project }) {
  return (
    <div className="flex h-full w-full flex-col justify-between border border-line bg-fg/[0.04] p-4 text-left">
      <span className="text-[length:var(--fs-cap)] text-muted">{project.category}</span>
      <span className="font-semibold">
        {project.short}
      </span>
    </div>
  );
}

/**
 * "showcase": sized to the image's own proportions, capped by viewport (home page).
 * "card": fixed 4:3 crop that fills its container (work grid).
 */
export function Cover({
  project,
  mode,
}: {
  project: Project;
  mode: "showcase" | "card";
}) {
  const img = project.cover;

  // Poster sets: the grid card shows the first two pages as a pair (two 2:3 pages make a 4:3 frame).
  if (mode === "card" && img && project.spread?.length) {
    const pair = [img, project.spread[0]];
    return (
      <div className="grid aspect-[4/3] grid-cols-2 gap-px overflow-hidden rounded-[2px] bg-fg/[0.04]">
        {pair.map((p, i) => (
          <div key={p.src} className="relative">
            <Image
              src={p.src}
              alt={i === 0 ? p.alt : ""}
              fill
              sizes="(min-width: 768px) 17vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>
        ))}
      </div>
    );
  }

  if (mode === "card") {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-fg/[0.04]">
        {img ? (
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <Placeholder project={project} />
        )}
      </div>
    );
  }

  const ratio = img ? img.w / img.h : 4 / 3;
  return (
    <div
      className={`relative overflow-hidden ${project.spread?.length ? "rounded-[2px]" : "rounded-md"}`}
      style={{
        aspectRatio: ratio,
        width: `min(82vw, clamp(560px, 32vw, 800px), calc(56svh * ${ratio}))`,
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
    </div>
  );
}
