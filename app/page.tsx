"use client";
import { useEffect, useRef } from "react";
import Hero3D from "@/components/Hero3D";
import { profile } from "@/data/profile";
import { useSystem } from "@/components/SystemProvider";

export default function Home() {
  const { tier } = useSystem();
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const duration = 7200; // Smooth 7.2s full container scan loop

    const tick = (now: number) => {
      const container = containerRef.current;
      const line = lineRef.current;
      const title = titleRef.current;
      const highlight = highlightRef.current;

      if (container && line && title && highlight) {
        const cRect = container.getBoundingClientRect();
        const tRect = title.getBoundingClientRect();

        const progress = (now % duration) / duration; // 0 to 1
        const lineY = progress * cRect.height;

        // Move the clean 1px horizontal laser line across entire container height
        line.style.transform = `translateY(${lineY}px)`;

        // Line Y position relative to title top
        const relY = lineY - (tRect.top - cRect.top);
        const titleH = tRect.height;

        if (relY <= 0) {
          // Line is above title: title highlight is hidden, base dim text shows
          highlight.style.clipPath = "inset(0 0 100% 0)";
          highlight.style.opacity = "1";
        } else if (relY > 0 && relY < titleH) {
          // Line is actively cutting through title: reveal top down to line precisely
          const clipBottom = Math.max(0, 100 - (relY / titleH) * 100);
          highlight.style.clipPath = `inset(0 0 ${clipBottom}% 0)`;
          highlight.style.opacity = "1";
        } else {
          // Line has passed title: fully revealed, then softly fades out as line moves to bottom
          highlight.style.clipPath = "inset(0 0 0% 0)";
          const distPast = relY - titleH;
          const fade = Math.max(0, 1 - distPast / 150);
          highlight.style.opacity = String(fade);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden select-none">
      {/* 3D Particle Bust Centered across both split halves */}
      <Hero3D />

      {/* LEFT SPLIT HALF (0 - 50% width) WITH GREY 5% OPACITY ROUNDED CONTAINER */}
      <div className="relative z-10 flex h-full w-full md:w-1/2 p-3 sm:p-4 md:p-6">
        <div
          ref={containerRef}
          className="relative flex h-full w-full flex-col justify-center rounded-2xl md:rounded-3xl border border-white/10 bg-neutral-500/5 px-6 py-12 md:px-12 backdrop-blur-sm shadow-2xl overflow-hidden"
        >
          {/* 1PX CLEAN HORIZONTAL SCANNER LINE IN ACTIVE THEME COLOR */}
          <div
            ref={lineRef}
            style={{
              top: 0,
              backgroundColor: "var(--accent)",
              boxShadow: "0 0 10px var(--accent)",
            }}
            className="pointer-events-none absolute left-0 right-0 h-px opacity-90 z-20 will-change-transform"
          />

          {/* SUBTLE CRT SCANLINE TEXTURE OVERLAY */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03] z-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* TITLE WRAPPER WITH PRECISE SCAN REVEAL */}
          <div ref={titleRef} className="relative">
            {/* BASE DIM TEXT (light/halka text in theme shade) */}
            <h1
              style={{ color: "var(--accent)" }}
              className="font-display text-[clamp(54px,7.8vw,118px)] uppercase leading-[0.88] tracking-tight opacity-20 select-none"
            >
              {profile.role.split(" ").map((w, i) => (
                <span key={i} className="block">
                  {w}
                </span>
              ))}
            </h1>

            {/* HIGHLIGHTED LAYER (revealed by scanner in full active theme color) */}
            <div
              ref={highlightRef}
              className="pointer-events-none absolute inset-0 select-none will-change-[clip-path,opacity]"
            >
              <h1
                style={{ color: "var(--accent)" }}
                className="font-display text-[clamp(54px,7.8vw,118px)] uppercase leading-[0.88] tracking-tight"
              >
                {profile.role.split(" ").map((w, i) => (
                  <span key={i} className="block">
                    {w}
                  </span>
                ))}
              </h1>
            </div>
          </div>

          {/* INFO_LOG SUBSECTION */}
          <div className="mt-8 font-mono">
            <div
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-80 mb-2"
              style={{ color: "var(--accent)" }}
            >
              <span
                className="inline-block h-px w-4"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <span>[ INFO_LOG ]</span>
            </div>
            <p className="max-w-xs text-[11px] uppercase leading-relaxed tracking-wider text-white/60">
              {profile.tagline || "Sculpting technical performance into immersive digital art."}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SPLIT HALF (50% - 100% width) */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 hidden md:flex w-1/2 flex-col justify-center px-10 lg:px-16 z-10">
        {/* INDEPENDENT DEVELOPER TELEMETRY HUD (NO CARD CONTAINER) */}
        <div className="pointer-events-auto ml-auto w-full max-w-xs font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              />
              DEVELOPER STATS
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-emerald-400 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LOADED
            </span>
          </div>

          {/* Progress Bars for Stats */}
          <div className="space-y-4 mb-6">
            <div className="group cursor-pointer">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-white/60 tracking-wider group-hover:text-white transition-colors">
                  PROJECTS_COMPLETED
                </span>
                <span
                  className="font-bold text-white transition-colors"
                  style={{ color: "var(--accent)" }}
                >
                  18+
                </span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full w-[85%] transition-all duration-500"
                  style={{ backgroundColor: "var(--accent)" }}
                />
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-white/60 tracking-wider group-hover:text-white transition-colors">
                  EXPERIENCE_YEARS
                </span>
                <span
                  className="font-bold text-white transition-colors"
                  style={{ color: "var(--accent)" }}
                >
                  3+
                </span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full w-[70%] transition-all duration-500"
                  style={{ backgroundColor: "var(--accent)" }}
                />
              </div>
            </div>
          </div>

          {/* Terminal telemetry details */}
          <div className="space-y-2 pt-4 border-t border-white/10 text-[10px] text-white/50 tracking-wider">
            <div className="flex items-center gap-1.5">
              <span style={{ color: "var(--accent)" }}>&gt;</span>
              <span>ACTIVE STACK: NEXT THREE GSAP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: "var(--accent)" }}>&gt;</span>
              <span>AVAILABILITY_TYPE: REMOTE/HYBRID</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: "var(--accent)" }}>&gt;</span>
              <span>STATUS: OPEN FOR OFFERS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: "var(--accent)" }}>&gt;</span>
              <span>
                SYSTEM_PERF: [{tier.toUpperCase()}]{" "}
                {tier === "high"
                  ? "120 FPS @ 1.0 DPR"
                  : tier === "medium"
                  ? "60 FPS @ 0.8 DPR"
                  : "30 FPS @ 0.6 DPR"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
