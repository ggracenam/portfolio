import type { Metadata } from "next";
import { MediaPage } from "@/components/media-page";
import { archive } from "@/data/media";

export const metadata: Metadata = { title: "Archive" };

export default function ArchivePage() {
  return (
    <MediaPage
      title="Archive"
      intro="Photos and videos from my travels."
      items={archive}
      layout="grid"
    />
  );
}
