import type { Metadata } from "next";
import { MediaPage } from "@/components/media-page";
import { notebook } from "@/data/media";

export const metadata: Metadata = { title: "Notebook" };

export default function NotebookPage() {
  return (
    <MediaPage
      title="Notebook"
      intro="Illustration pages and sketches."
      items={notebook}
      layout="pages"
    />
  );
}
