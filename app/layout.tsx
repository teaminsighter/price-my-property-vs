import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { GTMScript } from "@/components/GTMScript";
import GTMTrackingProvider from "@/components/GTMTrackingProvider";

export const metadata: Metadata = {
  title: "Price My Property - Value Your Next Move",
  description: "Get a FREE Market Property Report. Find out how much your house could sell for with our expert property valuation service.",
  keywords: ["property valuation", "house price", "real estate", "market report", "property pricing"],
  openGraph: {
    title: "Price My Property - Value Your Next Move",
    description: "Get a FREE Market Property Report. Find out how much your house could sell for.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GTMScript />
        <Suspense fallback={null}>
          <GTMTrackingProvider>
            {children}
          </GTMTrackingProvider>
        </Suspense>
      </body>
    </html>
  );
}
