import Image from "next/image";
import { PaintingSlides } from "@/components/painting-slides";
import { Reveal } from "@/components/reveal";
import type { Block, Img } from "@/data/projects";
import { cn } from "@/lib/utils";

const gap = "clamp(48px,6.78vw,96px)";
const gapMedium = gap;
const gapLarge = "clamp(96px,13.56vw,192px)";

function Section({
  heading,
  children,
}: {
  heading?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section className="mx-auto w-[min(541px,100%)] text-pretty">
        {heading && <h2 className="font-semibold">{heading}</h2>}
        <div className={heading ? "mt-2" : ""}>{children}</div>
      </section>
    </Reveal>
  );
}

function Photo({ img, plain = false }: { img: Img; plain?: boolean }) {
  return (
    <div
      className={plain ? "relative mx-auto" : "media-round mx-auto"}
      style={{ width: `min(100%, calc(var(--fit-h) * ${img.w / img.h}))` }}
    >
      <Image
        src={img.src}
        alt={img.alt}
        width={img.w}
        height={img.h}
        sizes="(min-width: 990px) 463px, 100vw"
      />
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return (
        <Section heading={block.heading}>
          <div className="flex flex-col gap-[var(--lh)]">
            {block.paragraphs.map((p, i) => (
              <p key={i}>
                {p}
              </p>
            ))}
          </div>
        </Section>
      );

    case "list":
      return (
        <Section heading={block.heading}>
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-4 py-3">
                {block.numbered && (
                  <span className="w-6 shrink-0 text-muted tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                <div className="flex flex-col gap-1">
                  <span>{item.title}</span>
                  {item.text && <span className="text-muted">{item.text}</span>}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      );

    case "artworks":
      // When the works carry their own images, give each one its own screen.
      if (block.items.some((a) => a.image)) {
        return <PaintingSlides items={block.items} />;
      }
      return (
        <Section heading={block.heading}>
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {block.items.map((a) => (
              <li key={a.title} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto] sm:gap-6">
                <div className="flex flex-col gap-1">
                  <span>{a.title}</span>
                  <span className="text-muted">
                    {a.medium} · {a.size}
                  </span>
                  {a.note && <span className="text-muted">{a.note}</span>}
                </div>
                <span className="text-muted tabular-nums">{a.year}</span>
              </li>
            ))}
          </ul>
        </Section>
      );

    case "video":
      return (
        <div className="mx-auto w-[min(942px,100%)]">
          <Reveal>
            <div className="media-round" style={{ aspectRatio: `${block.w} / ${block.h}` }}>
              <video
                className="block h-full w-full"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={block.poster}
                aria-label={block.alt}
              >
                {block.webm && <source src={block.webm} type="video/webm" />}
                <source src={block.mp4} type="video/mp4" />
              </video>
            </div>
          </Reveal>
        </div>
      );

    case "images":
      return (
        <div className="flex flex-col gap-4">
          {block.heading && (
            <h2 className="mx-auto w-[min(541px,100%)] font-semibold">{block.heading}</h2>
          )}
          <div
            className="mx-auto grid gap-4 md:grid-cols-2"
            style={{ width: `min(${block.maxWidth ?? 942}px, 100%)`, ...(block.fitH ? ({ "--fit-h": block.fitH } as React.CSSProperties) : {}) }}
          >
            {block.images.map((img) => {
              const wide = img.w / img.h >= 1.45 || block.images.length === 1;
              return (
                <Reveal key={img.src} className={cn(wide && "md:col-span-2")}>
                  <Photo img={img} plain={block.plain} />
                </Reveal>
              );
            })}
          </div>
          {block.caption && (
            <p className="mx-auto w-[min(942px,100%)] text-muted">{block.caption}</p>
          )}
        </div>
      );
  }
}

export function ProjectBlocks({ blocks, spacing }: { blocks: Block[]; spacing?: "large" }) {
  const gap = spacing === "large" ? gapLarge : gapMedium;
  return (
    <div className="flex flex-col" style={{ gap }}>
      {blocks.map((block, i) => (
        <div
          key={i}
          className={block.type === "images" && block.pull ? "mix-blend-multiply" : undefined}
          style={(block.type === "images" || block.type === "text" || block.type === "video") && block.tight ? { marginTop: `calc(${gap} * -1 + 20px - ${block.type === "images" ? block.pull ?? 0 : 0}px)` } : undefined}
        >
          <BlockView block={block} />
        </div>
      ))}
    </div>
  );
}
