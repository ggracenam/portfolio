"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/** Copies `text` to the clipboard; `copied` is true for ~1.8s afterwards. */
export function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      // Older browsers / non-secure pages: fall back to a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {}
      document.body.removeChild(ta);
    }
    if (!ok) {
      window.location.href = `mailto:${text}`;
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  }, [text]);

  return { copied, copy };
}

/**
 * Header "Contact": hover (or keyboard focus) reveals the email in a pill beside it.
 * Clicking either one copies the email and the pill says "Copied ✓".
 */
export function ContactPill({ email }: { email: string }) {
  const { copied, copy } = useCopy(email);
  const [hover, setHover] = useState(false);
  const open = hover || copied;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <button
        type="button"
        onClick={copy}
        aria-label={`Contact: copy ${email}`}
        className="rounded-md border border-transparent px-2.5 py-1.5 transition-colors hover:border-line"
      >
        Contact
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            key="pill"
            initial={{ opacity: 0, x: -6, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -6, filter: "blur(6px)" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-full top-0 pl-1"
          >
            <button
              type="button"
              onClick={copy}
              tabIndex={-1}
              aria-hidden="true"
              className="flex items-baseline gap-2 whitespace-nowrap rounded-xl border border-line bg-pill px-3 py-1.5 backdrop-blur-md"
            >
              <span>{email}</span>
              <span className="text-[length:var(--fs-cap)] text-muted">{copied ? "Copied ✓" : "Copy"}</span>
            </button>
          </motion.span>
        )}
      </AnimatePresence>

      <span role="status" className="sr-only">
        {copied ? "Email copied" : ""}
      </span>
    </span>
  );
}

/** Contact entry for the mobile menu (no hover on phones: tap to copy). */
export function MobileContact({ email }: { email: string }) {
  const { copied, copy } = useCopy(email);
  return (
    <div className="-ml-3 flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={copy}
        className="rounded-md px-3 py-1.5 text-[22px] leading-none"
      >
        Contact
      </button>
      <span className="pl-3 text-[length:var(--fs)] text-muted" role="status">
        {copied ? "Copied ✓" : `${email} · tap to copy`}
      </span>
    </div>
  );
}
