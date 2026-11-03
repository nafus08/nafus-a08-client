import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "StudioSpace — Room to make",
  description: "Find the creative space that helps you bring your next idea to life.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><SiteShell><Suspense fallback={<div className="wrap skeleton" />}>{children}</Suspense></SiteShell></body>
    </html>
  );
}
