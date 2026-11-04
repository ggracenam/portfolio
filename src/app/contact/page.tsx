import type { Metadata } from "next";
import { CopyEmail } from "@/components/copy-email";
import { Reveal } from "@/components/reveal";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for work inquiries.",
};

const rows = [
  { label: "LinkedIn", href: site.links.linkedin, text: "linkedin.com/in/gracenam4" },
  { label: "Resume", href: site.links.resume, text: "View on Google Drive" },
  { label: "Pinterest", href: site.links.pinterest, text: "pin.it/56I9TevFQ" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-8 pt-28 md:pt-36">
      <TextEffect
        as="h1"
        per="word"
        preset="fade-in-blur"
        speedReveal={1.4}
        className="max-w-[12ch] text-[clamp(40px,8vw,104px)] leading-[0.95] tracking-[-0.04em]"
      >
        Let’s get in touch!
      </TextEffect>

      <Reveal className="mt-8 max-w-[44ch] text-[18px] leading-[1.5] text-muted md:text-[22px]">
        <p>Get in touch with me for any work inquiries.</p>
      </Reveal>

      <Reveal className="mt-14 md:mt-20">
        <dl className="divide-y divide-line border-y border-line">
          <div className="grid gap-2 py-5 sm:grid-cols-[200px_1fr] sm:gap-10">
            <dt className="text-muted">Email</dt>
            <dd>
              <CopyEmail email={site.email} />
            </dd>
          </div>
          {rows.map((r) => (
            <div key={r.label} className="grid gap-2 py-5 sm:grid-cols-[200px_1fr] sm:gap-10">
              <dt className="text-muted">{r.label}</dt>
              <dd>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-line decoration-1 underline-offset-[5px] transition-colors hover:decoration-fg"
                >
                  {r.text}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
