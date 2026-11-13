import type { MediaItem } from "@/data/media";

/** One photo or video, with the same rounded corners and hairline outline as the project images. */
export function MediaFigure({ item, priority = false }: { item: MediaItem; priority?: boolean }) {
  return (
    <figure className="m-0">
      <div className="media-round">
        {item.type === "video" ? (
          <video
            src={item.src}
            poster={item.poster}
            aria-label={item.alt}
            controls
            playsInline
            preload="metadata"
            className="block h-auto w-full"
          />
        ) : (
          // Plain <img>: the site is a static export and the files live in /public.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt={item.alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="block h-auto w-full"
          />
        )}
      </div>
      {item.caption && <figcaption className="mt-2 text-muted">{item.caption}</figcaption>}
    </figure>
  );
}
