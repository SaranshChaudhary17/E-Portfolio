"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSystem, Tier } from "./SystemProvider";

const TIERS: { id: Tier; label: string }[] = [
  { id: "high", label: "HIGH" },
  { id: "medium", label: "MED" },
  { id: "saver", label: "SAVER" },
];

export default function BootScreen() {
  const pathname = usePathname();
  const { entered, enter, tier, setTier } = useSystem();
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);
  const [hoverVibe, setHoverVibe] = useState(false);

  // If on malik route, do not show BootScreen at all
  if (pathname?.startsWith("/malik")) {
    return null;
  }

  const ready = pct >= 100;

  // Magnetic floating pill that tracks mouse smoothly
  const pillRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const posRef = useRef({ x: -999, y: -999 });

  // Smooth loading progress from 0% to 100%
  useEffect(() => {
    let raf = 0;
    let p = 0;
    const tick = () => {
      p = Math.min(100, p + 0.6 + Math.random() * 1.8);
      setPct(Math.floor(p));
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Track mouse coordinates & smooth lerp for the floating pill
  useEffect(() => {
    const midX = typeof window !== "undefined" ? window.innerWidth / 2 : 500;
    const midY = typeof window !== "undefined" ? window.innerHeight / 2 : 400;
    posRef.current = { x: midX, y: midY };
    mouseRef.current = { x: midX, y: midY };

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      const isRight = e.clientX >= window.innerWidth / 2;
      setHoverVibe(isRight);
    };

    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const loop = () => {
      if (pillRef.current) {
        // Smooth spring lerp towards cursor
        posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.16;
        posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.16;

        pillRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Cleanup when entered
  useEffect(() => {
    if (!entered) return;
    const t = setTimeout(() => setGone(true), 850);
    return () => clearTimeout(t);
  }, [entered]);

  if (gone) return null;

  // Clicking on screen: Left side = Silent Mode, Right side = Vibes On
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ready) return;
    const mid = window.innerWidth / 2;
    const isRightSide = e.clientX >= mid;
    enter(isRightSide);
  };

  return (
    <div
      onClick={handleScreenClick}
      className={`fixed inset-0 z-[100] cursor-pointer overflow-hidden select-none font-mono text-[#F4F2EE] transition-all duration-700 ease-out
        ${entered ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      {/* LEFT SPLIT CURTAIN (SILENT MODE ZONE) */}
      <div
        className={`absolute inset-y-0 left-0 w-1/2 bg-[#0D0D0D]/95 backdrop-blur-xl border-r border-white/10 transition-transform duration-700 ease-in-out
          ${entered ? "-translate-x-full" : "translate-x-0"}`}
      >
        {/* Subtle decorative grid cells in left panel */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-4 pointer-events-none opacity-20">
          <div className="border-b border-r border-white/20 p-3 text-[9px] text-white/50">GRID_L1_R1</div>
          <div className="border-b border-white/20 p-3 text-[9px] text-white/50">GRID_L2_R1</div>
          <div className="border-b border-r border-white/20 p-3 text-[9px] text-white/50">GRID_L1_R2</div>
          <div className="border-b border-white/20 p-3 text-[9px] text-white/50">GRID_L2_MASTER</div>
          <div className="border-b border-r border-white/20 p-3 text-[9px] text-white/50">GRID_L1_R3</div>
          <div className="border-b border-white/20 p-3 text-[9px] text-white/50" />
          <div className="border-r border-white/20 p-3 text-[9px] text-white/50">GRID_L1_R4</div>
          <div className="p-3 text-[9px] text-white/50">GRID_L2_R4</div>
        </div>

        {/* Top-left system metadata */}
        <div className="absolute left-6 top-6 z-10 text-[10px] tracking-widest text-white/60 md:left-10 md:top-8 pointer-events-none">
          <div className="text-white/40 mb-1">GRID_L1_R1</div>
          <div className="font-bold text-white/80">SARANSH CHAUDHARY — PORTFOLIO</div>
          <div className="text-white/40">2026 // ARCH_OS</div>
        </div>

        {/* Bottom-left: PERFORMANCE TIER selector */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-6 left-6 z-40 md:bottom-8 md:left-10 cursor-default pointer-events-auto"
        >
          <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-white/40">
            PERFORMANCE TIER
          </div>
          <div className="flex items-center gap-2">
            {TIERS.map((t) => {
              const active = tier === t.id;
              return (
                <button
                  key={t.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setTier(t.id);
                  }}
                  className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer
                    ${active ? "border border-white bg-white/20 text-white shadow-[0_0_12px_rgba(255,255,255,0.2)]" : "border border-white/15 bg-black/40 text-white/50 hover:border-white/40 hover:text-white"}`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT SPLIT CURTAIN (VIBES ON ZONE) */}
      <div
        className={`absolute inset-y-0 right-0 w-1/2 bg-[#0D0D0D]/95 backdrop-blur-xl border-l border-white/10 transition-transform duration-700 ease-in-out
          ${entered ? "translate-x-full" : "translate-x-0"}`}
      >
        {/* Subtle decorative grid markings */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="p-3 text-[9px] text-white/50">GRID_RIGHT_SAMPLE</div>
        </div>

        {/* Top-right: Big Percentage Display */}
        <div className="absolute right-6 top-6 z-10 text-right md:right-10 md:top-8 pointer-events-none">
          <div className="font-display text-[clamp(72px,13vw,160px)] font-bold leading-none tracking-tight text-white">
            {pct}%
          </div>
        </div>

        {/* Bottom-right: SYSTEM_READY + LOADED BUTTON */}
        <div className="absolute bottom-6 right-6 z-20 text-right md:bottom-8 md:right-10 pointer-events-none">
          <div className="mb-2 text-[9px] uppercase tracking-widest text-white/40">
            &lt;&nbsp;&nbsp;SYSTEM_READY&nbsp;&nbsp;{pct}%&nbsp;&nbsp;&gt;
          </div>
          <div
            className={`w-48 sm:w-56 rounded-md py-3 text-center text-xs font-bold uppercase tracking-widest transition-all duration-300
              ${ready ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)]" : "bg-white/15 text-white/30"}`}
          >
            {ready ? "LOADED" : "INITIALIZING..."}
          </div>
        </div>
      </div>

      {/* BOTTOM-CENTER: MUSIC TOGGLE INDICATOR */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setHoverVibe((v) => !v);
        }}
        className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 md:bottom-8 cursor-pointer pointer-events-auto"
      >
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/70 px-4 py-1.5 text-[10px] tracking-wider backdrop-blur-md transition-all hover:border-white/30">
          <span className={`font-bold transition-colors ${hoverVibe ? "text-white" : "text-white/30"}`}>
            On
          </span>
          <span className="text-white/40 uppercase">MUSIC</span>
          <span className={`font-bold transition-colors ${!hoverVibe ? "text-white" : "text-white/30"}`}>
            Off
          </span>
        </div>
      </div>

      {/* MOUSE-FOLLOWING DYNAMIC PILL (MOVES WITH CURSOR ACROSS SPLIT) */}
      <div
        ref={pillRef}
        style={{ left: 0, top: 0 }}
        className={`pointer-events-none fixed z-50 transition-opacity duration-300 will-change-transform
          ${ready ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <div className="flex items-center rounded-full border border-white/20 bg-black/85 p-1 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,0,0,0.85)]">
          <span className="px-4 py-2 text-xs font-bold tracking-widest text-white/70 font-mono">
            ENTER
          </span>

          {hoverVibe ? (
            /* VIBES ON: Active when cursor is in the Right half */
            <span className="rounded-full bg-white px-5 py-2 text-xs font-bold tracking-widest text-black shadow-[0_0_16px_rgba(255,255,255,0.45)] transition-all font-mono">
              VIBES ON
            </span>
          ) : (
            /* SILENT MODE: Active when cursor is in the Left half */
            <span className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-xs font-bold tracking-widest text-white shadow-[0_0_12px_rgba(255,255,255,0.18)] transition-all font-mono">
              SILENT MODE
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
