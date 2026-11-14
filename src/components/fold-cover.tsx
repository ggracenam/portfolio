"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, useTransform, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import type { Img, Project } from "@/data/projects";

const D2R = Math.PI / 180;

/** One face of a panel: the printed side, hidden when seen from behind, with a fold shadow on top. */
function Face({ img, back, shade }: { img: Img; back?: boolean; shade: MotionValue<number> }) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        inset: -0.4,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
      }}
    >
      <Image src={img.src} alt="" fill sizes="300px" className="object-cover" />
      <motion.div style={{ opacity: shade }} className="absolute inset-0 bg-black" />
    </div>
  );
}

/**
 * A four-panel brochure that folds on hover: the two outer panels fold back behind the cover spread (showing
 * their printed backs as they turn), then the spread folds in half along the gutter so the cover becomes a square.
 * On mouse-out it fades and blurs back to the flat brochure (like the other covers), then resets.
 */
export function FoldCover({ project, hovered, reduce }: { project: Project; hovered: boolean; reduce: boolean | null }) {
  const fold = project.fold!;
  const still = project.cover!;
  const S = still.h; // one square panel, in stage pixels
  const SW = S * 4;
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / SW);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [SW]);

  const f1 = useMotionValue(0); // outer panels fold back behind the cover
  const f2 = useMotionValue(0); // the cover spread folds in half
  const flip = useMotionValue(0); // the whole sheet turns over to its other side
  const groupOpacity = useMotionValue(0);
  const stillOpacity = useMotionValue(1);
  const blur = useMotionValue(0);
  const DROP = "drop-shadow(0 26px 26px rgb(0 0 0 / 0.22))";
  const filter = useMotionTemplate`blur(${blur}px) ${DROP}`;
  const stillFilter = DROP;

  const thA = useTransform(f1, (v) => -180 * v);
  const thD = useTransform(f1, (v) => 180 * v);
  const thB = useTransform(f2, (v) => -180 * v);
  const turn = useTransform(flip, (v) => 180 * v);
  const shadeOf = (m: MotionValue<number>) => useTransform(m, (v) => Math.abs(Math.sin(v * D2R)) * 0.22); // eslint-disable-line react-hooks/rules-of-hooks
  const shA = shadeOf(thA);
  const shD = shadeOf(thD);
  const shB = shadeOf(thB);
  const none = useMotionValue(0);
  // A sits behind B before B flips and (in B's flipped frame) still behind it afterwards.
  const zA = useTransform(f2, (v) => -1.5 + 3 * v);
  const grow = useTransform(f2, (v) => 1 + 0.4 * v);
  // Keeps the visible shape centred: the single square when folded, the full spread when open.
  const shift = useTransform(f2, (v) => -(S / 2) * (1 + 0.4 * v) * v);

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
    const go = (mv: MotionValue<number>, to: number, opts: any) => {
      if (reduce) mv.set(to);
      else running.current.push(animate(mv, to, opts));
    };
    const ease = [0.45, 0, 0.2, 1];
    if (hovered) {
      let lead = 0;
      if (groupOpacity.get() === 0) {
        // The flat group is pixel-identical to the still, so the swap is invisible.
        groupOpacity.set(1);
        stillOpacity.set(0);
        blur.set(0);
      } else {
        // Caught mid-fade: come back to the flat brochure, then play from the start.
        go(groupOpacity, 1, { duration: 0.15 });
        go(stillOpacity, 0, { duration: 0.15 });
        go(blur, 0, { duration: 0.15 });
        [f1, f2, flip].forEach((m) => go(m, 0, { duration: 0.35, ease }));
        lead = 0.4;
      }
      // Fold the outer panels back, fold the spread in half, then reverse those folds while the
      // whole sheet turns over, so it opens out flat on its other side. [time in s, value]
      const TOTAL = 6.8;
      const track = (mv: MotionValue<number>, pts: [number, number][]) => {
        if (reduce) {
          mv.set(pts[pts.length - 1][1]);
          return;
        }
        const keys = [0, ...pts.map((p) => p[1])];
        const times = [0, ...pts.map((p) => p[0] / TOTAL)];
        const eases = pts.map((p, i) => ((i === 0 ? 0 : pts[i - 1][1]) === p[1] ? "linear" : ease));
        running.current.push(animate(mv, keys, { duration: TOTAL, delay: lead, times, ease: eases } as never));
      };
      track(f1, [[1.5, 1], [5.1, 1], [6.8, 0]]);
      track(f2, [[1.3, 0], [2.8, 1], [3.6, 1], [4.7, 0], [6.8, 0]]);
      track(flip, [[5.1, 0], [6.8, 1]]);
    } else {
      const d = reduce ? 0 : 0.6;
      go(groupOpacity, 0, { duration: d, ease: "easeOut" });
      go(blur, 14, { duration: d, ease: "easeOut" });
      go(stillOpacity, 1, { duration: d, ease: "easeOut" });
      resetTimer.current = setTimeout(() => {
        [f1, f2, flip].forEach((m) => m.set(0));
        blur.set(0);
      }, reduce ? 0 : d * 1000 + 40);
    }
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [hovered, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  const [A, B, C, Dd] = fold.front;
  const [ba, bb, bc, bd] = fold.back; // the back view reads right-to-left, so it maps in reverse
  const flat = { transformStyle: "preserve-3d" as const };

  return (
    <div ref={boxRef} className="relative" style={{ aspectRatio: 4, width: "min(90vw, clamp(640px, 50vw, 1000px))" }}>
      <div className="absolute left-0 top-0" style={{ width: SW, height: S, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        {/* The flat brochure at rest. */}
        <motion.div style={{ opacity: stillOpacity, filter: stillFilter }} className="absolute inset-0">
          <Image src={still.src} alt={still.alt} fill sizes="1000px" className="object-cover" />
        </motion.div>

        {/* The folding brochure. */}
        <motion.div style={{ opacity: groupOpacity, filter }} className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0" style={{ perspective: S * 3.6, perspectiveOrigin: "50% 50%", transformStyle: "preserve-3d" }}>
            {/* Turns the whole sheet over about the middle of the stage. */}
            <motion.div className="absolute" style={{ left: S * 2, top: 0, width: 0, height: S, rotateY: turn, transformOrigin: "0px 50%", ...flat }}>
              <motion.div
                className="absolute"
                style={{ left: 0, top: 0, width: 0, height: S, x: shift, scale: grow, transformOrigin: "0px 50%", ...flat }}
              >
                {/* C: the right half of the cover; the other panels hinge off it. */}
                <div className="absolute" style={{ left: 0, top: 0, width: S, height: S, ...flat }}>
                  <Face img={C} shade={none} />
                  <Face img={bb} back shade={none} />

                  {/* D: folds back behind C. */}
                  <motion.div className="absolute" style={{ left: S, top: 0, width: S, height: S, transformOrigin: "0% 50%", rotateY: thD, z: -1.5, ...flat }}>
                    <Face img={Dd} shade={shD} />
                    <Face img={ba} back shade={shD} />
                  </motion.div>

                  {/* B: the left half of the cover; folds back along the gutter, carrying A. */}
                  <motion.div className="absolute" style={{ left: -S, top: 0, width: S, height: S, transformOrigin: "100% 50%", rotateY: thB, z: -3, ...flat }}>
                    <Face img={B} shade={shB} />
                    <Face img={bc} back shade={shB} />

                    {/* A: folds back behind B first. */}
                    <motion.div className="absolute" style={{ left: -S, top: 0, width: S, height: S, transformOrigin: "100% 50%", rotateY: thA, z: zA, ...flat }}>
                      <Face img={A} shade={shA} />
                      <Face img={bd} back shade={shA} />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
