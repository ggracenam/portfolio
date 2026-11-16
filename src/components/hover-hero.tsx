"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/data/projects";

/** Project-page hero that crossfades to the hover image, like the cover on the projects page. */
export function HoverHero({ project }: { project: Project }) {
  const img = (project.hero ?? project.cover)!;
  const alt = (project.heroHover ?? project.hoverCover)!;
  const [on, setOn] = useState(false);
  const ratio = img.w / img.h;
  return (
    <div
      className="relative mx-auto"
      style={{ width: `min(${project.heroMax ?? 942}px, 100%, calc(var(--fit-h) * ${ratio}))`, aspectRatio: ratio }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOn(true)}
      onPointerLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      tabIndex={0}
    >
      <Image src={img.src} alt={img.alt} fill priority sizes="(min-width: 990px) 942px, 100vw" className="object-contain" />
      <Image
        src={alt.src}
        alt=""
        fill
        sizes="(min-width: 990px) 942px, 100vw"
        className={`object-contain transition-opacity duration-[600ms] ease-out ${on ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
