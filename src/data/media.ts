/**
 * Items for the Archive (travel photos and videos) and the Notebook (illustration pages).
 *
 * To add one: drop the file into  public/archive/  or  public/notebook/  and add a line below.
 * `src` is the path from the public folder, e.g. "/archive/kyoto-01.jpg".
 */
export type MediaItem = {
  type: "image" | "video";
  src: string;
  /** Describe the picture (read aloud by screen readers). */
  alt: string;
  /** Optional small line under it, e.g. "Kyoto, 2025". */
  caption?: string;
  /** Videos only: a still image shown before it plays. */
  poster?: string;
};

export const archive: MediaItem[] = [
  // { type: "image", src: "/archive/kyoto-01.jpg", alt: "Street in Kyoto at dusk", caption: "Kyoto, 2025" },
  // { type: "video", src: "/archive/seoul-01.mp4", alt: "Han River at night", caption: "Seoul, 2025" },
];

export const notebook: MediaItem[] = [
  // { type: "image", src: "/notebook/page-01.jpg", alt: "Ink illustration of a sleeping cat", caption: "Page 1" },
];
