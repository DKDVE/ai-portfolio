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

export const metadata: Metadata = {
  title: identity.shortTitle,
  description: summary.content,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
