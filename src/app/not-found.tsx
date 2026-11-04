import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-3 px-[var(--edge)] text-center">
      <p className="text-muted">404</p>
      <h1 className="font-semibold">
        That page doesn’t exist
      </h1>
      <Link
        href="/"
        className="mt-2 rounded-xl border border-line bg-pill px-3.5 py-1.5 transition-colors hover:border-fg"
      >
        Back home
      </Link>
    </div>
  );
}
