"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";

// Lazy-load the heavy 3D scene only on the client — never compiled server-side
const Scene = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });

const teaserSections = [
  {
    id: "projects",
    label: "01 — Projects",
    title: "Engineered Experiences",
    description: "Full-stack apps, interactive tools, and production-grade systems built with precision.",
    href: "/projects",
    cta: "View Projects",
    accent: "#E8751A",
  },
  {
    id: "videos",
    label: "02 — Videos",
    title: "Cinematic Edits",
    description: "Motion design, video editing, and visual storytelling crafted frame by frame.",
    href: "/videos",
    cta: "Watch Reels",
    accent: "#7FA1BE",
  },
  {
    id: "gallery",
    label: "03 — Gallery",
    title: "Visual Archive",
    description: "Photography and creative direction — a curated lens on design and motion.",
    href: "/gallery",
    cta: "Enter Gallery",
    accent: "#A9C4DA",
  },
];

export default function Home() {
  const scrollToSections = () => {
    const el = document.getElementById("content-sections");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center">
        {/* 3D Canvas - positioned only within hero */}
        <Scene />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="z-10 text-center px-6"
        >
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-heading font-bold tracking-tighter text-[#F4F2EE] uppercase"
          >
            Creative <br /> <span className="text-[#E8751A]">Developer</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="mt-6 text-lg md:text-xl text-[#A9C4DA] max-w-2xl mx-auto"
          >
            Building cinematic web experiences, futuristic interfaces, and interactive 3D environments.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/projects"
              className="px-8 py-4 rounded-full bg-[#E8751A] text-[#0D0D0D] font-bold tracking-wide hover:bg-[#B85A12] transition-colors"
            >
              Explore Universe
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full border border-[#E8751A]/50 text-[#F4F2EE] hover:bg-[#E8751A]/10 transition-colors"
            >
              Initiate Contact
            </Link>
          </motion.div>
        </motion.div>

        {/* Cinematic Scroll Indicator — clickable, scrolls to next section */}
        <motion.button
          onClick={scrollToSections}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
          aria-label="Scroll to content"
        >
          <span className="text-xs tracking-widest text-[#7FA1BE] uppercase group-hover:text-[#E8751A] transition-colors duration-300">
            Scroll
          </span>
          <motion.div
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-[#7FA1BE] to-transparent group-hover:from-[#E8751A]"
          />
        </motion.button>
      </section>

      {/* ─── Content Teaser Sections ─── */}
      <div id="content-sections" className="relative z-10 bg-[#0D0D0D]">

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent" />

        {teaserSections.map((section, index) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
            className="min-h-[60vh] flex items-center px-6 py-24 max-w-7xl mx-auto"
          >
            <div className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 w-full`}>
              {/* Text content */}
              <div className="flex-1 space-y-6">
                <span className="text-xs font-mono tracking-widest" style={{ color: section.accent }}>
                  {section.label}
                </span>
                <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-[#F4F2EE]">
                  {section.title}
                </h2>
                <p className="text-lg text-[#7FA1BE] max-w-lg leading-relaxed">
                  {section.description}
                </p>
                <Link
                  href={section.href}
                  className="inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase transition-all duration-300 group"
                  style={{ color: section.accent }}
                >
                  {section.cta}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
                </Link>
              </div>

              {/* Decorative animated box */}
              <div className="flex-1 flex justify-center">
                <motion.div
                  animate={{
                    rotate: [0, 3, -3, 0],
                    scale: [1, 1.02, 0.98, 1],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-64 h-64 md:w-80 md:h-80 rounded-2xl border flex items-center justify-center"
                  style={{
                    borderColor: `${section.accent}30`,
                    background: `radial-gradient(ellipse at center, ${section.accent}08 0%, transparent 70%)`,
                  }}
                >
                  <div
                    className="w-24 h-24 rounded-xl border-2 rotate-45"
                    style={{ borderColor: `${section.accent}60` }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.section>
        ))}

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="py-32 px-6 text-center border-t border-[#1a1a1a]"
        >
          <p className="text-xs font-mono tracking-widest text-[#7FA1BE] mb-4 uppercase">Ready to Connect?</p>
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-[#F4F2EE] mb-8">
            Let&apos;s Build Something <span className="text-[#E8751A]">Extraordinary.</span>
          </h2>
          <Link
            href="/contact"
            className="inline-block px-10 py-5 rounded-full bg-[#E8751A] text-[#0D0D0D] font-bold tracking-wide text-lg hover:bg-[#B85A12] transition-colors"
          >
            Start a Conversation
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
