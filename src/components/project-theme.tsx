import type { Project } from "@/data/projects";

/**
 * Tints the whole page (background, text, header, buttons) with the project's own colour, as dmcg.co
 * does. It is a plain <style> that lives only while the project page is on screen, so the colours
 * fade in on arrival and fade back when you leave.
 */
export function ProjectTheme({ theme }: { theme: Project["theme"] }) {
  if (!theme) return null;
  const css = `:root{--bg:${theme.bg};--fg:${theme.fg};--muted:color-mix(in srgb,${theme.fg} 62%,${theme.bg});--line:color-mix(in srgb,${theme.fg} 15%,transparent);--pill:color-mix(in srgb,${theme.bg} 82%,transparent)}`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
