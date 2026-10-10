import "./globals.css";
import type { Metadata } from "next";
import { Bebas_Neue, Space_Mono } from "next/font/google";
import { SystemProvider } from "@/components/SystemProvider";
import BootScreen from "@/components/BootScreen";
import InteractiveGrid from "@/components/InteractiveGrid";
import ClickSfx from "@/components/ClickSfx";
import CustomCursor from "@/components/CustomCursor";
import SettingsPanel from "@/components/SettingsPanel";
import Ticker from "@/components/Ticker";
import Nav from "@/components/Nav";

const display = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = { title: "Saransh Chaudhary | Portfolio", description: "Creative developer portfolio" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${mono.variable}`}>
      <body suppressHydrationWarning>
        <SystemProvider>
          <CustomCursor />
          <BootScreen />
          <InteractiveGrid />
          <ClickSfx />
          <Ticker />
          <SettingsPanel />
          <Nav />
          <main className="relative z-10 min-h-screen">{children}</main>
        </SystemProvider>
      </body>
    </html>
  );
}
