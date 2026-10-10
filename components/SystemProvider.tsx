"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { audio, AudioTheme } from "@/lib/audio";

export type Tier = "high" | "medium" | "saver";
export const THEMES = {
  white: "#F4F2EE", orange: "#E8751A", denim: "#A9C4DA", mint: "#3DF2A8", red: "#FF4A3D",
} as const;
export type ThemeKey = keyof typeof THEMES;

type Ctx = {
  entered: boolean; vibe: boolean; theme: ThemeKey; audioTheme: AudioTheme; tier: Tier;
  enter: (vibe: boolean) => void;
  setVibe: (v: boolean) => void;
  setTheme: (t: ThemeKey) => void;
  setAudioTheme: (a: AudioTheme) => void;
  setTier: (t: Tier) => void;
};
const SystemCtx = createContext<Ctx | null>(null);
export const useSystem = () => {
  const c = useContext(SystemCtx);
  if (!c) throw new Error("useSystem must be inside SystemProvider");
  return c;
};

function load<T>(k: string, d: T): T {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
}
function save(k: string, v: unknown) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
}

export function SystemProvider({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false);
  const [vibe, setVibeState] = useState(false);
  const [theme, setThemeState] = useState<ThemeKey>("orange");
  const [audioTheme, setAudioThemeState] = useState<AudioTheme>("lofi");
  const [tier, setTierState] = useState<Tier>("high");

  useEffect(() => {
    setThemeState(load<ThemeKey>("sys.theme", "orange"));
    setAudioThemeState(load<AudioTheme>("sys.audio", "lofi"));
    setTierState(load<Tier>("sys.tier", "high"));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", THEMES[theme]);
    document.documentElement.dataset.tier = tier;
  }, [theme, tier]);

  const value: Ctx = {
    entered, vibe, theme, audioTheme, tier,
    enter: (v) => {           // BootScreen ke click se call hota hai
      audio.setTheme(audioTheme);
      audio.setVibe(v);
      setVibeState(v); setEntered(true);
    },
    setVibe: (v) => { audio.setVibe(v); setVibeState(v); },
    setTheme: (t) => { setThemeState(t); save("sys.theme", t); },
    setAudioTheme: (a) => { audio.setTheme(a); setAudioThemeState(a); save("sys.audio", a); },
    setTier: (t) => { setTierState(t); save("sys.tier", t); },
  };
  return <SystemCtx.Provider value={value}>{children}</SystemCtx.Provider>;
}
