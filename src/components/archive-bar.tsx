"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";

const tabs = [
  { href: "/archive/studio", label: "Studio" },
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
  // /archive itself is the Notebook.
  const here = current === "/archive" ? "/archive/notebook" : current;
  const onSection = tabs.some((t) => t.href === here);
  if (!onSection) return null;

  return (
    <nav
      aria-label="Archive sections"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 grid grid-cols-1 items-end justify-items-center bg-gradient-to-t from-bg via-bg/70 to-transparent px-[var(--edge)] pb-5 pt-12 text-[length:var(--fs)] leading-[var(--lh)] min-[901px]:grid-cols-[1fr_auto_1fr]"
    >
      <span className="hidden justify-self-start min-[901px]:block">{site.footerRight}</span>
      <div className="pointer-events-auto flex items-center gap-9">
        {tabs.map((t) => {
          const active = here === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className="nav-btn py-1 [--nb-inset:-2.5px_-10px]"
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <span className="now-pill hidden justify-self-end min-[901px]:flex">
        <span className="now-pill-dot" aria-hidden="true" />
        <span>Available</span>
      </span>
    </nav>
  );
}
