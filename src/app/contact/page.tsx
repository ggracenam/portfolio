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
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-[var(--edge)] pb-8 pt-24">
      <div className="mx-auto w-[min(541px,100%)]">
      <TextEffect
        as="h1"
        per="word"
        preset="fade-in-blur"
        speedReveal={1.4}
        className="font-semibold"
      >
        Let’s get in touch!
      </TextEffect>

      <Reveal className="mt-2 text-muted">
        <p>Get in touch with me for any work inquiries.</p>
      </Reveal>

      <Reveal className="mt-10">
        <dl className="divide-y divide-line border-y border-line">
          <div className="grid gap-2 py-3 sm:grid-cols-[116px_1fr] sm:gap-4">
            <dt className="text-muted">Email</dt>
            <dd>
              <CopyEmail email={site.email} />
            </dd>
          </div>
          {rows.map((r) => (
            <div key={r.label} className="grid gap-2 py-3 sm:grid-cols-[116px_1fr] sm:gap-4">
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
    </div>
  );
}
