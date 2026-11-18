"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Set when the visitor goes back from a project, so the list can put them where they left off. */
export const RESTORE_FLAG = "showcase-restore";

function flag() {
  try {
    sessionStorage.setItem(RESTORE_FLAG, "1");
  } catch {}
}

/** Lives in the layout so it is already listening when the browser's back button is pressed
 *  (capture phase: it runs before the router swaps the page). */
export function BackWatcher() {
  const pathname = usePathname();

  // Whichever project page is open is the one the list should return to.
  useEffect(() => {
    const m = pathname.match(/^\/(projects|archive)\/([^/]+)\/?$/);
    if (!m) return;
    const key = `showcase-return:${m[1]}`;
    try {
      const mem = JSON.parse(sessionStorage.getItem(key) ?? "{}");
      sessionStorage.setItem(key, JSON.stringify({ ...mem, slug: m[2] }));
    } catch {}
  }, [pathname]);

  useEffect(() => {
    // Any other click means a fresh visit, so an old flag must not restore a position.
    const clear = () => {
      try {
        sessionStorage.removeItem(RESTORE_FLAG);
      } catch {}
    };
    window.addEventListener("popstate", flag, true);
    window.addEventListener("click", clear, true);
    return () => {
      window.removeEventListener("popstate", flag, true);
      window.removeEventListener("click", clear, true);
    };
  }, []);
  return null;
}

/** "← All projects": returns to the list. */
export function BackLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} onClick={flag} className={className}>
      {children}
    </Link>
  );
}
