"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import type { Project } from "@/data/projects";

interface Props {
  project: Project;
  next: Project;
}

export default function ProjectDetailView({ project, next }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Slideshow state
  const slideshowImages: string[] = (project as any).objectivesSlideshow || [];
  const [slideshowIdx, setSlideshowIdx] = useState(0);

  useEffect(() => {
    if (slideshowImages.length <= 1) return;
    const interval = setInterval(() => {
      setSlideshowIdx((prev) => (prev + 1) % slideshowImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  // Horizontal Gallery Drag-to-Scroll State
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = galleryScrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = galleryScrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeft - walk;
  };

  const scrollGallery = (direction: "left" | "right") => {
    const el = galleryScrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -380 : 380;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Track page scroll percentage and scroll state
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        setScrollProgress(pct);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleArrowPress = (direction: string) => {
    setActiveKey(direction);
    setTimeout(() => setActiveKey(null), 250);
    if (direction === "up") {
      window.scrollBy({ top: -450, behavior: "smooth" });
    } else if (direction === "down") {
      window.scrollBy({ top: 450, behavior: "smooth" });
    }
  };

  const accent = project.accentColor || "var(--accent)";

  return (
    <div
      className="relative min-h-screen text-[#e6e6e6] font-mono selection:bg-white selection:text-black"
      style={{ "--project-accent": accent } as React.CSSProperties}
    >
      {/* 1. FIXED TOP-RIGHT HEADER (SCROLL-SHRINK + NEGATIVE INVERSION BLEND) */}
      <div className="fixed top-6 md:top-8 right-6 md:right-12 xl:right-16 z-50 flex flex-col items-end pointer-events-none mix-blend-difference text-white select-none">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className={`flex items-center gap-2 uppercase tracking-widest text-white/85 transition-all duration-300 pointer-events-auto ${
            isScrolled
              ? "text-[11px] md:text-xs mb-1.5 opacity-80"
              : "text-xs md:text-[13px] mb-2.5 md:mb-3 opacity-95"
          }`}
        >
          <Link href="/" className="hover:opacity-100 transition-opacity">
            HOME
          </Link>
          <span>/</span>
          <Link href="/projects" className="hover:opacity-100 transition-opacity">
            PROJECTS
          </Link>
          <span>/</span>
          <span className="font-bold">{project.title.toUpperCase()}</span>
        </nav>

        {/* Back Button + Title */}
        <div className="flex items-center gap-3 md:gap-4 text-right pointer-events-auto">
          <Link
            href="/projects"
            className={`flex items-center justify-center rounded-lg border border-white/70 text-white hover:border-white hover:bg-white/10 transition-all duration-300 ${
              isScrolled ? "size-8 md:size-9.5" : "size-10 md:size-12"
            }`}
            aria-label="Back to Projects"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className={isScrolled ? "size-4 md:size-4.5" : "size-4.5 md:size-5.5"}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
          </Link>
          <h1
            className={`font-display uppercase leading-none tracking-tight text-white transition-all duration-300 ease-out origin-right ${
              isScrolled
                ? "text-[clamp(32px,4.5vw,52px)]"
                : "text-[clamp(46px,7.8vw,110px)]"
            }`}
          >
            {project.title}
          </h1>
        </div>
      </div>

      {/* 2. PROJECT HERO (OVERVIEW & DOSSIER) */}
      <section className="px-6 md:px-12 xl:px-16 w-full pt-36 md:pt-48 xl:pt-52 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-start w-full">
          {/* Left Column: Overview, Rights, Live Btn, Arrow Keys */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-7">
            <div>
              <h2
                className="text-xs uppercase tracking-widest font-bold border-b pb-2 mb-4 inline-block"
                style={{ color: "var(--accent)", borderColor: "var(--accent)" }}
              >
                Project Overview
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-white/85 max-w-3xl xl:max-w-4xl whitespace-pre-line">
                {project.summary}
              </p>
            </div>

            {project.rights && (
              <p className="text-xs italic text-white/50 tracking-wide font-sans">
                {project.rights}
              </p>
            )}

            {/* Action Button */}
            <div className="pt-2">
              {project.isComingSoon ? (
                <div
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border bg-white/[0.03] text-xs font-bold uppercase tracking-wider backdrop-blur-sm cursor-default"
                  style={{ borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)" }}
                >
                  <span style={{ color: "var(--accent)" }}>Coming Soon</span>
                  <div
                    className="size-6 rounded-md flex items-center justify-center font-bold text-black"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    ↗
                  </div>
                </div>
              ) : (
                <a
                  href={project.live || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border bg-white/[0.04] text-xs font-bold uppercase tracking-wider hover:bg-white/[0.08] transition-all backdrop-blur-sm"
                  style={{ borderColor: "color-mix(in srgb, var(--accent) 50%, transparent)" }}
                >
                  <span style={{ color: "var(--accent)" }}>Live Site</span>
                  <div
                    className="size-6 rounded-md flex items-center justify-center font-bold text-black"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    ↗
                  </div>
                </a>
              )}
            </div>

            {/* HUD Arrow D-Pad Keys */}
            <div className="pt-4 flex flex-col items-start gap-1">
              <div className="flex justify-center w-28">
                <button
                  type="button"
                  onClick={() => handleArrowPress("up")}
                  className={`size-8 rounded border flex items-center justify-center text-[10px] transition-all ${
                    activeKey === "up"
                      ? "border-transparent text-black"
                      : "border-white/20 bg-white/[0.02] text-white/70 hover:border-white/50"
                  }`}
                  style={activeKey === "up" ? { backgroundColor: "var(--accent)", color: "#000" } : {}}
                  aria-label="Scroll Up"
                >
                  ▲
                </button>
              </div>
              <div className="flex gap-1 w-28 justify-center">
                <button
                  type="button"
                  onClick={() => handleArrowPress("left")}
                  className={`size-8 rounded border flex items-center justify-center text-[10px] transition-all ${
                    activeKey === "left"
                      ? "border-transparent text-black"
                      : "border-white/20 bg-white/[0.02] text-white/70 hover:border-white/50"
                  }`}
                  style={activeKey === "left" ? { backgroundColor: "var(--accent)", color: "#000" } : {}}
                  aria-label="Previous"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={() => handleArrowPress("down")}
                  className={`size-8 rounded border flex items-center justify-center text-[10px] transition-all ${
                    activeKey === "down"
                      ? "border-transparent text-black"
                      : "border-white/20 bg-white/[0.02] text-white/70 hover:border-white/50"
                  }`}
                  style={activeKey === "down" ? { backgroundColor: "var(--accent)", color: "#000" } : {}}
                  aria-label="Scroll Down"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => handleArrowPress("right")}
                  className={`size-8 rounded border flex items-center justify-center text-[10px] transition-all ${
                    activeKey === "right"
                      ? "border-transparent text-black"
                      : "border-white/20 bg-white/[0.02] text-white/70 hover:border-white/50"
                  }`}
                  style={activeKey === "right" ? { backgroundColor: "var(--accent)", color: "#000" } : {}}
                  aria-label="Next"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dossier Metadata */}
          <div className="lg:col-span-5 space-y-6 lg:text-right">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
              <div>
                <span
                  className="text-[10px] uppercase tracking-wider block mb-1 font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  PROJECT_TYPE
                </span>
                <span className="text-white font-bold">{project.type}</span>
              </div>
              <div>
                <span
                  className="text-[10px] uppercase tracking-wider block mb-1 font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  ENTRY_YEAR
                </span>
                <span className="text-white font-bold">{project.year}</span>
              </div>
              <div>
                <span
                  className="text-[10px] uppercase tracking-wider block mb-1 font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  TARGET_PLATFORM
                </span>
                <span className="text-white font-bold">{project.platform}</span>
              </div>
              <div>
                <span
                  className="text-[10px] uppercase tracking-wider block mb-1 font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  PRIMARY_ROLE
                </span>
                <span className="text-white font-bold">{project.role}</span>
              </div>
            </div>

            {/* Deployed Technologies */}
            <div className="pt-2">
              <span
                className="text-[10px] uppercase tracking-widest block mb-3 font-bold"
                style={{ color: "var(--accent)" }}
              >
                DEPLOYED_TECHNOLOGIES
              </span>
              <div className="flex flex-wrap lg:justify-end gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-[11px] uppercase tracking-wider rounded border transition-colors font-mono"
                    style={{
                      borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
                      color: "var(--accent)",
                      backgroundColor: "color-mix(in srgb, var(--accent) 6%, transparent)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            {project.colors && project.colors.length > 0 && (
              <div className="pt-2">
                <span
                  className="text-[10px] uppercase tracking-widest block mb-2 font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  COLOR_PALETTE
                </span>
                <div className="flex lg:justify-end gap-2">
                  {project.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="size-5 rounded border border-white/20 shadow-inner"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. MARQUEE TICKER DIVIDER */}
      <div className="w-full overflow-hidden border-y border-white/10 bg-black/40 py-3 backdrop-blur-sm">
        <div className="flex whitespace-nowrap animate-ticker text-xs tracking-[0.3em] uppercase text-white/50">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="mx-6">
              <span style={{ color: "var(--accent)" }}>{project.title}</span> &nbsp;•&nbsp; ARCHIVE_REF: {project.archiveRef}
            </span>
          ))}
        </div>
      </div>

      {/* 4. PROJECT WALKTHROUGH & PAGE INDEX HEADER */}
      <section className="px-6 md:px-12 xl:px-16 w-full pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-white/10 pb-10 w-full">
          <div className="lg:col-span-8">
            <h2 className="font-display text-[clamp(40px,6vw,96px)] uppercase leading-none tracking-tight mb-4">
              <span className="text-white">Project </span>
              <span style={{ color: "var(--accent)" }}>Walkthrough</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-white/70 max-w-3xl xl:max-w-4xl">
              A closer look at the finer details of this case study. Explore the core features,
              thoughtful design decisions, and interactive moments that shape the user experience.
            </p>
          </div>

          <div className="lg:col-span-4 lg:text-right">
            <span
              className="text-[10px] uppercase tracking-widest block mb-2 font-bold"
              style={{ color: "var(--accent)" }}
            >
              [ PAGE_INDEX ]
            </span>
            <ul className="space-y-1.5 text-xs text-white/70">
              {project.pageIndex.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-[var(--accent)] transition-colors text-left lg:text-right"
                  >
                    {item.num} // {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. SHOWCASE SECTION 01: SYSTEM OBJECTIVES */}
      <section id="objectives" className="px-6 md:px-12 xl:px-16 w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-center w-full">
          {/* Media Card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/60 shadow-2xl group hover:border-[var(--accent)]/50 transition-colors">
              {/* Scanline overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:16px_16px] z-10 opacity-60" />

              {/* HUD readout bracket */}
              <div
                className="absolute top-4 left-4 z-20 text-[10px] font-mono tracking-widest bg-black/75 px-2.5 py-1 rounded border backdrop-blur-md"
                style={{
                  borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)",
                  color: "var(--accent)",
                }}
              >
                [ ARCHIVE_REF: {project.objectives.media.ref} ]
              </div>

              {/* Multi-mode Walkthrough Media */}
              {slideshowImages.length > 0 ? (
                <div className="relative w-full aspect-video overflow-hidden">
                  {slideshowImages.map((src, i) => (
                    <img
                      key={src + i}
                      src={src}
                      alt={`Slide ${i + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                        i === slideshowIdx ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                  {slideshowImages.length > 1 && (
                    <div className="absolute bottom-3 right-3 z-20 flex gap-1.5 bg-black/70 px-2 py-1 rounded-full backdrop-blur-md">
                      {slideshowImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSlideshowIdx(i)}
                          className={`size-1.5 rounded-full transition-all ${
                            i === slideshowIdx
                              ? "w-4 bg-white"
                              : "bg-white/40 hover:bg-white/70"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : project.objectives.media.type === "video" ? (
                <video
                  src={project.objectives.media.src}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <img
                  src={project.objectives.media.src}
                  alt={project.objectives.title}
                  className="w-full aspect-video object-cover"
                />
              )}
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span
                className="size-3 rounded-full border flex items-center justify-center"
                style={{
                  borderColor: "var(--accent)",
                  backgroundColor: "color-mix(in srgb, var(--accent) 25%, transparent)",
                }}
              >
                <span className="size-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
              </span>
              <h3
                className="text-base uppercase tracking-wider font-bold"
                style={{ color: "var(--accent)" }}
              >
                {project.objectives.title}
              </h3>
            </div>
            <div
              className="h-px w-full"
              style={{ backgroundColor: "color-mix(in srgb, var(--accent) 30%, transparent)" }}
            />
            <p className="text-sm md:text-base leading-relaxed text-white/75 whitespace-pre-line">
              {project.objectives.text}
            </p>
          </div>
        </div>
      </section>

      {/* 6. SHOWCASE SECTION 02: INTERACTIVE GALLERY */}
      <section id="gallery" className="px-6 md:px-12 xl:px-16 w-full py-16">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="size-3 rounded-full border flex items-center justify-center"
              style={{
                borderColor: "var(--accent)",
                backgroundColor: "color-mix(in srgb, var(--accent) 25%, transparent)",
              }}
            >
              <span className="size-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
            </span>
            <h3
              className="text-base uppercase tracking-wider font-bold"
              style={{ color: "var(--accent)" }}
            >
              Interactive Gallery
            </h3>
          </div>

          {/* Left/Right scroll buttons for interactive gallery */}
          {project.gallery.devices && project.gallery.devices.length > 3 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollGallery("left")}
                className="size-8 rounded-lg border border-white/20 bg-black/60 hover:border-white/50 text-white flex items-center justify-center text-xs transition-colors"
                title="Scroll Left"
              >
                ←
              </button>
              <button
                onClick={() => scrollGallery("right")}
                className="size-8 rounded-lg border border-white/20 bg-black/60 hover:border-white/50 text-white flex items-center justify-center text-xs transition-colors"
                title="Scroll Right"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Responsive Device Mockups (Horizontally Scrollable & Draggable) */}
        <div className="relative w-full mb-16">
          <div
            ref={galleryScrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex gap-6 lg:gap-8 xl:gap-10 overflow-x-auto pb-6 pt-2 select-none cursor-grab active:cursor-grabbing scroll-smooth no-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {project.gallery.devices.map((device, idx) => (
              <div
                key={idx}
                className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 relative rounded-3xl overflow-hidden border border-white/20 bg-black/80 p-2 shadow-2xl hover:border-[var(--accent)] transition-all duration-300"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[9/18] bg-black">
                  {device.type === "video" ? (
                    <video
                      src={device.src}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={device.src}
                      alt={device.title || `Device preview ${idx + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  )}
                  {device.title && (
                    <div className="absolute bottom-3 left-3 right-3 text-center text-[10px] tracking-widest uppercase bg-black/75 py-1 rounded backdrop-blur-md border border-white/10 text-white/90">
                      <span style={{ color: "var(--accent)" }}>{device.title}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 7. SHOWCASE SECTION 03: EXECUTION PROTOCOL */}
      <section id="execution" className="px-6 md:px-12 xl:px-16 w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-center mb-16 w-full">
          {/* Narrative & Stats Content */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <span
                className="size-3 rounded-full border flex items-center justify-center"
                style={{
                  borderColor: "var(--accent)",
                  backgroundColor: "color-mix(in srgb, var(--accent) 25%, transparent)",
                }}
              >
                <span className="size-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
              </span>
              <h3
                className="text-base uppercase tracking-wider font-bold"
                style={{ color: "var(--accent)" }}
              >
                {project.execution.title}
              </h3>
            </div>
            <div
              className="h-px w-full"
              style={{ backgroundColor: "color-mix(in srgb, var(--accent) 30%, transparent)" }}
            />
            <p className="text-sm md:text-base leading-relaxed text-white/75 whitespace-pre-line">
              {project.execution.text}
            </p>

            {/* Key Metrics / Stats */}
            {project.stats && project.stats.length > 0 && (
              <div
                className="pt-4 grid grid-cols-3 gap-4 border-t"
                style={{ borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)" }}
              >
                {project.stats.map((st, idx) => (
                  <div key={idx} className="space-y-1">
                    <div
                      className="font-display text-2xl md:text-3xl font-bold leading-none"
                      style={{ color: "var(--accent)" }}
                    >
                      {st.value}
                    </div>
                    <div className="text-[10px] leading-tight text-white/50 tracking-wider">
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Media Card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/60 shadow-2xl group hover:border-[var(--accent)]/50 transition-colors">
              <div
                className="absolute top-4 left-4 z-20 text-[10px] font-mono tracking-widest bg-black/75 px-2.5 py-1 rounded border backdrop-blur-md"
                style={{
                  borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)",
                  color: "var(--accent)",
                }}
              >
                [ ARCHIVE_REF: {project.execution.media.ref} ]
              </div>
              {project.execution.media.type === "video" ? (
                <video
                  src={project.execution.media.src}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <img
                  src={project.execution.media.src}
                  alt={project.execution.title}
                  className="w-full aspect-video object-cover"
                />
              )}
            </div>
          </div>
        </div>


      </section>

      {/* 8. NEXT PROJECT TEASER BANNER */}
      <section className="px-6 md:px-12 xl:px-16 w-full pt-16 pb-36 border-t border-white/15">
        <Link
          href={`/projects/${next.slug}`}
          className="group block w-full rounded-2xl border border-white/15 bg-black/40 p-8 md:p-12 xl:p-16 hover:border-[var(--accent)]/50 transition-all backdrop-blur-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
                {next.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded border"
                    style={{
                      borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)",
                      color: "var(--accent)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div
                className="text-[10px] uppercase tracking-widest font-bold"
                style={{ color: "var(--accent)" }}
              >
                Next Project
              </div>
              <h3 className="font-display text-[clamp(36px,5.5vw,72px)] uppercase leading-none text-white group-hover:text-[var(--accent)] transition-colors">
                {next.title}
              </h3>
              <p className="text-xs md:text-sm text-white/70 max-w-xl line-clamp-2">
                {next.summary}
              </p>
            </div>

            <div className="md:col-span-4">
              <div className="relative rounded-xl overflow-hidden border border-white/15 aspect-video bg-black/60 group-hover:scale-102 group-hover:border-[var(--accent)]/40 transition-all">
                <img
                  src={next.banner?.img || "/images/projects/rotana/hero_preview.jpg"}
                  alt={next.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* 9. FLOATING SCROLL TELEMETRY PROGRESS BAR (STICKY BOTTOM) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/20 bg-black/80 backdrop-blur-md shadow-2xl text-[10px] font-mono tracking-widest text-white/70">
          <span>00</span>
          <div className="relative w-36 md:w-56 h-1 bg-white/15 rounded-full overflow-hidden">
            {/* Ticks at 25%, 50%, 75% */}
            <div className="absolute left-[25%] top-0 bottom-0 w-px bg-white/30" />
            <div className="absolute left-[50%] top-0 bottom-0 w-px bg-white/30" />
            <div className="absolute left-[75%] top-0 bottom-0 w-px bg-white/30" />
            {/* Pointer fill with active theme color */}
            <div
              className="absolute top-0 bottom-0 left-0 transition-[width] duration-75"
              style={{
                width: `${scrollProgress}%`,
                backgroundColor: "var(--accent)",
                boxShadow: "0 0 10px var(--accent)",
              }}
            />
          </div>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
