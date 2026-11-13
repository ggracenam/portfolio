"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";

const social = [
  { label: "LinkedIn", href: site.links.linkedin },
];

const link =
  "underline decoration-line decoration-1 underline-offset-[5px] transition-colors hover:decoration-fg";

export function SiteFooter() {
  const pathname = usePathname();
  const current = pathname.replace(/\/$/, "") || "/";
  // Home and the whole Archive section have a fixed bottom bar instead of a footer.
  if (current === "/" || current.startsWith("/archive")) return null;

  // Don't link a page to itself.
  const showStory = current !== "/about";
  const showContact = current !== "/contact" && current !== "/about";

  return (
    <footer className="mt-24 border-t border-line pb-6 pt-14 md:mt-32">
      {(showStory || showContact) && (
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8 px-[var(--edge)] text-center">
          {showStory && (
            <p>
              <span className="text-muted">My story </span>
              <Link href="/about" className={link}>
                Learn more about me
              </Link>
            </p>
          )}
          {showContact && (
            <p>
              <span className="text-muted">Let’s start creating together </span>
              <Link href="/contact" className={link}>
                Let’s talk
              </Link>
            </p>
          )}
        </div>
      )}

      <div className="mx-auto mt-16 flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-[var(--edge)] text-[length:var(--fs-cap)] text-muted">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <nav aria-label="Social" className="flex gap-5">
          {social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-fg"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
