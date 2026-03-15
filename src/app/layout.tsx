import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import { SkipLink } from "@/components/portfolio/skip-link";
import { SmoothScrollProvider } from "@/components/portfolio/smooth-scroll";
import { LenisProvider } from "@/components/portfolio/lenis-provider";
import { CustomCursorProvider } from "@/components/portfolio/custom-cursor";
import { PreloaderProvider } from "@/components/portfolio/preloader";
import { ThemeProvider, themeScript } from "@/components/portfolio/theme-provider";
import { DioramaBackground } from "@/components/portfolio/diorama-scene";
import { siteContent } from "@/content/site-content";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a0a0c" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Grigorii Portfolio",
  title: {
    default: "Grigorii | AI-Enabled Support Systems Operator",
    template: "%s | Grigorii",
  },
  description: siteContent.description,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: siteContent.meta.name }],
  creator: siteContent.meta.name,
  publisher: siteContent.meta.name,
  keywords: [
    "technical support",
    "support operations",
    "workflow automation",
    "escalation management",
    "incident handling",
    "ai automation",
    "customer success",
    "product-facing operations",
    "support systems",
    "customer feedback",
    "case studies",
  ],
  openGraph: {
    title: "Grigorii | AI-Enabled Support Systems Operator",
    description: siteContent.description,
    url: absoluteUrl("/"),
    siteName: siteContent.meta.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grigorii | AI-Enabled Support Systems Operator",
    description: siteContent.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${plexMono.variable}`} suppressHydrationWarning>
        <SkipLink />
        <ThemeProvider>
          <LenisProvider>
            <CustomCursorProvider>
              <PreloaderProvider>
                <DioramaBackground />
                <SmoothScrollProvider>
                  {children}
                </SmoothScrollProvider>
              </PreloaderProvider>
            </CustomCursorProvider>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
