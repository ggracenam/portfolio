"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const left = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
const right = [
  { href: "/work", label: "Work" },
  { href: "/misc", label: "Misc" },
];

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
  const active = current === href || current.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={onClick}
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
        <div className="pointer-events-auto relative grid grid-cols-[1fr_auto_1fr] items-start px-4 py-3.5 text-[14px]">
          <nav aria-label="Primary" className="-ml-2.5 hidden items-center gap-1 md:flex">
            {left.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-8 place-items-center justify-self-start md:hidden"
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
            onClick={() => setOpen(false)}
            className="text-center leading-[1.15] tracking-[0.04em]"
          >
            You Rim Nam
            <br />
            Product &amp; UX
            <br />
            Designer
          </Link>

          <div className="-mr-2 flex items-center justify-end gap-1">
            <nav aria-label="Secondary" className="hidden items-center gap-1 md:flex">
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
            className="fixed inset-0 z-[45] flex flex-col justify-center gap-2 bg-bg px-6 md:hidden"
          >
            {[...left, ...right].map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i + 0.05, duration: 0.4 }}
              >
                <NavLink
                  {...l}
                  onClick={() => setOpen(false)}
                  className="-ml-3 inline-block text-[44px] leading-none tracking-[-0.03em]"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
