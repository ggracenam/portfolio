import type { Metadata } from "next";
import { Showcase } from "@/components/showcase";
import { studio } from "@/data/projects";

export const metadata: Metadata = { title: "Studio" };

export default function StudioPage() {
  return <Showcase projects={studio} base="archive" allowGrid={false} showBar={false} />;
}
