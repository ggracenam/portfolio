"use client";

import { motion } from "motion/react";

// Re-mounts on every navigation, so each page fades in.
// (Opacity only: transform/filter here would break `position: fixed` inside pages.)
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
