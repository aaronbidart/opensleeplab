import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenSleepLab",
  description:
    "A 3-night, at-home sleep test. Clinical-grade monitoring, honest results, and a real person to talk through what they mean.",
  metadataBase: new URL("https://opensleeplab.com"),
  openGraph: {
    title: "OpenSleepLab",
    description: "A 3-night, at-home sleep test. $490.",
    url: "https://opensleeplab.com",
    siteName: "OpenSleepLab",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
