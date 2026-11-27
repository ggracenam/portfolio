"use client";

import { ViewTransition } from "react";

// Page changes use the browser's View Transitions (React's <ViewTransition>, styled in globals.css):
// the old page blurs and fades out, then the new one melts in. Browsers without support just swap,
// with a plain fade-in.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="page-fade">{children}</div>
    </ViewTransition>
  );
}
