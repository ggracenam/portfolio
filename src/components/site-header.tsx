"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ContactPill, MobileContact } from "@/components/contact-pill";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const right = [
  { href: "/", label: "Projects" },
  { href: "/studio", label: "Studio" },
  { href: "/misc", label: "Misc" },
];
const menu = [{ href: "/about", label: "About" }, ...right];

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
      onClick={() => {
        if (href === "/") showScrollView();
        onClick?.();
      }}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md border px-2.5 py-1.5 transition-colors hover:border-line",
        active ? "border-line bg-pill" : "border-transparent",
        className,
      )}
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
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        {/* soft fade so content slides under the bar */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-bg via-bg/70 to-transparent"
        />
        <div className="pointer-events-auto relative grid grid-cols-[1fr_auto_1fr] items-start px-[var(--edge)] py-5">
          <nav aria-label="Primary" className="-ml-2.5 hidden items-center gap-1 min-[901px]:flex">
            <NavLink href="/about" label="About" />
            <ContactPill email={site.email} />
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-8 place-items-center justify-self-start min-[901px]:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute inset-x-0 h-px bg-fg transition-all duration-300",
                  open ? "top-1/2 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 h-px bg-fg transition-all duration-300",
                  open ? "top-1/2 -rotate-45" : "bottom-0",
                )}
              />
            </span>
          </button>

          <Link
            href="/"
            onClick={() => {
              showScrollView();
              setOpen(false);
            }}
            className="py-1.5 text-center"
          >
            {site.name}
          </Link>

          <div className="-mr-2 flex items-center justify-end gap-1">
            <nav aria-label="Secondary" className="hidden items-center gap-1 min-[901px]:flex">
              {right.map((l) => (
                <NavLink key={l.href} {...l} />
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[45] flex flex-col justify-center gap-2 bg-bg px-[var(--edge)] min-[901px]:hidden"
          >
            {menu.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i + 0.05, duration: 0.4 }}
              >
                <NavLink
                  {...l}
                  onClick={() => setOpen(false)}
                  className="-ml-3 inline-block text-[22px] leading-none"
                />
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * menu.length + 0.05, duration: 0.4 }}
            >
              <MobileContact email={site.email} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
