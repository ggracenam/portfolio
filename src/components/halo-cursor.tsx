"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/** Tell the halo cursor whether a hover label is currently acting as the cursor. */
export function useLabelCursor(on: boolean) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("label-cursor", { detail: on }));
    return () => {
      if (on) window.dispatchEvent(new CustomEvent("label-cursor", { detail: false }));
    };
  }, [on]);
}

/**
 * A soft ring of warm light that replaces the mouse cursor.
 * Only on devices with a real mouse (any window width). It fades out while a project's hover label is the cursor, and back in when the pointer leaves.
 */
export function HaloCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false); // a real mouse is present
  const [label, setLabel] = useState(false); // a hover label is acting as the cursor
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false); // over something clickable
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: reduce ? 4000 : 520, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: reduce ? 4000 : 520, damping: 40, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    const onLabel = (e: Event) => setLabel(!!(e as CustomEvent).detail);
    window.addEventListener("label-cursor", onLabel);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("label-cursor", onLabel);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-halo");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as Element | null;
      setActive(!!t?.closest?.("a, button, [role='button'], summary, label, input, textarea"));
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);
    const dn = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, [enabled, x, y]);

  useEffect(() => () => document.documentElement.classList.remove("has-halo"), []);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[100]"
    >
      <motion.div
        animate={{
          opacity: visible && !label ? 1 : 0,
          scale: down ? 0.82 : active ? 1.45 : 1,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28, opacity: { duration: 0.4, ease: "easeInOut" } }}
        className="halo -ml-[42px] -mt-[42px] size-[84px] rounded-full"
      />
    </motion.div>
  );
}
