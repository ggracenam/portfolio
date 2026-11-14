"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import type { Img, Project } from "@/data/projects";

type Pt = [number, number];

/** Homography (3x3, row-major) taking the 4 points in `s` onto the 4 points in `d`. */
function homography(s: Pt[], d: Pt[]): number[] {
  const A: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = s[i];
    const [u, v] = d[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 9; k++) A[r][k] -= f * A[c][k];
    }
  }
  return [...A.map((row, i) => row[8] / row[i]), 1];
}

/** CSS matrix3d for a homography (use with transform-origin: 0 0). */
function css(h: number[]) {
  return `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
}

const mix = (a: Pt[], b: Pt[], t: number): Pt[] => a.map((p, i) => [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t]);

const SHADOW = "0 24px 50px -22px";

/**
 * Infinite Machine style reveal. The tilted cover is a screenshot of a page; the flat "main" screenshot is laid
 * exactly over the top of it (project.reveal.onCover = where its corners sit on the cover). The rest of the
 * cover fades, the main page rotates flat and zooms into place, then two more pages slide out beside it.
 * Everything lives in a fixed stage the size of the cover image's pixels, scaled to fit.
 */
export function RevealCover({ project, hovered, reduce }: { project: Project; hovered: boolean; reduce: boolean | null }) {
  const reveal = project.reveal!;
  const cover = project.cover!;
  const SW = cover.w;
  const SH = cover.h;
  const main = reveal.main;
  const boxRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / SW);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [SW]);

  // Corner sets for the main page, in stage pixels: on the cover -> flat (rotated) -> final place.
  const { c0, c1, c2, src } = (() => {
    const w = main.w;
    const h = main.h;
    const src: Pt[] = [[0, 0], [w, 0], [w, h], [0, h]];
    const c0 = reveal.onCover;
    const cx = c0.reduce((a, p) => a + p[0], 0) / 4;
    const cy = c0.reduce((a, p) => a + p[1], 0) / 4;
    const topLen = Math.hypot(c0[1][0] - c0[0][0], c0[1][1] - c0[0][1]);
    const fw = topLen;
    const fh = (topLen * h) / w;
    const c1: Pt[] = [[cx - fw / 2, cy - fh / 2], [cx + fw / 2, cy - fh / 2], [cx + fw / 2, cy + fh / 2], [cx - fw / 2, cy + fh / 2]];
    const L = 0.05 * SW;
    const T = 0.27 * SH;
    const W2 = 0.54 * SW;
    const H2 = (W2 * h) / w;
    const c2: Pt[] = [[L, T], [L + W2, T], [L + W2, T + H2], [L, T + H2]];
    return { c0, c1, c2, src };
  })();

  const matrixAt = (p: number) => {
    const corners = p <= 1 ? mix(c0, c1, p) : mix(c1, c2, p - 1);
    return css(homography(src, corners));
  };

  const p = useMotionValue(0); // 0 = on the cover, 1 = flat, 2 = settled
  const pageOpacity = useMotionValue(0);
  const coverOpacity = useMotionValue(1);
  const shadowA = useMotionValue(0);
  const shadow = useMotionTemplate`${SHADOW} rgb(0 0 0 / ${shadowA}), inset 0 0 0 1px rgb(0 0 0 / ${shadowA})`;

  useLayoutEffect(() => {
    const el = pageRef.current;
    if (el) el.style.transform = matrixAt(p.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    return p.on("change", (v) => {
      const el = pageRef.current;
      if (el) el.style.transform = matrixAt(v);
      shadowA.set(Math.min(1, v) * 0.4);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Like dmcg.co: no reverse playback. On mouse-out everything fades and blurs away while the cover fades
  // back in; only then does the animation quietly reset to its start.
  const overlayOpacity = useMotionValue(1);
  const overlayBlur = useMotionValue(0);
  const overlayFilter = useMotionTemplate`blur(${overlayBlur}px)`;
  const [active, setActive] = useState(false);
  const running = useRef<AnimationPlaybackControls[]>([]);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);

  useEffect(() => {
    running.current.forEach((c) => c.stop());
    running.current = [];
    if (resetTimer.current) clearTimeout(resetTimer.current);
    if (first.current) {
      first.current = false;
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const go = (mv: typeof p, to: number, opts: any) => {
      if (reduce) {
        mv.set(to);
        return;
      }
      running.current.push(animate(mv, to, opts));
    };
    if (hovered) {
      setActive(true);
      go(overlayOpacity, 1, { duration: 0.15 });
      go(overlayBlur, 0, { duration: 0.15 });
      go(pageOpacity, 1, { duration: 0.12 });
      go(coverOpacity, 0, { duration: 0.35, delay: 0.1 });
      if (reduce) p.set(2);
      else
        running.current.push(
          animate(p, [p.get(), Math.max(p.get(), 1), 2], {
            duration: 1.15 * (1 - p.get() / 2),
            delay: 0.12,
            times: [0, 0.42, 1],
            ease: ["easeInOut", "easeOut"],
          }),
        );
    } else {
      const d = reduce ? 0 : 0.6;
      go(overlayOpacity, 0, { duration: d, ease: "easeOut" });
      go(overlayBlur, 14, { duration: d, ease: "easeOut" });
      go(coverOpacity, 1, { duration: d, ease: "easeOut" });
      resetTimer.current = setTimeout(
        () => {
          p.set(0);
          pageOpacity.set(0);
          overlayOpacity.set(1);
          overlayBlur.set(0);
          setActive(false);
        },
        reduce ? 0 : d * 1000 + 40,
      );
    }
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [hovered, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  const frame = (i: Img, alt?: string) => <Image src={i.src} alt={alt ?? ""} fill sizes="600px" className="object-cover" />;
  const sideShadow = "shadow-[0_24px_50px_-22px_rgb(0_0_0/0.4)] ring-1 ring-black/[0.06]";
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 150, damping: 20 };

  return (
    <div ref={boxRef} className="relative" style={{ aspectRatio: SW / SH, width: `min(90vw, clamp(620px, 40vw, 1000px), calc(70svh * ${SW / SH}))` }}>
      <div className="absolute left-0 top-0" style={{ width: SW, height: SH, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        {/* The tilted cover; its lower part fades away. */}
        <motion.div style={{ opacity: coverOpacity }} className="absolute inset-0">
          <Image src={cover.src} alt={cover.alt} fill sizes="800px" className="object-contain" />
        </motion.div>

        <motion.div style={{ opacity: overlayOpacity, filter: overlayFilter }} className="absolute inset-0">
        {/* Side page 1: up-right, behind the main page. */}
        <motion.div
          initial={false}
          animate={active ? { opacity: 1, scale: 1, x: "0%", y: "0%" } : { opacity: 0, scale: 0.82, x: "-38%", y: "70%" }}
          transition={active ? { ...spring, delay: 1.0 } : { duration: 0 }}
          style={{ left: "56%", top: "5%", width: "38%", aspectRatio: `${reveal.sides[0].w}/${reveal.sides[0].h}`, zIndex: 1 }}
          className={`pointer-events-none absolute overflow-hidden rounded-[10px] ${sideShadow}`}
        >
          {frame(reveal.sides[0])}
        </motion.div>

        {/* Main page: lies exactly on the cover, then turns flat and zooms into place. */}
        <motion.div
          ref={pageRef}
          style={{ opacity: pageOpacity, width: main.w, height: main.h, transformOrigin: "0 0", boxShadow: shadow, zIndex: 2 }}
          className="pointer-events-none absolute left-0 top-0 overflow-hidden rounded-[8px] will-change-transform"
        >
          {frame(main, "U-M GPT home page")}
        </motion.div>

        {/* Side page 2: down-right, in front. */}
        <motion.div
          initial={false}
          animate={active ? { opacity: 1, scale: 1, x: "0%", y: "0%" } : { opacity: 0, scale: 0.82, x: "-40%", y: "-70%" }}
          transition={active ? { ...spring, delay: 1.08 } : { duration: 0 }}
          style={{ left: "58%", top: "56%", width: "38%", aspectRatio: `${reveal.sides[1].w}/${reveal.sides[1].h}`, zIndex: 3 }}
          className={`pointer-events-none absolute overflow-hidden rounded-[10px] ${sideShadow}`}
        >
          {frame(reveal.sides[1])}
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
