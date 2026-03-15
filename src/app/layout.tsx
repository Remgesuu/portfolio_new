import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";

import { SkipLink } from "@/components/portfolio/skip-link";
import { SmoothScrollProvider } from "@/components/portfolio/smooth-scroll";
import { ThemeProvider, themeScript } from "@/components/portfolio/theme-provider";
import { CursorFollower } from "@/components/portfolio/cursor-follower";
import { siteContent } from "@/content/site-content";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f4ed" },
    { media: "(prefers-color-scheme: dark)", color: "#11161b" },
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
      <body className={`${instrumentSans.variable} ${plexMono.variable}`}>
        <SkipLink />
        <ThemeProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
          <CursorFollower />
        </ThemeProvider>
      </body>
    </html>
  );
}
