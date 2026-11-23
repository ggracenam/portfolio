"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Project } from "@/data/projects";

const TILT = -19; // degrees the skis lie across the frame

/** Alpha silhouette of the skis, read once, so the hover only reacts to the skis themselves. */
let mask: { w: number; h: number; a: Uint8ClampedArray } | null = null;
let loading = false;
function loadMask(src: string) {
  if (mask || loading) return;
  loading = true;
  const img = new window.Image();
  img.onload = () => {
    const w = 600;
    const h = Math.max(
      1,
      Math.round((img.naturalHeight * w) / img.naturalWidth),
    );
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true });
    if (!g) return;
    g.drawImage(img, 0, 0, w, h);
    const d = g.getImageData(0, 0, w, h).data;
    const a = new Uint8ClampedArray(w * h);
    for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3];
    mask = { w, h, a };
  };
  img.src = src;
}

/** True when the pointer is over the skis (not the white around them). `root` is the element holding the cover. */
export function overSkis(
  e: { clientX: number; clientY: number },
  root: HTMLElement,
): boolean {
  const el = root.querySelector<HTMLElement>("[data-skis]");
  if (!el) return true;
  loadMask(el.dataset.skis!);
  if (!mask) return false;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  const tilt =
    parseFloat(getComputedStyle(el).getPropertyValue("--tilt")) || TILT;
  const rad = (-tilt * Math.PI) / 180;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  const lx = dx * Math.cos(rad) - dy * Math.sin(rad);
  const ly = dx * Math.sin(rad) + dy * Math.cos(rad);
  const u = lx / w + 0.5;
  const v = ly / h + 0.5;
  const px = u * mask.w;
  const py = v * mask.h;
  // A few pixels of slack so thin edges are easy to land on.
  for (let oy = -3; oy <= 3; oy += 3)
    for (let ox = -3; ox <= 3; ox += 3) {
      const x = Math.round(px + ox);
      const y = Math.round(py + oy);
      if (
        x >= 0 &&
        y >= 0 &&
        x < mask.w &&
        y < mask.h &&
        mask.a[y * mask.w + x] > 40
      )
        return true;
    }
  return false;
}

/**
 * A pair of skis lying diagonally on the page with a faint wash of blue spreading out beneath them.
 * On hover the skis stay put and the blue underneath deepens.
 */
export function FlipCover({
  project,
  hovered,
  reduce,
}: {
  project: Project;
  hovered: boolean;
  reduce: boolean | null;
}) {
  const flip = project.flip!;
  const ratio = flip.front.w / flip.front.h;
  const sizes = "(min-width: 768px) 1000px, 90vw";
  const t = reduce
    ? { duration: 0 }
    : { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="relative aspect-[var(--fr)] w-[var(--fw)] [--fr:2.7] [--fw:min(90vw,calc(1.4*clamp(560px,32vw,800px)),calc(56svh*2.7))] [--tilt:-19deg] max-[900.99px]:[--fr:0.6] max-[900.99px]:[--fw:min(60vw,calc(56svh*0.6))] max-[900.99px]:[--tilt:74deg]">
      <div
        className="absolute left-1/2 top-1/2 [--sw:98%] max-[900.99px]:[--sw:calc(var(--fw)/0.6)]"
        data-skis={flip.front.src}
        style={{
          width: "var(--sw)",
          aspectRatio: ratio,
          transform: "translate(-50%, -50%) rotate(var(--tilt))",
        }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          animate={{
            opacity: hovered ? 0.5 : 0.3,
            scale: hovered ? 1.04 : 1.015,
          }}
          transition={t}
          style={{ filter: "blur(26px)", translate: "0 5%" }}
        >
          <Image
            src={flip.glow.src}
            alt=""
            fill
            sizes={sizes}
            className="object-fill"
          />
        </motion.div>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: hovered ? 0.42 : 0.22 }}
          transition={t}
          style={{ filter: "blur(9px)", translate: "0 7%" }}
        >
          <Image
            src={flip.glow.src}
            alt=""
            fill
            sizes={sizes}
            className="object-fill"
          />
        </motion.div>
        <Image
          src={flip.front.src}
          alt={flip.front.alt}
          fill
          sizes={sizes}
          className="object-fill"
        />
      </div>
    </div>
  );
}
