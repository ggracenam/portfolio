"use client";

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
import type { Project } from "@/data/projects";
import { site } from "@/data/site";

const small = "text-[length:var(--fs)] leading-[var(--lh)]";
const pill =
  "items-baseline gap-2 whitespace-nowrap rounded-xl border border-line bg-pill px-3 py-1.5 text-[length:var(--fs-cap)] leading-[16px] backdrop-blur-md";

function Intro() {
  return (
    <>
      {site.intro.map((line) => (
        <span key={line} className="mb-2 block last:mb-0">
          {line}
        </span>
      ))}
    </>
  );
}

function ShowcaseItem({ project, first }: { project: Project; first: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

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
  const opacity = useTransform(scrollYProgress, [0.1, 0.36, 0.64, 0.9], [0, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0.1, 0.36, 0.64, 0.9], [26, 0, 0, 26]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.9, 1, 0.9]);

  return (
    <section
      ref={ref}
      aria-label={project.title}
      className="relative flex h-svh snap-center items-center justify-center px-[var(--edge)]"
    >
      {/* On small screens the intro sits above the first project. */}
      {first && (
        <p className={`absolute inset-x-[var(--edge)] top-24 text-center lg:hidden ${small}`}>
          <Intro />
        </p>
      )}

      <motion.div
        style={reduce ? undefined : { opacity, filter, scale }}
        className="relative"
      >
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`${project.short} — ${project.category}`}
          className="group relative block"
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse") return;
            track(e, true);
            setHovered(true);
          }}
          onPointerMove={(e) => track(e)}
          onPointerLeave={() => setHovered(false)}
        >
          <div className="rounded-md shadow-[0_30px_70px_-34px_rgb(0_0_0/0.45)] transition-transform duration-500 ease-out group-hover:scale-[1.018]">
            <Cover project={project} mode="showcase" />
          </div>

          {/* Mouse: title + category follow the cursor while hovering. */}
          <motion.span
            aria-hidden
            style={{ x: sx, y: sy }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            className={`label-hover pointer-events-none absolute left-0 top-0 z-10 ${pill}`}
          >
            <span>{project.short}</span>
            <span className="text-muted">{project.category}</span>
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

export function Showcase({ projects }: { projects: Project[] }) {
  const { scrollYProgress } = useScroll();
  // The fixed text fades out as the footer comes into view.
  const fade = useTransform(scrollYProgress, [0.9, 0.97], [1, 0]);

  // Gentle snapping so each project settles in the middle of the screen.
  useEffect(() => {
    const root = document.documentElement;
    root.style.scrollSnapType = "y proximity";
    return () => {
      root.style.scrollSnapType = "";
    };
  }, []);

  return (
    <div>
      {/* Intro text on the side (large screens). */}
      <motion.p
        style={{ opacity: fade }}
        className={`pointer-events-none fixed left-[var(--edge)] top-1/2 z-30 hidden w-[200px] -translate-y-1/2 lg:block xl:w-[240px] ${small}`}
      >
        <Intro />
      </motion.p>

      {projects.map((project, i) => (
        <ShowcaseItem key={project.slug} project={project} first={i === 0} />
      ))}

      <motion.div
        style={{ opacity: fade }}
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-end justify-between bg-gradient-to-t from-bg via-bg/70 to-transparent px-[var(--edge)] pb-5 pt-12 ${small}`}
      >
        <span>{site.footerLeft}</span>
        <span>{site.footerRight}</span>
      </motion.div>
    </div>
  );
}
