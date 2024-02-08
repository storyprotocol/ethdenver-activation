import "./globals.css";

import React from "react";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { SWRProvider } from "@/app/swr-provider";
import FooterLogo from "@/components/pages/FooterLogo";

import localFont from "next/font/local";

const acronymFont = localFont({
  src: [
    {
      path: "../assets/fonts/acronym_regular.woff2",
      weight: "400",
    },
    {
      path: "../assets/fonts/acronym_semibold.woff2",
      weight: "600",
    },
  ],
  variable: "--font-acronym",
});

export const metadata: Metadata = {
  title: "Onchain Chronicles",
  description: "A collective storytelling journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex min-h-screen min-h-svh flex-col items-center bg-linear font-sans antialiased",
          acronymFont.variable,
        )}
      >
        <SWRProvider>{children}</SWRProvider>
        <FooterLogo />
      </body>
    </html>
  );
}
