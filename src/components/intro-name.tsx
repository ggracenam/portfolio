"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * First-visit intro: the Korean name, drawn by hand, breaks into ink specks that scatter and
 * swirl, then pull together into the English name; the page then fades up underneath.
 * Plays once per browser session, on the home page only. Click, tap or any key skips it.
 */

const KEY = "intro-seen";
// Seconds. Hold Korean → break apart → drift → assemble → settle on the real handwriting → turn into the header name in place → slide up to the header → fade out.
const T_HOLD = 0.3;
const T_SCATTER = 0.55;
const T_DRIFT = 0.1;
const T_ASSEMBLE = 0.9;
const T_SETTLE = 0.2;
const T_REST = 0.1;
const T_TEXT = 0.7; // the English writing turns into "You Rim Nam", right where it is
const T_TEXT_HOLD = 0.1;
const T_SLIDE = 0.6; // then the text slides up to the header
const T_LAND = 0.1;
const T_FADE = 0.4;

const ease = {
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  clamp: (t: number) => Math.min(1, Math.max(0, t)),
};

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = src;
  });
}

/** Pre-matched points: pieces of the Korean writing paired, point for point, with pieces of the English. */
async function loadMorph() {
  const buf = await (await fetch("/intro/morph.bin")).arrayBuffer();
  const P = new DataView(buf).getUint16(0, true);
  const counts = new Uint32Array(buf.slice(2, 2 + 4 * P));
  const pts = new Uint16Array(buf.slice(2 + 4 * P));
  const start = new Uint32Array(P + 1);
  for (let i = 0; i < P; i++) start[i + 1] = start[i] + counts[i];
  const N = start[P];
  const Ax = new Float32Array(N), Ay = new Float32Array(N), Bx = new Float32Array(N), By = new Float32Array(N);
  for (let k = 0; k < N; k++) {
    Ax[k] = pts[k * 4];
    Ay[k] = pts[k * 4 + 1];
    Bx[k] = pts[k * 4 + 2];
    By[k] = pts[k * 4 + 3];
  }
  return { P, start, N, Ax, Ay, Bx, By };
}

/** Pair two equal-size point sets one-to-one so neighbours go to neighbours (recursive median cuts). */
function pairPoints(ax: Float32Array, ay: Float32Array, bx: Float32Array, by: Float32Array) {
  const n = ax.length;
  const outA: number[] = [];
  const outB: number[] = [];
  const longer = (idx: number[], x: Float32Array, y: Float32Array) => {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const i of idx) {
      if (x[i] < x0) x0 = x[i];
      if (x[i] > x1) x1 = x[i];
      if (y[i] < y0) y0 = y[i];
      if (y[i] > y1) y1 = y[i];
    }
    return x1 - x0 >= y1 - y0 ? x : y;
  };
  const rec = (pa: number[], pb: number[]) => {
    const ka = longer(pa, ax, ay);
    const kb = longer(pb, bx, by);
    pa.sort((p, q) => ka[p] - ka[q]);
    pb.sort((p, q) => kb[p] - kb[q]);
    if (pa.length <= 12) {
      for (let i = 0; i < pa.length; i++) {
        outA.push(pa[i]);
        outB.push(pb[i]);
      }
      return;
    }
    const h = pa.length >> 1;
    rec(pa.slice(0, h), pb.slice(0, h));
    rec(pa.slice(h), pb.slice(h));
  };
  rec(Array.from({ length: n }, (_, i) => i), Array.from({ length: n }, (_, i) => i));
  return { a: outA, b: outB };
}

/** The header's name: its words, font, colour and where it sits on screen. */
async function headerName() {
  const el = document.querySelector<HTMLElement>("[data-site-name]");
  const label = el?.textContent?.trim();
  if (!el || !label) return null;
  try {
    await document.fonts.ready;
  } catch {}
  const cs = getComputedStyle(el);
  const range = document.createRange();
  range.selectNodeContents(el);
  const r = range.getBoundingClientRect();
  if (r.width < 4 || r.height < 4) return null;
  const ls = parseFloat(cs.letterSpacing);
  return {
    label,
    weight: cs.fontWeight,
    family: cs.fontFamily,
    size: parseFloat(cs.fontSize),
    spacing: Number.isNaN(ls) ? 0 : ls,
    color: cs.color,
    cx: r.left + r.width / 2,
    cy: r.top + r.height / 2,
    w: r.width,
  };
}

export function IntroName() {
  const pathname = usePathname();
  const home = pathname === "/";
  // Start covered (so the page never flashes before the intro), then decide on the client.
  const [state, setState] = useState<"cover" | "play" | "fade" | "done">(home ? "cover" : "done");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useRef<HTMLCanvasElement>(null); // the writing as it changes shape (smoothed like wet ink)
  const finish = useRef<() => void>(() => {});

  useEffect(() => {
    if (!home) {
      setState("done");
      return;
    }
    // Visiting /?intro always plays it (for checking it), whatever was seen or set before.
    const force = new URLSearchParams(window.location.search).has("intro");
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!force && (seen || reduce)) {
      setState("done");
      return;
    }
    let raf = 0;
    let dead = false;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const end = () => {
      if (dead) return;
      dead = true;
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = prevOverflow;
      setState("fade");
      window.setTimeout(() => setState("done"), T_FADE * 1000 + 50);
    };
    finish.current = end;

    (async () => {
      let kor: HTMLImageElement, eng: HTMLImageElement;
      let morph: Awaited<ReturnType<typeof loadMorph>>;
      try {
        [kor, eng] = await Promise.all([loadImage("/intro/name-kor.png"), loadImage("/intro/name-eng.png")]);
        morph = await loadMorph();
      } catch {
        end();
        return;
      }
      if (dead) return;
      // Mark as seen only once it is really playing (a dev-mode double run must not cancel it).
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      const cv = canvasRef.current!;
      const ctx = cv.getContext("2d")!;
      const cvInk = inkRef.current!;
      const ctxInk = cvInk.getContext("2d")!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const IW = eng.naturalWidth;
      const IH = eng.naturalHeight;

      let W = 0,
        H = 0,
        S = 1,
        ox = 0,
        oy = 0;
      const layout = () => {
        W = window.innerWidth;
        H = window.innerHeight;
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
        cvInk.width = cv.width;
        cvInk.height = cv.height;
        // The English name spans a modest part of the width; the Korean sits centred at its own, smaller, size.
        S = Math.min(W * (W < 700 ? 0.68 : 0.4), 640) / IW;
        ox = (W - IW * S) / 2;
        oy = (H - IH * S) / 2;
      };
      layout();
      window.addEventListener("resize", layout);

      const { P: NC, start: first, Ax, Ay, Bx, By } = morph;
      const rand = rng(7);
      // Each piece: where it starts, where it ends, where it tumbles to in between.
      const cKx = new Float32Array(NC), cKy = new Float32Array(NC), cEx = new Float32Array(NC), cEy = new Float32Array(NC);
      const cSx = new Float32Array(NC), cSy = new Float32Array(NC), cRot = new Float32Array(NC);
      const cDelay = new Float32Array(NC), cPh = new Float32Array(NC);
      for (let c = 0; c < NC; c++) {
        const n = first[c + 1] - first[c];
        let ax = 0, ay = 0, bx = 0, by = 0;
        for (let k = first[c]; k < first[c + 1]; k++) {
          ax += Ax[k];
          ay += Ay[k];
          bx += Bx[k];
          by += By[k];
        }
        cKx[c] = ax / n;
        cKy[c] = ay / n;
        cEx[c] = bx / n;
        cEy[c] = by / n;
        // Tumble spots spread over the stage, in a ring-ish scatter so pieces rarely pile up.
        const ang = (c / NC) * Math.PI * 2 * 2.3 + rand() * 1.2;
        const rad = 0.45 + rand() * 0.55;
        cSx[c] = IW / 2 + Math.cos(ang) * rad * IW * 0.36;
        cSy[c] = IH / 2 + Math.sin(ang) * rad * IH * 1.15;
        cRot[c] = (rand() < 0.5 ? -1 : 1) * (1.2 + rand() * 2.2);
        cDelay[c] = (cEx[c] / IW) * 0.5 + rand() * 0.1;
        cPh[c] = rand() * Math.PI * 2;
      }

      // The header's name, to turn the handwriting into and then slide up to.
      const head = await headerName();
      if (dead) return;
      // Big, centred on the handwriting, the text is about half as wide as the handwriting.
      const ecx = ox + (IW * S) / 2;
      const ecy = oy + IH * S * 0.5;
      const bigK = head ? Math.min((IW * S * 0.5) / head.w, 7) : 1;
      // The name as ink points, big and centred on the handwriting; each handwriting point is paired with one.
      const nPts = Bx.length;
      let ink: { ex: Float32Array; ey: Float32Array; gx: Float32Array; gy: Float32Array } | null = null;
      if (head) {
        const SS = 3;
        const c = document.createElement("canvas");
        c.width = Math.ceil(head.w * bigK * SS) + 40;
        c.height = Math.ceil(head.size * bigK * 1.6 * SS) + 40;
        const g = c.getContext("2d", { willReadFrequently: true })!;
        g.font = `${head.weight} ${head.size * bigK * SS}px ${head.family}`;
        if ("letterSpacing" in g) (g as unknown as { letterSpacing: string }).letterSpacing = `${head.spacing * bigK * SS}px`;
        g.textAlign = "center";
        g.fillStyle = "#000";
        const m = g.measureText(head.label);
        const asc = m.fontBoundingBoxAscent ?? head.size * bigK * SS * 0.8;
        const desc = m.fontBoundingBoxDescent ?? head.size * bigK * SS * 0.2;
        g.fillText(head.label, c.width / 2, c.height / 2 + (asc - desc) / 2);
        const d = g.getImageData(0, 0, c.width, c.height).data;
        const px: number[] = [];
        for (let i = 3, q = 0; i < d.length; i += 4, q++) if (d[i] > 100) px.push(q);
        if (px.length) {
          const bxs = new Float32Array(nPts), bys = new Float32Array(nPts);
          const gxs = new Float32Array(nPts), gys = new Float32Array(nPts);
          for (let k = 0; k < nPts; k++) {
            bxs[k] = ox + Bx[k] * S;
            bys[k] = oy + By[k] * S;
            const q = px[Math.floor(rand() * px.length)];
            gxs[k] = ecx + ((q % c.width) + rand() - c.width / 2) / SS;
            gys[k] = ecy + (Math.floor(q / c.width) + rand() - c.height / 2) / SS;
          }
          const pr = pairPoints(bxs, bys, gxs, gys);
          ink = { ex: new Float32Array(nPts), ey: new Float32Array(nPts), gx: new Float32Array(nPts), gy: new Float32Array(nPts) };
          for (let k = 0; k < nPts; k++) {
            ink.ex[k] = bxs[pr.a[k]];
            ink.ey[k] = bys[pr.a[k]];
            ink.gx[k] = gxs[pr.b[k]];
            ink.gy[k] = gys[pr.b[k]];
          }
        }
      }
      const drawName = (cx: number, cy: number, k: number, alpha: number) => {
        if (!head || alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = head.color;
        ctx.font = `${head.weight} ${head.size * k}px ${head.family}`;
        if ("letterSpacing" in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${head.spacing * k}px`;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        const m = ctx.measureText(head.label);
        const asc = m.fontBoundingBoxAscent ?? head.size * k * 0.8;
        const desc = m.fontBoundingBoxDescent ?? head.size * k * 0.2;
        ctx.fillText(head.label, cx, cy + (asc - desc) / 2);
        ctx.restore();
      };
      const tHeadStart = T_HOLD + T_SCATTER + T_DRIFT + T_ASSEMBLE + T_SETTLE + T_REST;
      const tSlideStart = tHeadStart + T_TEXT + T_TEXT_HOLD;
      const tEnd = head ? tSlideStart + T_SLIDE + T_LAND : tHeadStart + 0.1;

      const dot = 3.3; // speck size, in image pixels
      const start = performance.now();
      let ended = false;

      const frame = (now: number) => {
        if (dead) return;
        const t = (now - start) / 1000;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        ctxInk.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctxInk.clearRect(0, 0, W, H);

        const tMove = t - T_HOLD; // the writing starts to come apart
        const tAsm = tMove - T_SCATTER - T_DRIFT; // and starts to come together
        const tSettle = tAsm - T_ASSEMBLE;

        // Crisp handwriting at either end.
        const korA = 1 - ease.clamp(tMove / 0.2);
        const tHead = t - tHeadStart; // the English writing turns into the header name
        const engA = ease.clamp(tSettle / T_SETTLE) * (head && tHead > 0 ? 0 : 1);
        if (korA > 0) {
          ctx.globalAlpha = korA;
          ctx.drawImage(kor, ox, oy, IW * S, IH * S);
        }
        if (engA > 0) {
          ctx.globalAlpha = engA;
          ctx.drawImage(eng, ox, oy, IW * S, IH * S);
        }

        // The writing itself, in motion: pieces of the Korean tumble about and reshape into the English.
        if (tMove > 0 && tSettle < T_SETTLE) {
          const inA = ease.clamp(tMove / 0.2);
          const outA = 1 - ease.clamp(tSettle / (T_SETTLE * 0.7));
          ctx.globalAlpha = inA * outA;
          ctx.fillStyle = "#0c0c0c";
          const ds = dot * S;
          // One progress for the pieces' travel, one for how far each has reshaped.
          for (let c = 0; c < NC; c++) {
            const out = ease.outCubic(ease.clamp(tMove / T_SCATTER));
            const back = ease.inOutCubic(
              ease.clamp((tAsm / T_ASSEMBLE - cDelay[c] * 0.55) / (1 - 0.55 * 0.62)),
            );
            const flight = ease.clamp((tMove - 0.15) / (T_SCATTER + T_DRIFT + T_ASSEMBLE - 0.15));
            const shape = ease.inOutCubic(flight); // fragment shape: Korean → English
            // Where the piece's centre is: out to its tumble spot (drifting a little), then home.
            const bob = Math.sin(t * 1.4 + cPh[c]) * 12 * out * (1 - back);
            const bob2 = Math.cos(t * 1.1 + cPh[c] * 1.3) * 8 * out * (1 - back);
            const mx = cKx[c] + (cSx[c] - cKx[c]) * out;
            const my = cKy[c] + (cSy[c] - cKy[c]) * out;
            const px = mx + (cEx[c] - mx) * back + bob;
            const py = my + (cEy[c] - my) * back + bob2;
            // Pieces turn as they go and straighten out as they land.
            const rot = cRot[c] * out * (1 - back);
            const cs = Math.cos(rot);
            const sn = Math.sin(rot);
            for (let k = first[c]; k < first[c + 1]; k++) {
              const dx = (Ax[k] - cKx[c]) * (1 - shape) + (Bx[k] - cEx[c]) * shape;
              const dy = (Ay[k] - cKy[c]) * (1 - shape) + (By[k] - cEy[c]) * shape;
              const x = px + dx * cs - dy * sn;
              const y = py + dx * sn + dy * cs;
              ctx.fillRect(ox + x * S - ds / 2, oy + y * S - ds / 2, ds, ds);
            }
          }
        }
        // The handwriting itself reshapes into "You Rim Nam", right where it is (no fade: every bit of ink
        // slides to its place in the letters, joined up like wet ink); the text then slides up to the header.
        if (head && tHead > 0) {
          const q = ease.inOutCubic(ease.clamp(tHead / T_TEXT));
          const slide = ease.inOutCubic(ease.clamp((t - tSlideStart) / T_SLIDE));
          if (ink && q < 1) {
            ctxInk.fillStyle = "#0c0c0c";
            ctxInk.globalAlpha = 1 - ease.clamp((q - 0.9) / 0.1);
            const ds = dot * S + (1.5 - dot * S) * q;
            for (let k = 0; k < nPts; k++) {
              const x = ink.ex[k] + (ink.gx[k] - ink.ex[k]) * q;
              const y = ink.ey[k] + (ink.gy[k] - ink.ey[k]) * q;
              ctxInk.fillRect(x - ds / 2, y - ds / 2, ds, ds);
            }
          } else if (!ink && q < 1) {
            ctx.globalAlpha = 1 - q;
            ctx.drawImage(eng, ox, oy, IW * S, IH * S);
          }
          // Once it has taken the letters' shape, the real text is there, and slides up.
          drawName(
            ecx + (head.cx - ecx) * slide,
            ecy + (head.cy - ecy) * slide,
            bigK + (1 - bigK) * slide,
            ink ? ease.clamp((q - 0.9) / 0.1) : ease.clamp((q - 0.25) / 0.6),
          );
        }
        ctx.globalAlpha = 1;

        if (t >= tEnd && !ended) {
          ended = true;
          end();
          return;
        }
        raf = requestAnimationFrame(frame);
      };
      setState("play");
      raf = requestAnimationFrame(frame);

      return () => window.removeEventListener("resize", layout);
    })();

    const skip = () => finish.current();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [home]);

  if (state === "done") return null;
  return (
    <div
      aria-hidden
      className="intro-cover fixed inset-0 z-[300] bg-white"
      style={{
        opacity: state === "fade" ? 0 : 1,
        transition: state === "fade" ? `opacity ${T_FADE}s cubic-bezier(0.4, 0, 0.2, 1)` : undefined,
        pointerEvents: state === "fade" ? "none" : "auto",
      }}
    >
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id="intro-ink" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="1.3" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -6.5" />
          </filter>
        </defs>
      </svg>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={inkRef} className="absolute inset-0 h-full w-full" style={{ filter: "url(#intro-ink)" }} />
      <noscript>
        <style>{`.intro-cover{display:none}`}</style>
      </noscript>
    </div>
  );
}
