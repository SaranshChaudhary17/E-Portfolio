"use client";

import { useEffect, useState } from "react";
import { CinematicCard } from "@/components/cinematic-card";
import { SectionHeading } from "@/components/section-heading";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snap = await getDoc(doc(db, "cinematic_portfolio_data", "main"));
        if (snap.exists()) {
          setProjects(snap.data().projects || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="px-4 pb-24 pt-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.36fr]">
          <SectionHeading eyebrow="Project universe" title="My Projects" copy="A collection of products, tools, experiments, and storytelling interfaces built with polish and intent." />
          <aside className="glass rounded-[1.5rem] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-denim">Filter bank</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["All", "Web apps", "AI", "Brand", "Systems", "Creative"].map((filter) => (
                <span key={filter} className="rounded-full border border-parchment/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-parchment/75">{filter}</span>
              ))}
            </div>
          </aside>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.length > 0 ? (
            projects.map((project, index) => <CinematicCard key={project.id || project.slug} project={project} index={index} />)
          ) : (
            <p className="text-parchment/60 col-span-full">No projects found. Add them from the Command Center.</p>
          )}
        </div>
      </div>
    </section>
  );
}
