"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { RevealCover } from "@/components/reveal-cover";
import { WindCover } from "@/components/wind-cover";
import { FoldCover } from "@/components/fold-cover";
import { FlipCover, overSkis } from "@/components/flip-cover";
import { Reveal } from "@/components/reveal";
import { useCompact, useMobile } from "@/lib/use-compact";
import { useLabelCursor } from "@/components/halo-cursor";
import { RESTORE_FLAG } from "@/components/back-link";
import type { Project } from "@/data/projects";
import { site } from "@/data/site";

const small = "text-[length:var(--fs)] leading-[var(--lh)]";
const pill =
  "items-baseline gap-2 whitespace-nowrap sq rounded-[16.8px] border border-line bg-pill px-3 py-1.5 text-[length:var(--fs-cap)] leading-[16px] backdrop-blur-md";

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
// On phones the held-open fan is closer: less of each card peeks out from behind the one in front.
const FRONT_M = -8;
const STEP_M = 5.4;
const FAN_M = [0, 1, 2].map((i) => ({ r: FRONT_M + STEP_M * (i + 1), x: 0 }));

/** Cards tucked behind the cover; they fan out like a hand of cards while hovered. */
function CoverFan({
  images,
  open,
  reduce,
  tight = false,
}: {
  images: { src: string; alt: string }[];
  open: boolean;
  reduce: boolean | null;
  tight?: boolean;
}) {
  return (
    <>
      {images.map((img, i) => {
        const f = (tight ? FAN_M : FAN)[i];
        return (
          <motion.div
            key={img.src}
            aria-hidden
            initial={false}
            animate={
              open
                ? { rotate: f.r, x: f.x, y: 0, opacity: 1 }
                : { rotate: 0, x: 0, y: 0, opacity: 0 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 190,
                    damping: 20,
                    mass: 0.8,
                    delay: open ? i * 0.04 : 0,
                  }
            }
            style={{ transformOrigin: "50% 100%", zIndex: -1 - i }}
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl bg-bg shadow-[0_0_0_1px_var(--line),0_18px_40px_-24px_rgb(0_0_0/0.5)] "
          >
            <Image
              src={img.src}
              alt=""
              fill
              sizes="400px"
              className="object-cover"
            />
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
            reduce
              ? { duration: 0 }
              : {
                  type: "spring",
                  stiffness: 190,
                  damping: 22,
                  mass: 0.8,
                  delay: open ? i * 0.03 : 0,
                }
          }
          style={{ zIndex: -1 - i }}
          className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[2px] ${
            i === 0
              ? "shadow-[0_30px_70px_-34px_rgb(0_0_0/0.45)]"
              : "shadow-[0_14px_30px_-26px_rgb(0_0_0/0.35)]"
          }`}
        >
          <Image
            src={img.src}
            alt={i === 0 ? img.alt : ""}
            fill
            sizes="400px"
            className="object-cover"
          />
        </motion.div>
      ))}
    </>
  );
}

/** The project title for the hover label; Korean words are set in italic, as on the project page. */
function LabelTitle({ title }: { title: string }) {
  return (
    <span>
      {title
        .split(/(\s+)/)
        .map((w, i) =>
          /[\u3131-\u318E\uAC00-\uD7A3]/.test(w) ? <i key={i}>{w}</i> : w,
        )}
    </span>
  );
}

/** The words shown beside the title while hovering: the project's own disciplines (the line under its title). */
function projectWords(project: Project): string[] {
  const parts = (project.subtitle ?? "")
    .split("·")
    .map((w) => w.trim())
    .filter(Boolean);
  return parts.length ? parts : [project.category];
}

/** Swaps through a list of words every couple of seconds while active, like the discipline text in the dmcg.co hover label. */
function CyclingWord({
  words,
  active,
  solid,
}: {
  words: string[];
  active: boolean;
  solid?: boolean;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) {
      setI(0);
      return;
    }
    if (words.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2000);
    return () => clearInterval(t);
  }, [active, words.length]);
  const ref = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);
  // Measure the word whenever it changes and whenever the label becomes visible (it is display:none until hovered,
  // so the first measurement can be 0). The first real width is applied instantly; later ones slide.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const width = el.offsetWidth; // layout width: unaffected by scale transforms (e.g. a card still animating in)
      if (width > 0) setW((prev) => (prev === width ? prev : width));
    };
    measure();
    if (!active) return;
    // While hovered, keep checking each frame: right after switching views the label can be laid out a beat late.
    let raf = requestAnimationFrame(function tick() {
      measure();
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [i, words, active]);
  useEffect(() => {
    if (w !== null && w > 0) {
      const t = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(t);
    }
  }, [w]);
  useEffect(() => {
    if (!active) setAnimate(false);
  }, [active]);
  return (
    <span
      className={`relative inline-block ${solid ? "" : "opacity-40"}`}
      style={{
        height: "1.2em",
        width: w === null ? undefined : w,
        transition: animate ? "width 0.3s cubic-bezier(0.22,1,0.36,1)" : "none",
      }}
    >
      <motion.span
        ref={ref}
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute left-0 top-1/2 -mt-[0.6em] whitespace-nowrap leading-[1.2em]"
      >
        {words[i]}
      </motion.span>
    </span>
  );
}

/** Share of each cover picture's height that is empty margin at the top and bottom [top, bottom]. */
const COVER_AIR: Record<string, [number, number]> = {
  umgpt: [0.045, 0.036],
  lamp: [0.073, 0.062],
  perfume: [0.113, 0.027],
};

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
  const linkRef = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const mobile = useMobile();
  // Phones and tablets: covers stay still (no fan, spread, video, reveal or scale), as on dmcg.co. A real mouse gets the hover look at any width.
  const [hoveredRaw, setHovered] = useState(false);
  const fan = fanImages(project);
  // The one exception: the portrait paintings' fan rests open on phones and narrow windows.
  const heldOpen = mobile && fan.length > 0;
  const hovered = hoveredRaw; // drives the label and cursor
  const lively = (hoveredRaw && !mobile) || heldOpen; // drives the cover itself
  useLabelCursor(hovered);

  // Phones and tablets: every cover is scaled to fill about the same square (as on dmcg.co), so tall
  // posters, wide strips and phones all read as similarly sized. Uses CSS zoom so the layout follows.
  useLayoutEffect(() => {
    const el = linkRef.current;
    if (!el) return;
    if (!mobile) {
      el.style.zoom = "";
      el.style.removeProperty("--z");
      return;
    }
    const apply = () => {
      el.style.zoom = "1";
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const vw = window.innerWidth;
      const box = 0.9 * Math.min(vw - 32, 0.565 * vw + 131);
      if (w > 0 && h > 0) {
        let f = Math.min(box / w, box / h);
        // A held-open fan swings its cards out to about ±8°: keep that whole spread on screen.
        if (heldOpen) f = Math.min(f, (vw - 32) / (0.99 * w + 0.28 * h));
        el.style.zoom = String(f);
        el.style.setProperty("--z", String(f));
        // Some covers have empty margin built into the picture: pull the spacing in by that much so the
        // visible gap between neighbouring covers is the same for every project.
        const [t, b] = COVER_AIR[project.slug] ?? [0, 0];
        const sec = ref.current;
        if (sec) {
          // The open fan reaches a little above and (at its swung-out corners) below the cover: make room.
          // Sitting first on the page, the open fan would reach up into the top bar's veil: start it lower.
          sec.style.setProperty("--first-extra", heldOpen ? "44px" : "0px");
          sec.style.setProperty(
            "--air-t",
            `${(heldOpen ? -0.035 : t) * h * f}px`,
          );
          sec.style.setProperty(
            "--air-b",
            `${(heldOpen ? -0.06 : b) * h * f}px`,
          );
        }
      }
    };
    apply();
    window.addEventListener("resize", apply);
    const t = window.setTimeout(apply, 400);
    return () => {
      window.removeEventListener("resize", apply);
      window.clearTimeout(t);
    };
  }, [mobile, project.slug, heldOpen]);
  const spread = project.spread ?? [];

  // Between phone and desktop widths the page still scrolls under the top bar: a fanned cover that
  // sits first on the page starts lower so its hover fan isn't swallowed by the bar's white veil.
  useLayoutEffect(() => {
    if (mobile) return;
    ref.current?.style.setProperty(
      "--first-extra",
      compact && fan.length > 0 ? "56px" : "0px",
    );
    return () => {
      ref.current?.style.removeProperty("--first-extra");
    };
  }, [mobile, compact, fan.length]);

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
  const stops = compact
    ? [0, 0.12, 0.3, 0.7, 0.88, 1]
    : [0.1, 0.36, 0.36, 0.64, 0.64, 0.9];
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
      className="relative flex items-center justify-center px-[var(--edge)] py-9 first:pt-24 last-of-type:pb-32 max-[900.99px]:pb-[calc(60px-var(--air-b,0px))] max-[900.99px]:pt-[calc(60px-var(--air-t,0px))] max-[900.99px]:first:pt-[calc(96px+var(--first-extra,0px))] min-[901px]:max-[1023px]:first:pt-[calc(96px+var(--first-extra,0px))] max-[900.99px]:last-of-type:pb-32 lg:h-svh lg:snap-center lg:py-0 lg:first:pt-0 lg:last-of-type:pb-0"
    >
      <motion.div
        style={reduce ? undefined : { opacity, filter, scale }}
        className="relative"
      >
        <Link
          ref={linkRef}
          href={`/${base}/${project.slug}`}
          data-slug={project.slug}
          aria-label={`${project.short} — ${project.category}`}
          className="group relative block"
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse") return;
            // The skis only count as hovered when the pointer is on the skis, not the white around them.
            if (project.flip && !overSkis(e, e.currentTarget)) return;
            track(e, true);
            setHovered(true);
          }}
          onPointerMove={(e) => {
            if (project.flip && e.pointerType === "mouse") {
              const on = overSkis(e, e.currentTarget);
              if (on !== hoveredRaw) {
                if (on) track(e, true);
                setHovered(on);
              }
              if (!on) return;
            }
            track(e);
          }}
          onPointerLeave={() => setHovered(false)}
          onFocus={() =>
            (fan.length > 0 ||
              spread.length > 0 ||
              !!project.reveal ||
              !!project.fold ||
              !!project.wind ||
              !!project.flip) &&
            setHovered(true)
          }
          onBlur={() => setHovered(false)}
        >
          <div className="relative isolate">
            {fan.length > 0 && (
              <CoverFan
                images={fan}
                open={lively}
                reduce={reduce}
                tight={mobile}
              />
            )}
            {spread.length > 0 && (
              <PosterSpread pages={spread} open={lively} reduce={reduce} />
            )}
            <motion.div
              initial={false}
              animate={{
                rotate:
                  fan.length > 0 && lively ? (mobile ? FRONT_M : FRONT) : 0,
                x: spread.length > 0 && lively ? `-${SPREAD_GAP}%` : "0%",
              }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 190, damping: 20, mass: 0.8 }
              }
              style={{ transformOrigin: "50% 100%" }}
            >
              <div
                className={`${project.phone || project.containCover || project.reveal || project.fold || project.wind || project.flip ? "" : "shadow-[0_30px_70px_-34px_rgb(0_0_0/0.45)]"} ${spread.length > 0 ? "rounded-[2px]" : "rounded-md"} transition-transform duration-500 ease-out ${
                  fan.length > 0 ||
                  spread.length > 0 ||
                  project.video ||
                  project.hoverCover ||
                  project.reveal ||
                  project.fold ||
                  project.wind ||
                  project.flip
                    ? ""
                    : "min-[901px]:group-hover:scale-[1.018]"
                }`}
              >
                {project.flip ? (
                  <FlipCover
                    project={project}
                    hovered={lively}
                    reduce={reduce}
                  />
                ) : project.wind && project.cover ? (
                  <WindCover
                    project={project}
                    hovered={lively}
                    reduce={reduce}
                  />
                ) : project.fold && project.cover ? (
                  <FoldCover
                    project={project}
                    hovered={lively}
                    reduce={reduce}
                  />
                ) : project.reveal && project.cover ? (
                  <RevealCover
                    project={project}
                    hovered={lively}
                    reduce={reduce}
                  />
                ) : (
                  <Cover
                    project={project}
                    mode="showcase"
                    playing={hoveredRaw && !mobile}
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Mouse: title + category follow the cursor while hovering. */}
          <motion.span
            aria-hidden
            style={{ x: sx, y: sy, zoom: "calc(1 / var(--z, 1))" }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            className="label-hover glass-label pointer-events-none absolute left-0 top-0 z-10 h-[27px] items-center gap-1.5 whitespace-nowrap rounded-full bg-[rgb(243_243_243/0.3)] px-3 text-[length:var(--fs)] font-medium leading-none tracking-[0.02em] shadow-[inset_0_0_0_0.7px_rgb(0_0_0/0.06)] backdrop-blur-[10px]"
          >
            <LabelTitle title={project.title} />
            <CyclingWord words={projectWords(project)} active={hovered} />
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

function GridCard({
  project,
  base,
  playing,
  setPlaying,
}: {
  project: Project;
  base: string;
  playing: string | null;
  setPlaying: (slug: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  useLabelCursor(hovered);
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

  return (
    <Link
      href={`/${base}/${project.slug}`}
      data-slug={project.slug}
      aria-label={`${project.short} — ${project.category}`}
      className="group relative block"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        track(e, true);
        setHovered(true);
        setPlaying(project.slug);
      }}
      onPointerMove={(e) => track(e)}
      onPointerLeave={() => {
        setHovered(false);
        setPlaying(null);
      }}
    >
      <Cover project={project} mode="card" playing={playing === project.slug} />
      {/* Title + category follow the cursor while hovering, as in the scroll view. */}
      <motion.span
        aria-hidden
        style={{ x: sx, y: sy }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.18 }}
        className="glass-label pointer-events-none absolute left-0 top-0 z-10 inline-flex h-[27px] items-center gap-1.5 whitespace-nowrap rounded-full bg-[rgb(243_243_243/0.3)] px-3 text-[length:var(--fs)] font-medium leading-none tracking-[0.02em] shadow-[inset_0_0_0_0.7px_rgb(0_0_0/0.06)] backdrop-blur-[10px]"
      >
        <LabelTitle title={project.title} />
        <CyclingWord words={projectWords(project)} active={hovered} />
      </motion.span>
    </Link>
  );
}

function ProjectGrid({
  projects,
  base,
}: {
  projects: Project[];
  base: string;
}) {
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <div className="mx-auto max-w-[1280px] px-[clamp(24px,4.8vw,64px)] pb-24 pt-24">
      <div className="grid gap-x-4 gap-y-6 sm:gap-x-7 sm:gap-y-[30px] sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal
            key={project.slug}
            delay={(i % 3) * 0.08}
            className="relative hover:z-20"
          >
            <GridCard
              project={project}
              base={base}
              playing={playing}
              setPlaying={setPlaying}
            />
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
  const mobile = useMobile();
  const shown: View = mobile || !allowGrid ? "scroll" : view;

  const memKey = `showcase-return:${base}`;
  const pending = useRef<string | null>(null);

  // Remember the view in the address (#grid) so a reload or shared link keeps it.
  // Coming back from a project (its back link or the browser's back button) restores the
  // view and the project the visitor left from.
  useEffect(() => {
    let restore = false;
    let mem: { view?: View; slug?: string } = {};
    try {
      restore = sessionStorage.getItem(RESTORE_FLAG) === "1";
      sessionStorage.removeItem(RESTORE_FLAG);
      mem = JSON.parse(sessionStorage.getItem(memKey) ?? "{}");
    } catch {}
    if (restore && mem.slug) {
      pending.current = mem.slug;
      if (allowGrid && mem.view === "grid") setView("grid");
      else if (allowGrid && window.location.hash === "#grid") setView("grid");
      // Settle after the view has rendered.
      requestAnimationFrame(() => requestAnimationFrame(() => placeBack()));
    } else if (allowGrid && window.location.hash === "#grid") {
      setView("grid");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowGrid]);

  function placeBack() {
    const slug = pending.current;
    if (!slug) return;
    const el = document.querySelector<HTMLElement>(`[data-slug="${slug}"]`);
    if (!el) return;
    const root = document.documentElement;
    const snap = root.style.scrollSnapType;
    root.style.scrollSnapType = "none";
    el.scrollIntoView({
      block: "center",
      behavior: "instant" as ScrollBehavior,
    });
    root.style.scrollSnapType = snap;
    pending.current = null;
  }

  // The grid (or scroll) view appears one render after the choice, so place again then.
  useEffect(() => {
    if (!pending.current) return;
    requestAnimationFrame(() => requestAnimationFrame(() => placeBack()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  function remember(e: React.MouseEvent<HTMLElement>) {
    const a = (e.target as HTMLElement).closest<HTMLElement>("a[data-slug]");
    if (!a) return;
    try {
      sessionStorage.setItem(
        memKey,
        JSON.stringify({ view: shown, slug: a.dataset.slug }),
      );
    } catch {}
  }

  // Clicking the name (or the Projects tab) while already here returns to the Scroll view.
  useEffect(() => {
    const reset = () => {
      setView("scroll");
      window.scrollTo({ top: 0 });
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    };
    window.addEventListener("show-scroll-view", reset);
    return () => window.removeEventListener("show-scroll-view", reset);
  }, []);

  function choose(next: View) {
    if (next === view) return;
    setView(next);
    window.scrollTo({ top: 0 });
    const url =
      window.location.pathname +
      window.location.search +
      (next === "grid" ? "#grid" : "");
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
    <div onClickCapture={remember}>
      {shown === "scroll" ? (
        projects.map((project) => (
          <ShowcaseItem
            key={project.slug}
            project={project}
            compact={compact}
            base={base}
          />
        ))
      ) : (
        <ProjectGrid projects={projects} base={base} />
      )}

      {showBar && (
        <div
          className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 items-end veil-bottom px-[var(--edge)] pb-5 pt-12 min-[901px]:grid-cols-[1fr_auto_1fr] ${small}`}
        >
          <span>{site.footerRight}</span>
          {allowGrid ? (
            <div
              role="group"
              aria-label="View"
              className="pointer-events-auto hidden justify-center gap-9 min-[901px]:flex"
            >
              {(["scroll", "grid"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => choose(v)}
                  aria-pressed={shown === v}
                  className={`nav-btn py-1 capitalize transition-colors [--nb-inset:-2.5px_-10px] ${
                    shown === v ? "" : "text-muted hover:text-fg"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          ) : (
            <span aria-hidden />
          )}
          <span className="now-pill justify-self-end">
            <span className="now-pill-dot" aria-hidden="true" />
            <span>Available</span>
          </span>
        </div>
      )}
    </div>
  );
}
