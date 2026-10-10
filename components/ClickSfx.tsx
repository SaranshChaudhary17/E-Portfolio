"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { audio } from "@/lib/audio";

/** Har button / link / [data-sfx] pe click sound. Silent mode me audio.click() kuch nahi karta. */
export default function ClickSfx() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/malik")) return;

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("button, a, [data-sfx]");
      if (el) audio.click();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);
  return null;
}
