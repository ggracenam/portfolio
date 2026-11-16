"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { animate, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import type { Project } from "@/data/projects";

const H0 = 745; // stage height in px (the poster is drawn at this size, then scaled to fit)
const M = 16; // strips per side of the centre line

/**
 * A flat poster that lifts at its edges on hover, as if a breeze were blowing in from the side. The sheet is cut into
 * thin vertical strips hinged to each other (centre outwards), so it bends smoothly instead of tilting as one piece.
 * The curl grows toward the edges, the right edge (the windward side) lifts most, and a slow ripple runs through it.
 */
export function WindCover({ project, hovered, reduce, width }: { project: Project; hovered: boolean; reduce: boolean | null; width?: string }) {
  const img = project.cover!;
  const W0 = Math.round((img.w / img.h) * H0);
  const sw = W0 / 2 / M;
  const ratio = img.w / img.h;
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / W0);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [W0]);

  const lift = useMotionValue(0);
  const right = useRef<(HTMLDivElement | null)[]>([]);
  const left = useRef<(HTMLDivElement | null)[]>([]);
  const rightShade = useRef<(HTMLDivElement | null)[]>([]);
  const leftShade = useRef<(HTMLDivElement | null)[]>([]);
  const dirty = useRef(false);

  useLayoutEffect(() => {
    if (reduce) return;
    const c = animate(lift, hovered ? 1 : 0, hovered ? { type: "spring", stiffness: 36, damping: 9, mass: 1 } : { type: "spring", stiffness: 60, damping: 14 });
    return () => c.stop();
  }, [hovered, reduce, lift]);

  useAnimationFrame((time) => {
    const L = lift.get();
    if (L < 0.0005 && !dirty.current) return;
    dirty.current = L >= 0.0005;
    const t = time / 1000;
    const gust = 0.88 + 0.12 * Math.sin(t * 1.3);
    let cumR = 0;
    let cumL = 0;
    let rx = W0 / 2; // where the next strip's hinge sits on each side, after the bending so far
    let rz = 0;
    let lx = W0 / 2;
    let lz = 0;
    for (let j = 0; j < M; j++) {
      const u = (j + 0.5) / M;
      const ripple = 1 + 0.4 * Math.sin(t * 2.6 - u * 7) * L;
      const base = L * gust * u * u * ripple;
      cumR += -12.9 * base; // windward (right) edge lifts the most
      cumL += 0; // the other edge only stirs
      const ar = (cumR * Math.PI) / 180;
      const al = (cumL * Math.PI) / 180;
      const r = right.current[j];
      const l = left.current[j];
      if (r) r.style.transform = `translate3d(${rx - (W0 / 2 + j * sw)}px,0,${rz}px) rotateY(${cumR}deg)`;
      if (l) l.style.transform = `translate3d(${lx - (W0 / 2 - j * sw)}px,0,${lz}px) rotateY(${cumL}deg)`;
      rx += sw * Math.cos(ar);
      rz -= sw * Math.sin(ar);
      lx -= sw * Math.cos(al);
      lz += sw * Math.sin(al);
      const rs = rightShade.current[j];
      const ls = leftShade.current[j];
      if (rs) rs.style.opacity = String(Math.min(0.22, Math.abs(Math.sin(ar)) * 0.3));
      if (ls) ls.style.opacity = String(Math.min(0.22, Math.abs(Math.sin(al)) * 0.3));
    }
  });

  const strip = (side: "r" | "l", j: number) => {
    const x0 = side === "r" ? W0 / 2 + j * sw : W0 / 2 - (j + 1) * sw;
    const wd = sw + 1.4;
    const refs = side === "r" ? right : left;
    const shades = side === "r" ? rightShade : leftShade;
    return (
      <div
        key={`${side}${j}`}
        ref={(el) => { refs.current[j] = el; }}
        style={{
          position: "absolute",
          top: 0,
          left: x0 - 0,
          width: wd,
          height: H0,
          transformOrigin: side === "r" ? "0% 50%" : `${sw}px 50%`,
          backgroundImage: `url(${img.src})`,
          backgroundSize: `${W0}px ${H0}px`,
          backgroundPosition: `${-(x0 - 0)}px 0px`,
        }}
      >
        <div ref={(el) => { shades.current[j] = el; }} className="absolute inset-0 bg-black" style={{ opacity: 0 }} />
      </div>
    );
  };

  return (
    <div ref={boxRef} className="relative" style={{ aspectRatio: ratio, width: width ?? `min(82vw, clamp(560px, 32vw, 800px), calc(56svh * ${ratio}))` }}>
      <div
        className="absolute left-0 top-0"
        style={{ width: W0, height: H0, transform: `scale(${scale})`, transformOrigin: "0 0", filter: "drop-shadow(0 30px 24px rgb(0 0 0 / 0.16))" }}
      >
        <div className="absolute inset-0" style={{ perspective: W0 * 2.4, perspectiveOrigin: "50% 50%" }}>
          <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            {Array.from({ length: M }, (_, j) => strip("r", j))}
            {Array.from({ length: M }, (_, j) => strip("l", j))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** The same lifting poster, as the hero of a project page: it stirs when the pointer rests on it. */
export function WindHero({ project }: { project: Project }) {
  const hero = project.hero!;
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const ratio = hero.w / hero.h;
  return (
    <div
      className="mx-auto w-fit"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <WindCover
        project={{ ...project, cover: hero }}
        hovered={hovered}
        reduce={reduce}
        width={`min(${project.heroMax ?? 942}px, calc(100vw - 48px), calc(var(--fit-h) * ${ratio}))`}
      />
    </div>
  );
}
