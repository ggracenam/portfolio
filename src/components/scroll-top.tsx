"use client";

import { useEffect, useLayoutEffect } from "react";

/** Always opens a project page at the top, whatever the list or browser history had scrolled to. */
export function ScrollTop() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
  }, []);
  useEffect(() => {
    // The router can restore an older scroll position a moment after mounting, so check again briefly.
    const ids = [0, 60, 200, 500].map((ms) => window.setTimeout(() => { if (window.scrollY > 0 && !touched) window.scrollTo(0, 0); }, ms));
    let touched = false;
    const stop = () => { touched = true; };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    return () => {
      ids.forEach(clearTimeout);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, []);
  return null;
}
