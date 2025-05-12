import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import AppProvider from "@/components/providers/AppProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "CompressX - Solana Token Compression Service",
  description:
    "Save up to 98% on storage costs with our state-of-the-art token compression service for Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${roboto_mono.variable} antialiased bg-gradient-pattern`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
