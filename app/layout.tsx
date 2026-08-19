import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { getIdentityRecord, getSummaryRecord } from "@/lib/knowledge-base";
import "./globals.css";

const grotesk = localFont({
  src: "../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-grotesk",
  display: "swap",
  weight: "300 700",
});

const mono = localFont({
  src: "../node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
});

const identity = getIdentityRecord();
const summary = getSummaryRecord();
const title = `${identity.shortTitle} · AI Engineer`;
const metadataBase = new URL(
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000",
);

export const metadata: Metadata = {
  metadataBase,
  title,
  description: summary.content,
  applicationName: identity.shortTitle,
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    title,
    description: summary.content,
    images: [
      {
        url: "/og-governed-console.png",
        width: 1792,
        height: 936,
        alt: "Governed Console record lineage diagram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: summary.content,
    images: ["/og-governed-console.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
