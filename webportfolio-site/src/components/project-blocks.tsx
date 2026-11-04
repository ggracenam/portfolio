import Image from "next/image";
import { Reveal } from "@/components/reveal";
import type { Block, Img } from "@/data/projects";
import { cn } from "@/lib/utils";

const bodyText = "max-w-[62ch] text-[17px] leading-[1.55] md:text-[18px]";

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section className="grid gap-4 md:grid-cols-[200px_1fr] md:gap-10">
        <h2 className="text-muted">{heading}</h2>
        <div>{children}</div>
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
      sizes="(min-width: 1100px) 1068px, 100vw"
      className="h-auto w-full rounded-md bg-fg/[0.04]"
    />
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return (
        <Section heading={block.heading}>
          <div className="flex flex-col gap-4">
            {block.paragraphs.map((p, i) => (
              <p key={i} className={bodyText}>
                {p}
              </p>
            ))}
          </div>
        </Section>
      );

    case "list":
      return (
        <Section heading={block.heading}>
          <ul className="flex max-w-[62ch] flex-col divide-y divide-line border-y border-line">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-4 py-4">
                {block.numbered && (
                  <span className="w-6 shrink-0 text-muted tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-[17px] leading-snug md:text-[18px]">{item.title}</span>
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
          <ul className="flex max-w-[62ch] flex-col divide-y divide-line border-y border-line">
            {block.items.map((a) => (
              <li key={a.title} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[17px] leading-snug md:text-[18px]">{a.title}</span>
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
        <div className="flex flex-col gap-6">
          {block.heading && <h2 className="text-muted">{block.heading}</h2>}
          <div className="grid gap-3 md:grid-cols-2">
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
    <div className="flex flex-col gap-14 md:gap-20">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}
