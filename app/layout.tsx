import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://saransh.dev"),
  title: {
    default: "Saransh Chaudhary | Cinematic Creative Developer",
    template: "%s | Saransh Chaudhary"
  },
  description: "A cinematic futuristic portfolio for Saransh Chaudhary, creative developer, video editor, UI designer, and motion creator.",
  keywords: ["Saransh Chaudhary", "creative developer", "video editor", "portfolio", "Next.js", "motion design"],
  openGraph: {
    title: "Saransh Chaudhary | Cinematic Creative Developer",
    description: "Creative development, cinematic UI, motion design, video editing, and interactive experiences.",
    url: "https://saransh.dev",
    siteName: "Saransh Portfolio",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>
          <SiteShell>{children}</SiteShell>
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
