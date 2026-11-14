/**
 * iPhone mockup (frame art from the portfolio's own mockup) with a live Figma prototype in its screen.
 * The frame image has a transparent screen, so the prototype shows through and the bezel sits on top.
 */
export function Phone({
  src,
  title,
  interactive = false,
  className = "",
  style,
}: {
  src: string;
  title: string;
  /** false = decorative (cursor passes through to the link); true = tappable prototype. */
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`relative aspect-[696/1368] ${className}`} style={style}>
      <div
        className="absolute overflow-hidden bg-white"
        style={{
          left: "6.753%",
          top: "2.485%",
          width: "86.06%",
          height: "94.74%",
          borderRadius: "10.35% / 4.78%",
        }}
      >
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allowFullScreen
          tabIndex={interactive ? 0 : -1}
          className={`h-full w-full border-0 ${interactive ? "" : "pointer-events-none"}`}
        />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/phone-frame.png"
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      />
    </div>
  );
}
