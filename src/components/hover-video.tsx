"use client";

import { useEffect, useRef } from "react";

/**
 * A still that gives way to a muted video. Plays from the start while `active`,
 * fades back to the still (and rewinds) when not. `autoPlay` loops it for the project page.
 */
export function HoverVideo({
  webm,
  mp4,
  active,
  autoPlay = false,
  fit = "object-cover",
}: {
  webm: string;
  mp4: string;
  active: boolean;
  autoPlay?: boolean;
  fit?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const on = active || autoPlay;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (on) {
      v.play().catch(() => {});
      return;
    }
    // Let the fade-out finish before rewinding so there is no visible jump.
    const t = setTimeout(() => {
      v.pause();
      v.currentTime = 0;
    }, 600);
    return () => clearTimeout(t);
  }, [on]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${fit} transition-opacity duration-500 ease-out`}
      style={{ opacity: on ? 1 : 0 }}
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
