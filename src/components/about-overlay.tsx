"use client";

import Link from "next/link";
import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

const link =
  "underline decoration-line decoration-1 underline-offset-[5px] transition-colors hover:decoration-fg";
const h = "font-semibold";
const body = "mt-2 space-y-[22px]";

/** Set when About was opened from inside the site (so closing can simply go back). */
let pushed = false;

export function openAbout() {
  if (window.location.pathname.replace(/\/$/, "") === "/about") return;
  pushed = true;
  window.history.pushState(null, "", "/about");
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * About, as dmcg.co does it: the page you were on stays put underneath, dissolves into a soft
 * blur, and the text settles in over it. The URL is /about, but nothing is navigated away from.
 */
export function AboutOverlay() {
  const pathname = usePathname();
  const router = useRouter();
  const open = pathname.replace(/\/$/, "") === "/about";

  const close = useCallback(() => {
    if (pushed) {
      pushed = false;
      window.history.back();
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (!open) {
      pushed = false;
      return;
    }
    const main = document.querySelector("main");
    main?.setAttribute("inert", "");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      main?.removeAttribute("inert");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="about"
          role="dialog"
          aria-label="About"
          className="fixed inset-0 z-40"
          initial={false}
          exit={{ pointerEvents: "none" }}
        >
          {/* The page beneath melts into a soft blur. */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(48px)" }}
            exit={{
              backdropFilter: "blur(0px)",
              transition: { duration: 0.45, ease: "easeOut" },
            }}
            transition={{ duration: 0.95, ease: EASE }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-[rgb(255_255_255/0.6)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeOut" } }}
            transition={{ duration: 0.95, ease: EASE }}
          />

          <div
            className="absolute inset-0 overflow-y-auto overscroll-contain [scrollbar-width:thin]"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div
              className="mx-auto flex min-h-full w-[min(490px,100%)] max-[900.99px]:w-[min(522px,100%)] items-start px-0 pb-16 pt-[98px] max-[900.99px]:pt-[104px]"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) close();
              }}
            >
              <motion.div
                className="w-full px-[max(24px,46px)] max-[900.99px]:px-10"
                initial={{ opacity: 0, scale: 0.99, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.25, ease: "easeOut" } }}
                transition={{ delay: 0.25, duration: 0.85, ease: EASE }}
              >
                <AboutContent />
              </motion.div>
            </div>
          </div>

          <motion.button
            type="button"
            aria-label="Close"
            onClick={close}
            className="about-close max-[900.99px]:!hidden min-[901px]:left-[calc(50%+252px)] min-[901px]:right-auto min-[901px]:top-[92px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AboutContent() {
  return (
    <>
      <div className="space-y-[22px]">
        <p>
          Hi, I’m You Rim, I also go by Grace! I’m a curious designer that started my journey from
          fine art to the digital world of graphic design and also UI/UX. As someone who loves to
          take{" "}
          <Link href="/archive/gallery" className={link}>
            photos
          </Link>
          , does{" "}
          <Link href="/archive/notebook" className={link}>
            illustrations
          </Link>{" "}
          as a side hobby, and is my family and friends’s personal stylist, I see myself as a
          creative director.
        </p>
        <p>
          As someone who lived in England, Korea, and the United States, I have a very
          multicultural background.
        </p>
        <p>
          My main source of inspiration comes from my travels and artistic endeavours. I get
          inspired by even the smallest and the most specific things, like how silverware cutleries
          next to the window reflect light.
        </p>
      </div>

      <section className="mt-14">
        <h2 className={h}>Education</h2>
        <div className={body}>
          <p>
            Dual degree at the University of Michigan, Ann Arbor: User Experience Research &amp;
            Design at the School of Information, and Visual Design at the Stamps School of Art &amp;
            Design.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className={h}>Interests</h2>
        <div className={body}>
          <p>
            Design, AI, fashion, music, editorials, art history, new technologies, and photography.
            Anything vintage. I love to visit{" "}
            <Link href="/archive/misc/exhibitions" className={link}>
              art exhibitions
            </Link>{" "}
            too.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className={h}>Languages</h2>
        <div className={body}>
          <p>English, Korean, French B2, and a bit of Spanish :)</p>
        </div>
      </section>
    </>
  );
}
