"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/archive", label: "Studio" },
  { href: "/archive/gallery", label: "Gallery" },
  { href: "/archive/notebook", label: "Notebook" },
  { href: "/archive/misc", label: "Misc" },
];

/**
 * Bottom bar for the Archive section, laid out like dmcg.co's Catalog:
 * the sub-sections sit in the middle as pills, with the site's two lines either side.
 * Only the section's own pages show it, not the project detail pages.
 */
export function ArchiveBar() {
  const pathname = usePathname();
  const current = pathname.replace(/\/$/, "") || "/";
  const onSection = tabs.some((t) => t.href === current);
  if (!onSection) return null;

  return (
    <nav
      aria-label="Archive sections"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 grid grid-cols-1 items-end justify-items-center bg-gradient-to-t from-bg via-bg/70 to-transparent px-[var(--edge)] pb-5 pt-12 text-[length:var(--fs)] leading-[var(--lh)] min-[901px]:grid-cols-[1fr_auto_1fr]"
    >
      <span className="hidden justify-self-start min-[901px]:block">{site.footerLeft}</span>
      <div className="pointer-events-auto flex items-center gap-1">
        {tabs.map((t) => {
          const active = current === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md border px-2.5 py-1 transition-colors hover:border-line",
                active ? "border-line bg-pill" : "border-transparent",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <span className="hidden justify-self-end min-[901px]:block">{site.footerRight}</span>
    </nav>
  );
}
