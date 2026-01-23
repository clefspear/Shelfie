import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Book Shelfie - Reading, with Friends.",
  description: "Reading, with Friends.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Book Shelfie - Reading, with Friends.",
    description: "Reading, with Friends.",
    type: "website",
    url: "https://bookshelfie.app",
    images: [
      {
        url: "/logo.png",
        width: 356,
        height: 325,
        alt: "Reading, with Friends.",
      },
    ],
    siteName: "Book Shelfie",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Shelfie - Reading, with Friends.",
    description: "Reading, with Friends.",
    images: ["/logo.png"],
    site: "@bookshelfie",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Book Shelfie",
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
