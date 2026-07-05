import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

/**
 * Type system v4 — track day.
 * Archivo variable (Google Fonts, OFL): neutral Swiss grotesk with a
 * real width axis; display caps run at 90% stretch. Switzer
 * (Fontshare): body. The variable file's default weight is 600, so
 * every use sets an explicit weight.
 */

const archivo = localFont({
  src: "../fonts/Archivo-Variable.woff2",
  weight: "100 900",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  variable: "--font-archivo",
  display: "swap",
});

const switzer = localFont({
  src: [
    { path: "../fonts/Switzer-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Switzer-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Switzer-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-switzer",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gaita-site.vercel.app"),
  title: {
    default: "Gaita — Your super AI running coach",
    template: "%s — Gaita",
  },
  description:
    "Gaita is a super AI running coach in your pocket. It reads your form, gait and power off one video, then coaches the fix in your ear.",
  keywords: [
    "AI running coach",
    "running form analysis",
    "gait analysis app",
    "running coach app",
    "running biomechanics",
  ],
  openGraph: {
    title: "Gaita — Your super AI running coach",
    description:
      "A super AI running coach in your pocket. Form, gait and power, read off one video.",
    url: "https://gaita-site.vercel.app",
    siteName: "Gaita",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaita — Your super AI running coach",
    description:
      "A super AI running coach in your pocket. Form, gait and power, read off one video.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${archivo.variable} ${switzer.variable} min-h-screen`}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
