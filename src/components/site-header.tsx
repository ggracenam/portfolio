"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ContactPill, useCopy } from "@/components/contact-pill";
import { openAbout } from "@/components/about-overlay";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const right = [
  { href: "/", label: "Projects" },
  { href: "/archive", label: "Archive" },
];

/** Tell the Projects page to go back to its default (Scroll) view. */
function showScrollView() {
  window.dispatchEvent(new Event("show-scroll-view"));
}

function NavLink({
  href,
  label,
  onClick,
  className,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const current = pathname.replace(/\/$/, "") || "/";
  const active =
    href === "/"
      ? current === "/" || current.startsWith("/projects")
      : current === href || current.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (href === "/about") {
          // About opens over the current page instead of replacing it.
          e.preventDefault();
          openAbout();
        }
        if (href === "/") showScrollView();
        onClick?.();
      }}
      aria-current={active ? "page" : undefined}
      className={cn("nav-btn block py-1.5", className)}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Lock page scroll and allow Escape to close while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="site-header pointer-events-none fixed inset-x-0 top-0 z-50">
        {/* soft fade so content slides under the bar */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-x-0 top-0 h-28 veil-top transition-opacity duration-300",
            open && "max-[900.99px]:opacity-0",
          )}
        />
        <div className="pointer-events-auto relative grid grid-cols-[1fr_auto_1fr] items-start px-[var(--edge)] py-5">
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 min-[901px]:flex"
          >
            <NavLink href="/about" label="About" />
            <ContactPill email={site.email} />
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="-ml-[2px] -mt-1 grid size-11 place-items-center justify-self-start min-[901px]:hidden"
          >
            {/* Three lines and a cross swap with a small blur and scale, as on dmcg.co. */}
            <svg
              aria-hidden
              viewBox="0 0 24 17"
              className={cn(
                "col-start-1 row-start-1 h-[17px] w-6 transition-[opacity,filter,scale] duration-300",
                open && "scale-[0.8] opacity-0 blur-[4px]",
              )}
              style={{
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
              }}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
            >
              <path d="M0 .75h24M0 8.5h24M0 16.25h24" />
            </svg>
            <svg
              aria-hidden
              viewBox="0 0 30 30"
              className={cn(
                "col-start-1 row-start-1 size-[30px] transition-[opacity,filter,scale] duration-300",
                !open && "scale-[0.8] opacity-0 blur-[4px]",
              )}
              style={{
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
              }}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            >
              <path d="M5.5 5.5l19 19M24.5 5.5l-19 19" />
            </svg>
          </button>

          <Link
            href="/"
            data-site-name
            onClick={() => {
              showScrollView();
              setOpen(false);
            }}
            className="py-1.5 text-center max-[900.99px]:mt-[9px] max-[900.99px]:py-0"
          >
            {site.name}
          </Link>

          <div className="flex items-center justify-end gap-7">
            <nav
              aria-label="Secondary"
              className="hidden items-center gap-7 min-[901px]:flex"
            >
              {right.map((l) => (
                <NavLink key={l.href} {...l} />
              ))}
            </nav>
          </div>
        </div>
      </header>

      <MobileMenu open={open} close={() => setOpen(false)} />
    </>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;
const rows = [
  { href: "/", label: "Projects" },
  { href: "/archive", label: "Archive" },
];

/** Phone / tablet menu: a frosted tray under the title, with the page blurring away beneath it (as on dmcg.co). */
function MobileMenu({ open, close }: { open: boolean; close: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const panel = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(300);
  const [leaving, setLeaving] = useState(false);
  const { copied, copy } = useCopy(site.email);
  useLayoutEffect(() => {
    if (!open || !panel.current) return;
    const el = panel.current;
    const measure = () => setH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  // Navigating closes the menu.
  useEffect(() => {
    setLeaving(false);
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const item = (i: number) => ({
    initial: { opacity: 0, filter: "blur(8px)", y: -4 },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.5, delay: 0.06 + i * 0.05, ease: EASE },
    },
    exit: {
      opacity: 0,
      filter: "blur(8px)",
      y: -4,
      transition: { duration: 0.2 },
    },
  });
  const row = "menu-label";
  const here = pathname.replace(/\/$/, "") || "/";
  const isActive = (href: string) =>
    href === "/"
      ? here === "/" || here.startsWith("/projects")
      : here.startsWith(href);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          className="fixed inset-0 z-[48] min-[901px]:hidden"
          exit={{ pointerEvents: "none" }}
        >
          {/* One light blur over the whole page (two cheap layers instead of four heavy masked ones). */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[rgb(128_128_128/0.08)] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4, ease: EASE } }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: EASE } }}
          />

          <AnimatePresence>
            {!leaving && (
              <>
                {/* Tap outside the tray to close. */}
                <div
                  key="catch"
                  className="absolute inset-0"
                  onClick={close}
                  aria-hidden
                />
                <motion.div
                  key="tray"
                  className="absolute inset-x-2 top-2 overflow-hidden bg-white/85 backdrop-blur-[14px] [border-radius:calc(12.16px*var(--sq))] [corner-shape:superellipse(2)]"
                  style={{ height: h, transformOrigin: "50% 0" }}
                  initial={{ opacity: 0, scale: 0.98, y: -6 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { duration: 0.55, delay: 0.1, ease: EASE },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.98,
                    y: -6,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                >
                  <div
                    ref={panel}
                    className="px-[max(26px,calc(50%-210px))] pb-[27px] pt-[73px] text-fg"
                  >
                    <ul className="m-0 list-none p-0">
                      {rows.map((l, i) => (
                        <motion.li
                          key={l.href}
                          {...item(i)}
                          className="border-b border-black/10 first:border-t"
                        >
                          <Link
                            href={l.href}
                            onClick={(e) => {
                              if (l.href === "/") showScrollView();
                              // The tray melts away but the page stays blurred; the new page then sharpens
                              // out of that blur (as on dmcg.co).
                              if (
                                here !== (l.href === "/" ? "/" : l.href) &&
                                !e.metaKey &&
                                !e.ctrlKey
                              ) {
                                e.preventDefault();
                                setLeaving(true);
                                window.setTimeout(() => {
                                  const root = document.documentElement;
                                  root.dataset.menuNav = "1";
                                  router.push(l.href);
                                  window.setTimeout(() => {
                                    delete root.dataset.menuNav;
                                  }, 1200);
                                }, 300);
                              } else close();
                            }}
                            className="flex h-10 w-full items-center justify-center active:opacity-50"
                          >
                            <span
                              className={row}
                              data-current={isActive(l.href) || undefined}
                            >
                              {l.label}
                            </span>
                          </Link>
                        </motion.li>
                      ))}
                      <motion.li
                        {...item(2)}
                        className="border-b border-black/10"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            close();
                            window.setTimeout(openAbout, 120);
                          }}
                          className="flex h-10 w-full items-center justify-center active:opacity-50"
                        >
                          <span
                            className={row}
                            data-current={here === "/about" || undefined}
                          >
                            About
                          </span>
                        </button>
                      </motion.li>
                      <motion.li
                        {...item(3)}
                        className="border-b border-black/10"
                      >
                        <button
                          type="button"
                          onClick={copy}
                          aria-label={`Contact: copy ${site.email}`}
                          className="relative flex h-10 w-full items-center justify-center active:opacity-50"
                        >
                          {/* The word gives way to a small frosted pill showing the address that was copied (as on dmcg.co). */}
                          <motion.span
                            className={row}
                            animate={
                              copied
                                ? { opacity: 0, filter: "blur(3px)" }
                                : { opacity: 1, filter: "blur(0px)" }
                            }
                            transition={{ duration: 0.2 }}
                          >
                            Contact
                          </motion.span>
                          <AnimatePresence>
                            {copied && (
                              <motion.span
                                key="pill"
                                role="status"
                                className="sq pointer-events-none absolute left-1/2 top-1/2 flex h-[calc(16px+1.3572em)] w-max -translate-x-1/2 -translate-y-1/2 items-baseline overflow-hidden whitespace-nowrap rounded-[1.2024em] bg-[rgb(243_243_243/0.3)] pt-[0.6786em] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)] backdrop-blur-[10px] text-[length:var(--fs)] leading-4"
                                style={{ transformOrigin: "50% 50%" }}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                  transition: {
                                    opacity: {
                                      duration: 0.18,
                                      ease: "easeOut",
                                    },
                                    scale: { duration: 0.45, ease: EASE },
                                  },
                                }}
                                exit={{
                                  opacity: 0,
                                  scale: 0.85,
                                  transition: { duration: 0.25, ease: EASE },
                                }}
                              >
                                <motion.span
                                  className="flex items-baseline gap-[0.4821em] pl-[0.9643em] pr-[0.875em]"
                                  initial={{ opacity: 0, filter: "blur(3px)" }}
                                  animate={{
                                    opacity: 1,
                                    filter: "blur(0px)",
                                    transition: {
                                      duration: 0.36,
                                      delay: 0.14,
                                      ease: EASE,
                                    },
                                  }}
                                  exit={{
                                    opacity: 0,
                                    filter: "blur(3px)",
                                    transition: { duration: 0.15 },
                                  }}
                                >
                                  <span className="tracking-[0.02em]">
                                    {site.email}
                                  </span>
                                  <span className="text-[0.7143em] tracking-[0.02em] text-black/40">
                                    Copied ✓
                                  </span>
                                </motion.span>
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </motion.li>
                    </ul>
                    <motion.div
                      {...item(4)}
                      className="mt-5 grid grid-cols-[1fr_auto] items-center"
                    >
                      <a
                        href={site.links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="justify-self-start"
                      >
                        LinkedIn
                      </a>
                      <span className="now-pill justify-self-end">
                        <span className="now-pill-dot" aria-hidden="true" />
                        <span>Available</span>
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
