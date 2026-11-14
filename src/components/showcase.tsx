"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Cover } from "@/components/cover";
import { Reveal } from "@/components/reveal";
import { useCompact } from "@/lib/use-compact";
import type { Project } from "@/data/projects";
import { site } from "@/data/site";

const small = "text-[length:var(--fs)] leading-[var(--lh)]";
const pill =
  "items-baseline gap-2 whitespace-nowrap rounded-xl border border-line bg-pill px-3 py-1.5 text-[length:var(--fs-cap)] leading-[16px] backdrop-blur-md";

/** Other paintings from the project, for the hover fan (the cover itself is left out). */
function fanImages(project: Project) {
  const out: { src: string; alt: string }[] = [];
  for (const b of project.blocks) {
    if (b.type !== "artworks") continue;
    for (const a of b.items) {
      if (a.image && a.image.src !== project.cover?.src) out.push(a.image);
    }
  }
  return out.slice(0, 3);
}

// A hand of cards: the cover and the other paintings all pivot on one point at their bottom
// centre. The cover tilts furthest left and stays on top; the rest follow in even steps to the right.
const FRONT = -18;
const STEP = 12;
const FAN = [0, 1, 2].map((i) => ({ r: FRONT + STEP * (i + 1), x: 0 }));

/** Cards tucked behind the cover; they fan out like a hand of cards while hovered. */
function CoverFan({ images, open, reduce }: { images: { src: string; alt: string }[]; open: boolean; reduce: boolean | null }) {
  return (
    <>
      {images.map((img, i) => {
        const f = FAN[i];
        return (
          <motion.div
            key={img.src}
            aria-hidden
            initial={false}
            animate={open ? { rotate: f.r, x: f.x, y: 0, opacity: 1 } : { rotate: 0, x: 0, y: 0, opacity: 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 190, damping: 20, mass: 0.8, delay: open ? i * 0.04 : 0 }
            }
            style={{ transformOrigin: "50% 100%", zIndex: -1 - i }}
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl bg-bg shadow-[0_0_0_1px_var(--line),0_18px_40px_-24px_rgb(0_0_0/0.5)] "
          >
            <Image src={img.src} alt="" fill sizes="400px" className="object-cover" />
          </motion.div>
        );
      })}
    </>
  );
}

// Poster sets: the cover's partner slides out to its right, the rest stay tucked behind it.
const SPREAD_GAP = 52; // percent of the cover's width: centres of the two posters, a hair apart
const SPREAD_STEP = 6.5; // how far each further poster peeks out past the one before

function PosterSpread({
  pages,
  open,
  reduce,
}: {
  pages: { src: string; alt: string }[];
  open: boolean;
  reduce: boolean | null;
}) {
  return (
    <>
      {pages.map((img, i) => (
        <motion.div
          key={img.src}
          initial={false}
          aria-hidden={i > 0 ? true : undefined}
          animate={{
            x: open ? `${SPREAD_GAP + i * SPREAD_STEP}%` : "0%",
            opacity: open ? 1 : 0,
          }}
          transition={
            reduce ? { duration: 0 } : { type: "spring", stiffness: 190, damping: 22, mass: 0.8, delay: open ? i * 0.03 : 0 }
          }
          style={{ zIndex: -1 - i }}
          className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[2px] ${
            i === 0
              ? "shadow-[0_30px_70px_-34px_rgb(0_0_0/0.45)]"
              : "shadow-[0_14px_30px_-26px_rgb(0_0_0/0.35)]"
          }`}
        >
          <Image src={img.src} alt={i === 0 ? img.alt : ""} fill sizes="400px" className="object-cover" />
        </motion.div>
      ))}
    </>
  );
}

/** Swaps through a list of words while active, like the category text in the dmcg.co archive. */
function CyclingWord({ words, active }: { words: string[]; active: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) {
      setI(0);
      return;
    }
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 750);
    return () => clearInterval(t);
  }, [active, words.length]);
  return (
    <span className="relative inline-block min-w-[4.2em] opacity-40">
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 5, filter: "blur(3px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.25 }}
        className="inline-block"
      >
        {words[i]}
      </motion.span>
    </span>
  );
}

function ShowcaseItem({
  project,
  compact,
  base,
}: {
  project: Project;
  compact: boolean;
  base: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const fan = fanImages(project);
  const spread = project.spread ?? [];

  // Cursor-following label (mouse only).
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 420, damping: 38, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 420, damping: 38, mass: 0.6 });

  function track(e: React.PointerEvent<HTMLElement>, jump = false) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = e.clientX - r.left + 18;
    const ny = e.clientY - r.top + 18;
    x.set(nx);
    y.set(ny);
    if (jump) {
      sx.jump(nx);
      sy.jump(ny);
    }
  }

  // Each project blurs and fades in as it reaches the middle of the screen,
  // and back out as it leaves.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Phones/tablets use short sections, so the next project is already half on screen:
  // the fade has to be gentler there or it would still be invisible.
  const stops = compact ? [0, 0.12, 0.3, 0.7, 0.88, 1] : [0.1, 0.36, 0.36, 0.64, 0.64, 0.9];
  const opacity = useTransform(
    scrollYProgress,
    stops,
    compact ? [0.15, 0.7, 1, 1, 0.7, 0.15] : [0, 1, 1, 1, 1, 0],
  );
  const blur = useTransform(
    scrollYProgress,
    stops,
    compact ? [10, 3, 0, 0, 3, 10] : [26, 0, 0, 0, 0, 26],
  );
  const filter = useMotionTemplate`blur(${blur}px)`;
  const scale = useTransform(
    scrollYProgress,
    stops,
    compact ? [0.95, 0.98, 1, 1, 0.98, 0.95] : [0.9, 1, 1, 1, 1, 0.9],
  );

  return (
    <section
      ref={ref}
      aria-label={project.title}
      className="relative flex items-center justify-center px-[var(--edge)] py-9 first:pt-24 last-of-type:pb-32 lg:h-svh lg:snap-center lg:py-0 lg:first:pt-0 lg:last-of-type:pb-0"
    >
      <motion.div
        style={reduce ? undefined : { opacity, filter, scale }}
        className="relative"
      >
        <Link
          href={`/${base}/${project.slug}`}
          aria-label={`${project.short} — ${project.category}`}
          className="group relative block"
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse") return;
            track(e, true);
            setHovered(true);
          }}
          onPointerMove={(e) => track(e)}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => (fan.length > 0 || spread.length > 0) && setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          <div className="relative isolate">
            {fan.length > 0 && <CoverFan images={fan} open={hovered} reduce={reduce} />}
            {spread.length > 0 && <PosterSpread pages={spread} open={hovered} reduce={reduce} />}
            <motion.div
              initial={false}
              animate={{
                rotate: fan.length > 0 && hovered ? FRONT : 0,
                x: spread.length > 0 && hovered ? `-${SPREAD_GAP}%` : "0%",
              }}
              transition={
                reduce ? { duration: 0 } : { type: "spring", stiffness: 190, damping: 20, mass: 0.8 }
              }
              style={{ transformOrigin: "50% 100%" }}
            >
              <div className={`${project.phone || project.containCover ? "" : "shadow-[0_30px_70px_-34px_rgb(0_0_0/0.45)]"} ${spread.length > 0 ? "rounded-[2px]" : "rounded-md"} transition-transform duration-500 ease-out ${
                  fan.length > 0 || spread.length > 0 ? "" : "group-hover:scale-[1.018]"
                }`}>
                <Cover project={project} mode="showcase" playing={hovered} />
              </div>
            </motion.div>
          </div>

          {/* Mouse: title + category follow the cursor while hovering. */}
          <motion.span
            aria-hidden
            style={{ x: sx, y: sy }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            className="label-hover pointer-events-none absolute left-0 top-0 z-10 h-[27px] items-center gap-1.5 whitespace-nowrap rounded-full bg-[rgb(243_243_243/0.3)] px-3 text-[length:var(--fs)] font-medium leading-none tracking-[0.02em] shadow-[inset_0_0_0_0.7px_rgb(0_0_0/0.06)] backdrop-blur-[10px]"
          >
            <span>{project.short}</span>
            {project.phone?.words ? (
              <CyclingWord words={project.phone.words} active={hovered} />
            ) : (
              <span className="opacity-40">{project.category}</span>
            )}
          </motion.span>
        </Link>

        {/* Touch screens have no hover, so the label sits under the image. */}
        <span
          aria-hidden
          className={`label-static pointer-events-none absolute left-1/2 top-full mt-5 -translate-x-1/2 ${pill}`}
        >
          <span>{project.short}</span>
          <span className="text-muted">{project.category}</span>
        </span>
      </motion.div>
    </section>
  );
}

type View = "scroll" | "grid";

function ProjectGrid({ projects, base }: { projects: Project[]; base: string }) {
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <div className="mx-auto max-w-[1280px] px-[var(--edge)] pb-24 pt-24">
      <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 3) * 0.08}>
            <Link
              href={`/${base}/${project.slug}`}
              className="group block"
              onPointerEnter={(e) => e.pointerType === "mouse" && setPlaying(project.slug)}
              onPointerLeave={() => setPlaying(null)}
            >
              <Cover project={project} mode="card" playing={playing === project.slug} />
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

/** Projects: a scroll of the works, with a Grid view as an alternative. */
export function Showcase({
  projects,
  base = "projects",
  allowGrid = true,
  showBar = true,
}: {
  projects: Project[];
  base?: "projects" | "archive";
  /** Offer the Scroll | Grid switch (Projects only). */
  allowGrid?: boolean;
  /** Show the fixed bottom bar (the Archive pages have their own). */
  showBar?: boolean;
}) {
  const [view, setView] = useState<View>("scroll");
  const compact = useCompact();
  // Phones and tablets only get the scroll view.
  const shown: View = compact || !allowGrid ? "scroll" : view;

  // Remember the view in the address (#grid) so a reload or shared link keeps it.
  useEffect(() => {
    if (allowGrid && window.location.hash === "#grid") setView("grid");
  }, [allowGrid]);

  // Clicking the name (or the Projects tab) while already here returns to the Scroll view.
  useEffect(() => {
    const reset = () => {
      setView("scroll");
      window.scrollTo({ top: 0 });
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    };
    window.addEventListener("show-scroll-view", reset);
    return () => window.removeEventListener("show-scroll-view", reset);
  }, []);

  function choose(next: View) {
    if (next === view) return;
    setView(next);
    window.scrollTo({ top: 0 });
    const url = window.location.pathname + window.location.search + (next === "grid" ? "#grid" : "");
    window.history.replaceState(null, "", url);
  }

  // Gentle snapping so each project settles in the middle of the screen (scroll view only).
  useEffect(() => {
    if (shown !== "scroll" || compact) return;
    const root = document.documentElement;
    root.style.scrollSnapType = "y proximity";
    return () => {
      root.style.scrollSnapType = "";
    };
  }, [shown, compact]);

  return (
    <div>
      {shown === "scroll" ? (
        projects.map((project) => (
          <ShowcaseItem key={project.slug} project={project} compact={compact} base={base} />
        ))
      ) : (
        <ProjectGrid projects={projects} base={base} />
      )}

      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 items-end bg-gradient-to-t from-bg via-bg/70 to-transparent px-[var(--edge)] pb-5 pt-12 lg:grid-cols-[1fr_auto_1fr] ${small}`}
      >
        <span>
          {site.footerLeft}
        </span>
        {allowGrid ? (
          <div
            role="group"
            aria-label="View"
            className="pointer-events-auto hidden justify-center gap-1 lg:flex"
          >
            {(["scroll", "grid"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => choose(v)}
                aria-pressed={shown === v}
                className={`rounded-md border px-2.5 py-1 capitalize transition-colors ${
                  shown === v ? "border-line bg-pill" : "border-transparent text-muted hover:text-fg"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        ) : (
          <span aria-hidden />
        )}
        <span className="justify-self-end">
          {site.footerRight}
        </span>
      </div>
    </div>
  );
}
