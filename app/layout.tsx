import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ThemeScript } from "@/components/layout/theme-script";
import { SessionProvider } from "@/lib/auth/session-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AccessPath — Free College Admissions & Counseling",
    template: "%s · AccessPath",
  },
  description:
    "AccessPath is a free, open-access college admissions and counseling platform. Build a profile, find colleges that fit, track your applications, and write stronger essays.",
  keywords: [
    "college admissions",
    "college counseling",
    "college match",
    "essay coaching",
    "application tracker",
    "free",
    "open access",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef2ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen antialiased`}
      >
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
