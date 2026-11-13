import { Reveal } from "@/components/reveal";
import { MediaFigure } from "@/components/media-item";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import type { MediaItem } from "@/data/media";

/**
 * Shared page for Archive and Notebook: a title, one line of intro, then the items.
 * "grid" = photos in staggered columns; "pages" = one wide page after another.
 */
export function MediaPage({
  title,
  intro,
  items,
  layout,
}: {
  title: string;
  intro: string;
  items: MediaItem[];
  layout: "grid" | "pages";
}) {
  return (
    <div className="mx-auto max-w-[1280px] px-[var(--edge)] pb-28 pt-24">
      <div className="mx-auto w-[min(541px,100%)]">
        <TextEffect as="h1" per="word" preset="fade-in-blur" speedReveal={1.4} className="font-semibold">
          {title}
        </TextEffect>
        <Reveal className="mt-2 text-muted">
          <p>{intro}</p>
        </Reveal>
      </div>

      {items.length === 0 ? (
        <Reveal className="mx-auto mt-10 w-[min(541px,100%)] text-muted">
          <p>Nothing here yet. Coming soon.</p>
        </Reveal>
      ) : layout === "grid" ? (
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {items.map((item, i) => (
            <MediaFigure key={item.src} item={item} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-10 flex w-[min(942px,100%)] flex-col gap-10">
          {items.map((item, i) => (
            <MediaFigure key={item.src} item={item} priority={i < 1} />
          ))}
        </div>
      )}
    </div>
  );
}
