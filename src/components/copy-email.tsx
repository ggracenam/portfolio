"use client";

import { useCopy } from "@/components/contact-pill";

/** Inline email with a small "Copy" action that turns into "Copied ✓". */
export function CopyEmail({ email }: { email: string }) {
  const { copied, copy } = useCopy(email);
  return (
    <span className="inline-flex items-baseline gap-3">
      <a
        href={`mailto:${email}`}
        className="underline decoration-line decoration-1 underline-offset-[5px] transition-colors hover:decoration-fg"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className="text-muted transition-colors hover:text-fg"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </span>
  );
}
