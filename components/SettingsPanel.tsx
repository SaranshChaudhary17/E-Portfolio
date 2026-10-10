"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSystem, THEMES, ThemeKey, Tier } from "./SystemProvider";
import type { AudioTheme } from "@/lib/audio";

const AUDIO: { id: AudioTheme; name: string; sub: string }[] = [
  { id: "lofi", name: "Default", sub: "Ambient / Lo-fi" },
  { id: "synthwave", name: "Digital Minimalism", sub: "Synthwave / Retro" },
];
const TIERS: Tier[] = ["high", "medium", "saver"];

export default function SettingsPanel() {
  const pathname = usePathname();

  // Hide on malik routes
  if (pathname?.startsWith("/malik")) {
    return null;
  }

  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const s = useSystem();

  // Close panel whenever route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close panel when clicking anywhere outside
  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [open]);

  return (
    <div ref={panelRef}>
      <button
        aria-label="Open settings"
        onClick={() => setOpen((o) => !o)}
        className="fixed right-0 top-1/2 z-50 -translate-y-1/2 rounded-l-lg bg-[var(--accent)] px-2 py-3 text-black hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
      >
        ⚙
      </button>

      <aside
        className={`fixed right-6 top-1/2 z-50 w-80 -translate-y-1/2 rounded-xl border border-white/10 bg-black/85 p-5 font-mono text-xs
          text-[#F4F2EE] backdrop-blur-xl transition-all duration-300 shadow-2xl ${open ? "translate-x-0 opacity-100 pointer-events-auto" : "pointer-events-none translate-x-8 opacity-0"}`}
      >
        <h3 className="mb-4 text-lg font-bold">System</h3>

        <p className="mb-2 opacity-50">Core theme</p>
        <div className="mb-5 flex gap-2">
          {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
            <button
              key={k}
              aria-label={k}
              onClick={() => s.setTheme(k)}
              style={{ background: THEMES[k] }}
              className={`h-8 w-8 rounded-full cursor-pointer transition-transform hover:scale-105 ${s.theme === k ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""}`}
            />
          ))}
        </div>

        <p className="mb-2 opacity-50">Audio engine</p>
        <button
          onClick={() => s.setVibe(!s.vibe)}
          className="mb-2 w-full rounded-lg border border-white/10 px-3 py-2 text-left hover:bg-white/5 cursor-pointer transition-colors"
        >
          Music: {s.vibe ? "On" : "Off (silent, no SFX)"}
        </button>
        <div className="mb-5 space-y-2">
          {AUDIO.map((a) => (
            <button
              key={a.id}
              onClick={() => s.setAudioTheme(a.id)}
              className={`w-full rounded-lg border px-3 py-2 text-left cursor-pointer transition-colors ${s.audioTheme === a.id ? "border-[var(--accent)] bg-white/5" : "border-white/10 hover:border-white/20"}`}
            >
              <div className="text-sm font-bold">{a.name}</div>
              <div className="opacity-50">{a.sub}</div>
            </button>
          ))}
        </div>

        <p className="mb-2 opacity-50">Performance tier</p>
        <div className="grid grid-cols-3 gap-2">
          {TIERS.map((t) => (
            <button
              key={t}
              onClick={() => s.setTier(t)}
              className={`rounded-lg border py-2 capitalize cursor-pointer transition-colors ${s.tier === t ? "border-[var(--accent)] bg-white/10 font-bold" : "border-white/10 hover:border-white/20"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
