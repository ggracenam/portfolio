import Image from "next/image";
import { Reveal } from "@/components/reveal";
import type { Block, Img } from "@/data/projects";
import { cn } from "@/lib/utils";

const gap = "clamp(48px,6.78vw,96px)";

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section className="mx-auto w-[min(541px,100%)] text-pretty">
        <h2 className="font-semibold">{heading}</h2>
        <div className="mt-2">{children}</div>
      </section>
    </Reveal>
  );
}

function Photo({ img }: { img: Img }) {
  return (
    <Image
      src={img.src}
      alt={img.alt}
      width={img.w}
      height={img.h}
      sizes="(min-width: 1280px) 616px, 100vw"
      className="h-auto w-full rounded-sm bg-fg/[0.04]"
    />
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

    case "images":
      return (
        <div className="flex flex-col gap-4">
          {block.heading && (
            <h2 className="mx-auto w-[min(541px,100%)] font-semibold">{block.heading}</h2>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {block.images.map((img) => {
              const wide = img.w / img.h >= 1.45;
              return (
                <Reveal key={img.src} className={cn(wide && "md:col-span-2")}>
                  <Photo img={img} />
                </Reveal>
              );
            })}
          </div>
        </div>
      );
  }
}

export function ProjectBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col" style={{ gap }}>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}
