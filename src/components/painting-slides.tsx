"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import type { Block } from "@/data/projects";
import { useCompact } from "@/lib/use-compact";

type Artwork = Extract<Block, { type: "artworks" }>["items"][number];

/**
 * Sizes the paintings so they all take up about the same area on screen: portraits end up
 * narrower and a landscape one wider, but none is cropped, stretched or padded.
 * Returns a frame height in px for each painting (its width follows from its own proportions).
 */
function useEqualAreaHeights(items: Artwork[]) {
  const [vp, setVp] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const apply = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);
  if (!vp) return null;

  // Space available for one picture (matches the layout rules in globals.css).
  const H = vp.w >= 1024 ? vp.h - 14 * 16 : vp.h * 0.68;
  const W =
    vp.w >= 1440
      ? 584
      : vp.w >= 1024
        ? Math.min(vp.w - 48 - 412, 948)
        : vp.w - 48;

  const ratios = items.map((a) => (a.image ? a.image.w / a.image.h : 1));
  // Largest common area every painting can reach without exceeding H tall or W wide.
  const area = Math.min(...ratios.map((r) => Math.min(H * H * r, (W * W) / r)));
  return ratios.map((r) => Math.sqrt(area / r));
}

function Slide({
  art,
  compact,
  height,
  first,
}: {
  art: Artwork;
  compact: boolean;
  height: number | null;
  first: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Same blur-and-fade as the home page scroll.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // The first painting sits right under the project info, so it starts fully clear and only softens as it leaves.
  const stops = first
    ? compact
      ? [0, 0.7, 0.88, 1]
      : [0, 0.64, 0.64, 0.9]
    : compact
      ? [0, 0.12, 0.3, 0.7, 0.88, 1]
      : [0.1, 0.36, 0.36, 0.64, 0.64, 0.9];
  const opacity = useTransform(
    scrollYProgress,
    stops,
    first
      ? compact
        ? [1, 1, 0.7, 0.15]
        : [1, 1, 1, 0]
      : compact
        ? [0.15, 0.7, 1, 1, 0.7, 0.15]
        : [0, 1, 1, 1, 1, 0],
  );
  const blur = useTransform(
    scrollYProgress,
    stops,
    first
      ? compact
        ? [0, 0, 3, 10]
        : [0, 0, 0, 26]
      : compact
        ? [10, 3, 0, 0, 3, 10]
        : [26, 0, 0, 0, 0, 26],
  );
  const filter = useMotionTemplate`blur(${blur}px)`;
  const scale = useTransform(
    scrollYProgress,
    stops,
    first
      ? compact
        ? [1, 1, 0.98, 0.95]
        : [1, 1, 1, 0.92]
      : compact
        ? [0.95, 0.98, 1, 1, 0.98, 0.95]
        : [0.92, 1, 1, 1, 1, 0.92],
  );

  return (
    <section
      ref={ref}
      aria-label={art.title}
      className={`flex items-center justify-center ${first ? "pb-10 lg:h-auto lg:items-start lg:pb-16" : "py-10 lg:h-svh lg:snap-center lg:py-0"}`}
    >
      <motion.figure
        style={reduce ? undefined : { opacity, filter, scale }}
        className="flex w-full max-w-[1200px] flex-col items-center gap-4 lg:flex-row lg:items-end lg:justify-center lg:gap-8 min-[1440px]:grid min-[1440px]:grid-cols-2 min-[1440px]:justify-normal"
      >
        {/* Under 1440px the picture and details form one centred group.
            Desktop (1440px+): two equal halves, so the gap between picture and details
            sits exactly on the centre line of the page. */}
        <div className="flex min-w-0 justify-center min-[1440px]:justify-end">
          {art.image && (
            <div
              className="media-round media-round--slide"
              style={{
                aspectRatio: `${art.image.w} / ${art.image.h}`,
                ["--ratio" as string]: art.image.w / art.image.h,
                ...(height ? { height } : {}),
              }}
            >
              <Image
                src={art.image.src}
                alt={art.image.alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
        <figcaption
          // Stacked (phones/tablets): as wide as the picture, so the text starts at its left edge.
          className="slide-caption shrink-0"
          style={
            art.image
              ? {
                  ["--ratio" as string]: art.image.w / art.image.h,
                  // stacked layout: as wide as the picture
                  ...(height
                    ? {
                        ["--cap-w" as string]: `${height * (art.image.w / art.image.h)}px`,
                      }
                    : {}),
                }
              : undefined
          }
        >
          <p className="font-semibold">{art.title}</p>
          <dl className="mt-2 grid grid-cols-[56px_1fr] gap-x-3 gap-y-1 text-muted">
            <dt>Year</dt>
            <dd className="text-fg">{art.year}</dd>
            <dt>Medium</dt>
            <dd className="text-fg">{art.medium}</dd>
            <dt>Size</dt>
            <dd className="text-fg">{art.size}</dd>
            {art.note && (
              <>
                <dt>Notes</dt>
                <dd className="text-fg">{art.note}</dd>
              </>
            )}
          </dl>
        </figcaption>
      </motion.figure>
    </section>
  );
}

/** Each painting gets its own screen, with its details beside it. */
export function PaintingSlides({ items }: { items: Artwork[] }) {
  const compact = useCompact();
  const heights = useEqualAreaHeights(items);

  // Gentle snapping so each painting settles in the middle of the screen (laptop and up).
  useEffect(() => {
    if (compact) return;
    const root = document.documentElement;
    root.style.scrollSnapType = "y proximity";
    return () => {
      root.style.scrollSnapType = "";
    };
  }, [compact]);

  return (
    <div>
      {items.map((art, i) => (
        <Slide
          key={art.title}
          art={art}
          compact={compact}
          height={heights ? heights[i] : null}
          first={i === 0}
        />
      ))}
    </div>
  );
}
