import type { Metadata } from "next";
import { MediaPage } from "@/components/media-page";
import { gallery } from "@/data/media";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <MediaPage
      title="Gallery"
      intro="Photos and videos from my travels."
      items={gallery}
      layout="grid"
    />
  );
}
