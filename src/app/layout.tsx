import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter-tight";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HaloCursor } from "@/components/halo-cursor";
import { AboutOverlay } from "@/components/about-overlay";
import { BackWatcher } from "@/components/back-link";
import { IntroCard } from "@/components/intro-card";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://yourimnam.com"),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.title}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.title}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('intro-seen')&&!/[?&]intro\\b/.test(location.search))document.documentElement.classList.add('intro-seen')}catch(e){}",
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        <AboutOverlay />
        <HaloCursor />
        <BackWatcher />
        <IntroCard />
      </body>
    </html>
  );
}
