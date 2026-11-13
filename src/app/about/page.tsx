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
            Hi, I’m You Rim, I also go by Grace! I’m a curious designer that started my journey
            from fine art to the digital world of graphic design and also UI/UX. As someone who
            loves to take photos, does illustrations as a side hobby, and is my family and
            friends’s personal stylist I see myself as a creative director.
          </p>
          <p>
            As someone who lived in England, Korea, and the United States, I have a very
            multicultural background.
          </p>
          <p>
            My main source of inspiration comes from my travels and artistic endeavours. I get
            inspired by even the smallest and the most specific things, like how silverware
            cutleries next to the window reflect light.
          </p>
        </div>

        <section className="mt-14">
          <h2 className={h}>Education</h2>
          <div className={body}>
            <p>
              Dual degree at the University of Michigan, Ann Arbor: User Experience Research &amp;
              Design at the School of Information, and Visual Design at the Stamps School of Art
              &amp; Design.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className={h}>Interests</h2>
          <div className={body}>
            <p>
              Design, AI, fashion, music, editorials, art history, new technologies, and
              photography. Anything vintage. I love to visit{" "}
              <Link href="/archive/misc/exhibitions" className={link}>
                art exhibitions
              </Link>{" "}
              too.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className={h}>Languages</h2>
          <div className={body}>
            <p>English, Korean, French B2, and a bit of Spanish :)</p>
          </div>
        </section>
      </div>
    </div>
  );
}
