"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { Cover } from "@/components/cover";
import type { Project } from "@/data/projects";
import { site } from "@/data/site";

function ShowcaseItem({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Each project blurs and fades in as it reaches the middle of the screen,
  // and back out as it leaves.
  const opacity = useTransform(scrollYProgress, [0.1, 0.36, 0.64, 0.9], [0, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0.1, 0.36, 0.64, 0.9], [26, 0, 0, 26]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.9, 1, 0.9]);
  const labelOpacity = useTransform(scrollYProgress, [0.3, 0.42, 0.58, 0.7], [0, 1, 1, 0]);
  const labelX = useTransform(scrollYProgress, [0.3, 0.45], [-14, 0]);

  return (
    <section
      ref={ref}
      aria-label={project.title}
      className="flex h-svh snap-center items-center justify-center px-4"
    >
      <motion.div
        style={reduce ? undefined : { opacity, filter, scale }}
        className="relative"
      >
        <Link
          href={`/work/${project.slug}`}
          aria-label={`${project.short} — ${project.category}`}
          className="group block"
        >
          <div className="rounded-md shadow-[0_30px_70px_-34px_rgb(0_0_0/0.45)] transition-transform duration-500 ease-out group-hover:scale-[1.018]">
            <Cover project={project} mode="showcase" />
          </div>
        </Link>

        <motion.div
          style={reduce ? undefined : { opacity: labelOpacity, x: labelX }}
          className="pointer-events-none absolute left-1/2 top-full mt-5 -translate-x-1/2 md:left-auto md:right-full md:top-1/2 md:mr-5 md:mt-0 md:-translate-y-1/2 md:translate-x-0"
        >
          <span className="inline-flex items-baseline gap-2 whitespace-nowrap rounded-xl border border-line bg-pill px-3.5 py-2 text-[15px] backdrop-blur-md">
            <span>{project.short}</span>
            <span className="text-muted">{project.category}</span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function Showcase({ projects }: { projects: Project[] }) {
  const { scrollYProgress } = useScroll();
  // The fixed tagline bar fades out as the footer comes into view.
  const tagOpacity = useTransform(scrollYProgress, [0.9, 0.97], [1, 0]);

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
      <section className="flex h-svh snap-center flex-col items-center justify-center px-6 text-center">
        <TextEffect
          as="h1"
          per="word"
          preset="fade-in-blur"
          speedReveal={1.3}
          delay={0.15}
          className="max-w-[22ch] text-[clamp(26px,4.2vw,54px)] leading-[1.06] tracking-[-0.035em]"
        >
          {site.tagline}
        </TextEffect>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-10 text-muted"
        >
          Selected work ↓
        </motion.p>
      </section>

      {projects.map((project) => (
        <ShowcaseItem key={project.slug} project={project} />
      ))}

      <motion.div
        style={{ opacity: tagOpacity }}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-end justify-between bg-gradient-to-t from-bg via-bg/70 to-transparent px-4 pb-4 pt-12 text-[14px]"
      >
        <span>UX &amp; graphic design</span>
        <span>
          University of Michigan
          <span className="hidden sm:inline">, Ann Arbor</span>
        </span>
      </motion.div>
    </div>
  );
}
