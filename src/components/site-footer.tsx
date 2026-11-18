"use client";

import { usePathname } from "next/navigation";
import { useCopy } from "@/components/contact-pill";
import { site } from "@/data/site";

export function SiteFooter() {
  const pathname = usePathname();
  const { copied, copy } = useCopy(site.email);
  const current = pathname.replace(/\/$/, "") || "/";
  // Home and the whole Archive section have a fixed bottom bar instead of a footer.
  if (current === "/" || current.startsWith("/archive")) return null;

  return (
    // Measured from dmcg.co: 14px / 22px text whatever the screen width, 0.04em spacing. Wide screens put the links
    // on the left, the name in the middle and the place on the right; narrow ones centre one under the other.
    <footer className="mt-24 px-4 pb-[34px] pt-10 text-[14px] leading-[22px] min-[901px]:mt-32 min-[901px]:px-[34px] min-[901px]:pb-[23px]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 justify-items-center gap-y-[18px] text-center min-[901px]:max-w-none min-[901px]:grid-cols-[1fr_auto_1fr] min-[901px]:items-end min-[901px]:gap-y-0">
        <span className="leading-4 min-[901px]:col-start-2 min-[901px]:row-start-1">{site.name}</span>
        <nav
          aria-label="Social"
          className="flex items-baseline gap-x-[1em] min-[901px]:col-start-1 min-[901px]:row-start-1 min-[901px]:justify-self-start min-[901px]:gap-x-2"
        >
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-muted"
          >
            LinkedIn
          </a>
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy email address ${site.email}`}
            className="transition-colors hover:text-muted"
          >
            {copied ? "Copied ✓" : "Email"}
          </button>
        </nav>
        <span className="mt-[11px] min-[901px]:col-start-3 min-[901px]:row-start-1 min-[901px]:mt-0 min-[901px]:justify-self-end">
          {site.footerRight}
        </span>
      </div>
    </footer>
  );
}
