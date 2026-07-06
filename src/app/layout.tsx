import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saransh Chaudhary | Creative Developer",
  description: "Cinematic futuristic portfolio of Saransh Chaudhary, featuring Creative Development, Video Editing, 3D Interactive UI, and Motion Design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      {/* 
        Removed min-h-full and replaced with min-h-screen, allowing the document to 
        expand naturally so that Lenis smooth scrolling can capture and smooth window scrolls.
      */}
      <body suppressHydrationWarning className="min-h-screen flex flex-col selection:bg-primary selection:text-main-text">
        <SmoothScrollProvider>
          <Navbar />
          <main className="flex-grow flex flex-col pt-24">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
