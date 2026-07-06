"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { portfolioData, Project } from "@/lib/portfolioData";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    portfolioData.getProjects().then(setProjects);
  }, []);

  return (
    <div className="min-h-screen w-full px-6 py-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-[#F4F2EE] uppercase tracking-tighter">
          Projects <span className="text-[#E8751A]">Universe</span>
        </h1>
        <p className="mt-4 text-[#A9C4DA] max-w-2xl text-lg">
          A collection of cinematic web experiences, robust platforms, and creative tools.
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <Link href={`/projects/${project.slug}`} key={project.slug}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-[#1A1A1A]/50 border border-[#333] hover:border-[#E8751A]/50 transition-colors cursor-pointer"
            >
              <div className="relative h-64 w-full bg-[#222] overflow-hidden">
                {project.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.thumbnailUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] group-hover:scale-105 transition-transform duration-700" />
                )}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[#E8751A]/10 transition-opacity duration-700" />
                {project.featured && (
                  <div className="absolute top-4 left-4 bg-[#E8751A] text-[#0D0D0D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Featured
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-[#0D0D0D]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-[#E7DDD2] border border-[#333]">
                  View Project
                </div>
              </div>

              <div className="p-6 pt-0">
                <span className="text-xs font-semibold text-[#E8751A] tracking-wider uppercase">{project.type}</span>
                <h2 className="text-2xl font-bold text-[#F4F2EE] mt-2 group-hover:text-[#E7DDD2] transition-colors">{project.title}</h2>
                {project.description && (
                  <p className="text-sm text-[#7FA1BE] mt-2 line-clamp-2">{project.description}</p>
                )}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.techStack.slice(0, 4).map(t => (
                      <span key={t} className="text-xs px-2 py-1 rounded-full border border-[#333] text-[#7FA1BE]">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
