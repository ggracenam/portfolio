import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-5 px-4 text-center">
      <p className="text-muted">404</p>
      <h1 className="text-[clamp(32px,6vw,72px)] leading-[1] tracking-[-0.035em]">
        That page doesn’t exist
      </h1>
      <Link
        href="/"
        className="rounded-xl border border-line bg-pill px-4 py-2 transition-colors hover:border-fg"
      >
        Back home
      </Link>
    </div>
  );
}
