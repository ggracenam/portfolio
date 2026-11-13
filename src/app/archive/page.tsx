import type { Metadata } from "next";
import { Showcase } from "@/components/showcase";
import { studio } from "@/data/projects";

export const metadata: Metadata = { title: "Archive" };

export default function ArchivePage() {
  return <Showcase projects={studio} base="archive" allowGrid={false} showBar={false} />;
}
