"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Projects live on the home page; keep old /projects links working.
export default function ProjectsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
