import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter-tight";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HaloCursor } from "@/components/halo-cursor";
import { BackWatcher } from "@/components/back-link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <HaloCursor />
        <BackWatcher />
      </body>
    </html>
  );
}
