import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookShelfie - Reading with Friends",
  description:
    "Track your reading progress, share with friends, and celebrate every page.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "BookShelfie - Reading with Friends",
    description:
      "Track your reading progress, share with friends, and celebrate every page.",
    type: "website",
    url: "https://bookshelfie.app",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "BookShelfie - Reading with Friends",
      },
    ],
    siteName: "BookShelfie",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookShelfie - Reading with Friends",
    description:
      "Track your reading progress, share with friends, and celebrate every page.",
    images: ["/logo.png"],
    site: "@bookshelfie",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "BookShelfie",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={inter.className}>
        {children}
        <TempoInit />
      </body>
    </html>
  );
}
