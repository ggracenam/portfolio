"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";

const social = [
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "Resume", href: site.links.resume },
  { label: "Pinterest", href: site.links.pinterest },
];

export function SiteFooter() {
  const pathname = usePathname();
  const current = pathname.replace(/\/$/, "") || "/";
  // Don't link a page to itself.
  const showStory = current !== "/about";
  const showContact = current !== "/contact";

  return (
    <footer className="mt-24 border-t border-line pb-8 pt-16 md:mt-32">
      {(showStory || showContact) && (
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-14 px-4 text-center">
          {showStory && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-muted">My Story</p>
              <Link
                href="/about"
                className="text-[clamp(22px,3.4vw,40px)] leading-[1.05] tracking-[-0.03em] underline decoration-line decoration-1 underline-offset-[6px] transition-colors hover:decoration-fg"
              >
                Learn more about me.
              </Link>
            </div>
          )}

          {showContact && (
            <div className="flex flex-col items-center gap-5">
              <p className="text-muted">Contact</p>
              <p className="text-[clamp(28px,5vw,60px)] leading-[1.02] tracking-[-0.035em]">
                Let’s start creating together
              </p>
              <Link
                href="/contact"
                className="rounded-xl border border-line bg-pill px-4 py-2 transition-colors hover:border-fg"
              >
                Let’s talk
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="mx-auto mt-20 flex max-w-[1100px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 text-[13px] text-muted">
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
