"use client";

import LiquidGlass from "liquid-glass-react";

/**
 * A pane of liquid glass that sizes itself to its content (the library centres its panel on
 * a point, so an invisible copy of the content gives the wrapper its size and the glass is
 * laid exactly over it).
 */
export function Glass({
  children,
  padding = "6px 12px",
  radius = 12,
  className = "",
  strength = 1,
  overLight = false,
}: {
  children: React.ReactNode;
  padding?: string;
  radius?: number;
  className?: string;
  /** 0 to 1: how strongly the glass bends what is behind it. */
  strength?: number;
  overLight?: boolean;
}) {
  return (
    <span className={`glass-wrap relative inline-block align-middle ${className}`} style={{ padding }}>
      <span aria-hidden className="invisible block whitespace-nowrap">
        {children}
      </span>
      <LiquidGlass
        style={{ position: "absolute", top: "50%", left: "50%" }}
        padding={padding}
        cornerRadius={radius}
        displacementScale={60 * strength}
        blurAmount={0.08}
        saturation={140}
        aberrationIntensity={1.5}
        elasticity={0.2}
        overLight={overLight}
      >
        <span className="block whitespace-nowrap">{children}</span>
      </LiquidGlass>
    </span>
  );
}
