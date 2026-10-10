"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects as staticProjects, Project } from "@/data/projects";
import { fetchProjects } from "@/lib/projectsService";
import { useSystem } from "./SystemProvider";

export default function FisheyeList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { tier } = useSystem();

  useEffect(() => {
    fetchProjects(false)
      .then((data) => {
        setItems(data || []);
      })
      .catch((err) => {
        console.error("Failed to load projects:", err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Triple the list for seamless infinite loop scroll
  const displayProjects = [...items, ...items, ...items];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    let singleHeight = 0;
    let lastScrollY = container.scrollTop;
    let velocity = 0;

    const measure = () => {
      const firstRow = rowsRef.current[0];
      const middleFirst = rowsRef.current[items.length];
      if (firstRow && middleFirst) {
        singleHeight = middleFirst.offsetTop - firstRow.offsetTop;
        if (container.scrollTop === 0 && singleHeight > 0) {
          container.scrollTop = singleHeight;
          lastScrollY = singleHeight;
        }
      }
    };

    const timeout = setTimeout(measure, 60);
    window.addEventListener("resize", measure);

    // Infinite loop boundary wrap
    const onScroll = () => {
      if (singleHeight > 0) {
        if (container.scrollTop < singleHeight * 0.35) {
          container.scrollTop += singleHeight;
          lastScrollY = container.scrollTop;
        } else if (container.scrollTop > singleHeight * 1.85) {
          container.scrollTop -= singleHeight;
          lastScrollY = container.scrollTop;
        }
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });

    // 3D Fisheye Lens Transformation Loop driven by scroll velocity
    const updateFisheye = () => {
      if (!container) return;
      const vh = window.innerHeight;
      const centerY = vh / 2;

      // Measure scroll delta and compute velocity
      const currentScroll = container.scrollTop;
      const delta = Math.abs(currentScroll - lastScrollY);
      lastScrollY = currentScroll;

      // Update infinite progress indicator (0.0 to 1.0)
      if (singleHeight > 0) {
        const rawProg = (currentScroll % singleHeight) / singleHeight;
        const normalizedProg = rawProg < 0 ? rawProg + 1 : rawProg;
        setScrollProgress(normalizedProg);
      }

      // Velocity physics: instant attack on scroll, smooth spring decay on stop
      const targetVel = Math.min(delta / 14, 1);
      if (targetVel > velocity) {
        velocity += (targetVel - velocity) * 0.4;
      } else {
        velocity += (0 - velocity) * 0.085;
      }
      if (velocity < 0.002) velocity = 0;

      const factor = tier === "saver" ? 0 : velocity;

      rowsRef.current.forEach((row) => {
        if (!row) return;

        // WHEN AT REST (velocity === 0): Completely flat & normal horizontal layout
        if (factor === 0) {
          row.style.transform = "perspective(1000px) rotateX(0deg) scale(1) translateZ(0px)";
          row.style.opacity = "1";
          return;
        }

        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;

        // Normalized distance from center of screen (-1.0 to 1.0)
        const dist = (rowCenter - centerY) / (centerY * 0.75);
        const clampedDist = Math.max(-1.4, Math.min(1.4, dist));

        // Velocity-multiplied 3D Fisheye curve
        const rotateX = -clampedDist * 22 * factor;
        const scale = 1 - Math.pow(Math.abs(clampedDist), 1.25) * 0.15 * factor;
        const translateZ = -Math.pow(Math.abs(clampedDist), 1.2) * 80 * factor;
        const opacity = Math.max(0.2, 1 - Math.pow(Math.abs(clampedDist), 1.4) * 0.65 * factor);

        row.style.transform = `perspective(1000px) rotateX(${rotateX}deg) scale(${scale}) translateZ(${translateZ}px)`;
        row.style.opacity = String(opacity);
      });

      raf = requestAnimationFrame(updateFisheye);
    };

    raf = requestAnimationFrame(updateFisheye);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      container.removeEventListener("scroll", onScroll);
    };
  }, [items.length, tier]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center text-center p-6 space-y-3 select-none">
        <span className="font-mono text-xs text-white/40 tracking-widest animate-pulse">
          SYNCING DIRECTORY...
        </span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center text-center p-6 space-y-3 select-none">
        <div
          className="size-3 rounded-full border flex items-center justify-center"
          style={{
            borderColor: "var(--accent)",
            backgroundColor: "color-mix(in srgb, var(--accent) 25%, transparent)",
          }}
        >
          <span className="size-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
        </div>
        <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white">
          NO PROJECTS LISTED
        </h2>
        <p className="font-mono text-xs text-white/40 tracking-wider">
          [ DIRECTORY_EMPTY: NO PUBLISHED RECORDS FOUND ]
        </p>
      </div>
    );
  }

  return (
    <>
      {/* LEFT-SIDE VIRTUAL SCROLL TELEMETRY INDICATOR (NON-CLICKABLE, INFINITE LOOP) */}
      <div className="pointer-events-none fixed left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center select-none">
        <span className="text-[9px] font-mono text-white/30 mb-2.5">00</span>
        {/* Track Line */}
        <div
          ref={trackRef}
          className="relative w-px h-44 sm:h-56 md:h-64 bg-white/15"
        >
          {/* Active Thumb Pill that loops with infinite scroll progress */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-1 sm:w-1.5 h-6 rounded-full will-change-transform"
            style={{
              top: `${scrollProgress * 85}%`,
              backgroundColor: "var(--accent)",
              boxShadow: "0 0 12px var(--accent)",
            }}
          />
        </div>
        <span className="text-[9px] font-mono text-white/30 mt-2.5">100</span>
      </div>

      {/* CENTER PROJECT SCROLLER CONTAINER (FIXED VIEWPORT) */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-10 flex flex-col items-center overflow-y-auto no-scrollbar [mask-image:linear-gradient(to_bottom,transparent_0%,black_16%,black_84%,transparent_100%)] select-none pl-12 pr-6 md:pl-20 md:pr-12"
      >
        <div className="w-full max-w-6xl xl:max-w-7xl py-[36vh] space-y-0">
          {displayProjects.map((p, index) => {
            const itemNum = (index % items.length) + 1;

            return (
              <Link
                key={`${p.slug}-${index}`}
                href={`/projects/${p.slug}`}
                ref={(el) => {
                  rowsRef.current[index] = el;
                }}
                className="group block border-t border-white/10 py-8 md:py-10 transition-all will-change-transform hover:border-[var(--accent)]/40"
                style={{ transformOrigin: "center center" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 md:gap-8 font-mono">
                  {/* Left: Project Number, Title, Tags, Description */}
                  <div className="flex items-start gap-5 md:gap-8 flex-1 min-w-0">
                    <span
                      className="text-xs md:text-sm font-bold tracking-wider pt-1 shrink-0 transition-colors"
                      style={{
                        color: "var(--accent)",
                        textShadow: "0 0 12px color-mix(in srgb, var(--accent) 50%, transparent)",
                      }}
                    >
                      {String(itemNum).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0">
                      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white group-hover:text-[var(--accent)] transition-colors leading-[0.95]">
                        {p.title}
                      </h2>

                      <div className="mt-2.5 flex flex-wrap gap-2 text-[10px] md:text-[11px]">
                        {[p.type, ...p.tags].map((t) => (
                          <span
                            key={t}
                            className="rounded-full border px-3 py-0.5 text-white/80 transition-all font-mono group-hover:border-[var(--accent)] group-hover:text-white"
                            style={{
                              borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)",
                              backgroundColor: "color-mix(in srgb, var(--accent) 6%, transparent)",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <p className="mt-3 max-w-lg text-xs md:text-[12px] leading-relaxed text-white/50 font-mono whitespace-pre-line">
                        {p.summary}
                      </p>
                    </div>
                  </div>

                  {/* Right: Project Media Thumbnail Preview Frame */}
                  <div className="hidden sm:block shrink-0">
                    <div className="w-44 md:w-56 aspect-[16/10] rounded-xl border border-white/15 bg-neutral-900/70 overflow-hidden relative group-hover:border-[var(--accent)] transition-all shadow-xl">
                      {/* Grid background texture */}
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
                          backgroundSize: "16px 16px",
                        }}
                      />
                      {/* Telemetry info header */}
                      <div className="absolute top-2 left-2.5 right-2.5 flex justify-between items-center text-[8px] font-mono text-white/40">
                        <span>PROJECT_ID: 0{itemNum}</span>
                        <span
                          className="h-1.5 w-1.5 rounded-full animate-pulse"
                          style={{
                            backgroundColor: "var(--accent)",
                            boxShadow: "0 0 8px var(--accent)",
                          }}
                        />
                      </div>
                      {/* Project display label */}
                      <div className="absolute inset-0 flex items-center justify-center font-display text-2xl tracking-wider text-white/30 group-hover:text-white/90 group-hover:scale-105 transition-all">
                        {p.title.split(" ")[0]}
                      </div>
                      {/* CRT Scanline Overlay */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-25"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
