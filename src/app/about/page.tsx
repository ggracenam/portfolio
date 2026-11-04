import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

const para = "text-[18px] leading-[1.5] md:text-[22px] md:leading-[1.4] tracking-[-0.01em]";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-8 pt-28 md:pt-36">
      <TextEffect
        as="h1"
        per="char"
        preset="fade-in-blur"
        speedReveal={1.6}
        className="mb-12 text-[clamp(40px,8vw,104px)] leading-[0.95] tracking-[-0.04em] md:mb-16"
      >
        About
      </TextEffect>

      <div className="grid gap-10 md:grid-cols-[minmax(0,360px)_1fr] md:gap-16">
        <Reveal>
          <Image
            src={site.profileImage.src}
            alt={site.profileImage.alt}
            width={site.profileImage.w}
            height={site.profileImage.h}
            priority
            sizes="(min-width: 768px) 360px, 100vw"
            className="h-auto w-full rounded-md bg-fg/[0.04]"
          />
        </Reveal>

        <div className="flex flex-col gap-7">
          <Reveal>
            <p className={para}>
              I’m {site.name}, also known as {site.nickname} — a UX designer and artist who
              creates thoughtful, human-centered experiences, and an aspiring product designer.
            </p>
          </Reveal>
          <Reveal>
            <p className={para}>
              I’m pursuing a dual degree at the University of Michigan, Ann Arbor: User
              Experience Research &amp; Design at the School of Information, and Graphic Design
              at the Stamps School of Art &amp; Design.
            </p>
          </Reveal>
          <Reveal>
            <p className={para}>
              As an international student who has lived in the UK, Korea, and the United
              States, I’ve learned to see the world from multiple perspectives.
            </p>
          </Reveal>
          <Reveal>
            <p className={para}>
              Outside of coursework I’m drawn to design, new technologies, AI, art history,
              editorials, and photography. You can find a record of the{" "}
              <Link
                href="/misc/exhibitions"
                className="underline decoration-line decoration-1 underline-offset-[6px] transition-colors hover:decoration-fg"
              >
                exhibitions I’ve visited here
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
