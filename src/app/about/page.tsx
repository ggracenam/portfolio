import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

// The About text lives in <AboutOverlay /> (mounted in the root layout) so it can open over
// whichever page you were on. A direct visit to /about simply opens it.
export default function AboutPage() {
  return null;
}
