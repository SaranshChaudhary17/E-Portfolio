"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { portfolioData, Project } from "@/lib/portfolioData";

export default function ProjectDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    portfolioData.getProjects().then(all => {
      const found = all.find((p) => p.slug === slug) ?? null;
      setProject(found);
    });
  }, [slug]);

  // Fallback title from slug while loading
  const fallbackTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const title = project?.title ?? fallbackTitle;
  const description = project?.description ?? "A deep dive into the development, design, and architecture of this cinematic experience.";
  const techStack = project?.techStack?.join(", ") ?? "Next.js, Tailwind, Framer Motion, GSAP";
  const liveUrl = project?.liveUrl ?? null;
  const githubUrl = project?.githubUrl ?? null;

  return (
    <div className="min-h-screen w-full relative">
      <div className="absolute inset-0 h-[60vh] -z-10 bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E8751A] via-transparent to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <Link
          href="/projects"
          className="text-[#7FA1BE] hover:text-[#E8751A] transition-colors text-sm uppercase tracking-widest flex items-center gap-2 mb-12"
        >
          &larr; Back to Projects
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-sm font-semibold text-[#E8751A] tracking-widest uppercase">
            {project?.type ?? "Case Study"}
          </span>
          <h1 className="mt-4 text-5xl md:text-7xl font-heading font-bold text-[#F4F2EE] tracking-tighter">
            {title}
          </h1>
          <p className="mt-6 text-xl text-[#A9C4DA] max-w-3xl leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-b border-[#333] py-10"
        >
          <div>
            <h3 className="text-sm font-bold text-[#7FA1BE] uppercase tracking-wider mb-2">Role</h3>
            <p className="text-[#F4F2EE]">Lead Developer &amp; Designer</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#7FA1BE] uppercase tracking-wider mb-2">Tech Stack</h3>
            <p className="text-[#F4F2EE]">{techStack}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#7FA1BE] uppercase tracking-wider mb-2">Links</h3>
            <div className="flex gap-4 flex-wrap">
              {liveUrl ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E8751A] hover:text-[#B85A12] transition-colors underline underline-offset-4"
                >
                  Live Site ↗
                </a>
              ) : (
                <span className="text-[#444] line-through text-sm">Live Site</span>
              )}
              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F4F2EE] hover:text-[#A9C4DA] transition-colors underline underline-offset-4"
                >
                  GitHub ↗
                </a>
              ) : (
                <span className="text-[#444] line-through text-sm">GitHub</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tech stack chips */}
        {project?.techStack && project.techStack.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-1.5 rounded-full border border-[#333] bg-[#111] text-[#A9C4DA] text-sm hover:border-[#E8751A] hover:text-[#E8751A] transition-colors"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        )}

        {/* Body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 prose prose-invert max-w-none"
        >
          <h2 className="text-3xl font-heading font-bold text-[#F4F2EE]">Project Overview</h2>
          <p className="text-[#A9C4DA] text-lg mt-4 leading-relaxed">
            {description}
          </p>

          {/* Showcase Slideshow */}
          {project?.galleryUrls && project.galleryUrls.length > 0 ? (
            <div className="mt-12 flex overflow-x-auto gap-6 snap-x snap-mandatory pb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {project.galleryUrls.map((url, idx) => (
                <div key={idx} className="shrink-0 w-full md:w-[85%] aspect-video snap-center rounded-2xl overflow-hidden border border-[#333] relative shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Gallery slide ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 w-full aspect-video bg-[#1A1A1A] border border-[#333] rounded-2xl flex items-center justify-center">
              <span className="text-[#7FA1BE]">Cinematic Showcase Reel</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
