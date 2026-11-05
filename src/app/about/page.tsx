import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

const link =
  "underline decoration-line decoration-1 underline-offset-[5px] transition-colors hover:decoration-fg";
const h = "font-semibold";
const body = "mt-2 space-y-[22px]";

export default function AboutPage() {
  return (
    <div className="about-veil relative min-h-svh px-[var(--edge)] pb-16 pt-[120px]">
      <div className="relative mx-auto w-[min(397px,100%)]">
        <Link
          href="/"
          aria-label="Close"
          className="absolute -top-8 right-0 text-[18px] leading-none text-muted transition-colors hover:text-fg md:-right-16 md:top-0"
        >
          ×
        </Link>

        <div className="space-y-[22px]">
          <p>
            I’m {site.name}, also known as {site.nickname} — a UX designer and artist who creates
            thoughtful, human-centered experiences, and an aspiring product designer. Also a
            creative director.
          </p>
          <p>
            As an international student who has lived in the UK, Korea, and the United States,
            I’ve learned to see the world from multiple perspectives.
          </p>
        </div>

        <section className="mt-14">
          <h2 className={h}>Education</h2>
          <div className={body}>
            <p>
              Dual degree at the University of Michigan, Ann Arbor: User Experience Research &amp;
              Design at the School of Information, and Graphic Design at the Stamps School of Art
              &amp; Design.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className={h}>Interests</h2>
          <div className={body}>
            <p>
              Design, new technologies, AI, art history, editorials, and photography. A record of
              the{" "}
              <Link href="/misc/exhibitions" className={link}>
                exhibitions I’ve visited
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
