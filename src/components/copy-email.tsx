"use client";

import { useEffect, useRef, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <span className="inline-flex items-center gap-3">
      <a
        href={`mailto:${email}`}
        className="underline decoration-line decoration-1 underline-offset-[5px] transition-colors hover:decoration-fg"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="rounded-md border border-line px-2 py-0.5 text-[12px] text-muted transition-colors hover:border-fg hover:text-fg"
        aria-live="polite"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </span>
  );
}
