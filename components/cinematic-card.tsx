"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Globe, Code2 } from "lucide-react";
import { Project } from "@/data/projects";

export function CinematicCard({ project, index }: { project: Project | any; index: number }) {
  const Icon = project.icon || Code2;

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group glass overflow-hidden rounded-[1.4rem]"
    >
      <div className="relative min-h-52 overflow-hidden border-b border-parchment/10 p-5">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(232,117,26,0.38),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(169,196,218,0.22),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
        )}
        <div className="absolute inset-x-6 bottom-7 h-20 rounded-full bg-ember/20 blur-3xl transition duration-500 group-hover:bg-ember/40" />
        <div className="relative flex h-full min-h-40 flex-col justify-between z-10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-parchment/65 drop-shadow-md">0{index + 1}</span>
            <span className="rounded-full border border-parchment/15 bg-black/50 backdrop-blur-sm px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-denim">{project.category}</span>
          </div>
          {!project.thumbnail && <Icon className="h-14 w-14 text-ember drop-shadow-[0_0_24px_rgba(232,117,26,0.65)]" />}
        </div>
      </div>
      <div className="p-5 md:p-6">
        <h3 className="font-display text-2xl font-black uppercase text-pearl">{project.title}</h3>
        <p className="mt-3 min-h-20 text-sm leading-6 text-parchment/75">{project.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {(project.tech || []).slice(0, 4).map((tech: string) => (
            <span key={tech} className="rounded-full border border-parchment/15 bg-white/5 px-3 py-1 text-xs text-parchment/75">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-denim">{project.year}</span>
          
          <div className="flex items-center gap-3">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-parchment/70 hover:text-white hover:bg-white/10 transition" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-parchment/70 hover:text-white hover:bg-white/10 transition" aria-label="Live Site">
                <Globe className="h-5 w-5" />
              </a>
            )}
            <Link href={`/projects/${project.slug}`} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ember text-white shadow-glow transition group-hover:scale-105" aria-label={`Open ${project.title}`}>
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
