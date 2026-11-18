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
 * Header "Contact" (as on dmcg.co): hovering outlines the button; clicking copies the email and a
 * small frosted pill grows out beside it saying "Copied ✓". It stays while you hover it.
 */
export function ContactPill({ email }: { email: string }) {
  const { copied, copy } = useCopy(email);
  const [hover, setHover] = useState(false);
  const open = copied || hover;

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={copy}
        data-open={open ? "" : undefined}
        aria-label={`Contact: copy ${email}`}
        className="nav-btn py-1.5"
      >
        Contact
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            key="pill"
            className="absolute top-[-0.5px] left-[calc(100%+18px)] z-10"
            style={{ transformOrigin: "17.5px 50%" }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {/* bridge so the pointer can travel from the button to the pill */}
            <span aria-hidden className="absolute inset-y-0 -left-5 w-5" />
            <button
              type="button"
              onClick={copy}
              tabIndex={-1}
              aria-hidden="true"
              className="sq flex h-[35px] cursor-pointer items-center whitespace-nowrap rounded-[16.8px] bg-[rgb(243_243_243/0.3)] pl-[13.5px] pr-[12.25px] tracking-[0.02em] shadow-[inset_0_0_0_1px_var(--line)] backdrop-blur-[10px]"
            >
              <motion.span
                className="flex items-baseline gap-[6.75px]"
                initial={{ opacity: 0, x: -5, filter: "blur(3px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.06, duration: 0.3, ease: "easeOut" }}
              >
                <span>{email}</span>
                <span className="inline-flex items-baseline text-[10px] text-fg/40">
                  {copied ? (
                    <>
                      Copied
                      <svg
                        width="9.4"
                        height="6.7"
                        viewBox="0 0 9.4 6.7"
                        fill="none"
                        aria-hidden
                        className="relative -top-px ml-1"
                      >
                        <path d="M1 3.4l2.5 2.4L8.4 1" stroke="currentColor" strokeWidth="1.1" />
                      </svg>
                    </>
                  ) : (
                    "Copy"
                  )}
                </span>
              </motion.span>
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
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={copy}
        className="nav-btn text-[22px] leading-none [--nb-inset:-6px_-10px]"
      >
        Contact
      </button>
      <span className="text-[length:var(--fs)] text-muted" role="status">
        {copied ? "Copied ✓" : `${email} · tap to copy`}
      </span>
    </div>
  );
}
