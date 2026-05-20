"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Star, Code2, Loader2 } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<any>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const snap = await getDoc(doc(db, "cinematic_portfolio_data", "main"));
        if (snap.exists()) {
          const data = snap.data();
          const projs = data.projects || [];
          setAllProjects(projs);
          const current = projs.find((p: any) => p.slug === params.slug);
          setProject(current);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.slug]);

  if (loading) {
    return (
      <section className="px-4 py-32 md:px-8 flex justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-ember" />
      </section>
    );
  }

  if (!project) {
    return (
      <section className="px-4 py-24 md:px-8">
        <div className="glass mx-auto max-w-3xl rounded-[1.5rem] p-8">
          <h1 className="font-display text-4xl font-black uppercase text-pearl">Project not found</h1>
          <Link href="/projects" className="mt-6 inline-flex text-ember">Return to projects</Link>
        </div>
      </section>
    );
  }

  const Icon = project.icon || Code2;
  const index = allProjects.findIndex((item) => item.slug === project.slug);
  const previous = allProjects[(index - 1 + allProjects.length) % allProjects.length] || project;
  const next = allProjects[(index + 1) % allProjects.length] || project;

  return (
    <article className="px-4 pb-24 pt-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/projects" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-denim hover:text-ember">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>
        <section className="glass relative overflow-hidden rounded-[2rem] p-6 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(232,117,26,0.28),transparent_25%),radial-gradient(circle_at_92%_80%,rgba(169,196,218,0.18),transparent_28%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[0.82fr_1fr]">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-denim">{project.category || "Project"}</p>
              <h1 className="font-display text-5xl font-black uppercase leading-[0.9] text-pearl md:text-7xl">
                {project.title.split(" ").slice(0, -1).join(" ")} <span className="orange-text block">{project.title.split(" ").slice(-1)}</span>
              </h1>
              {project.tagline && <p className="mt-6 text-lg leading-8 text-parchment/82">{project.tagline}</p>}
              <div className="mt-8 flex flex-wrap gap-3">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer">
                    <Button>View on GitHub <Github className="h-4 w-4 ml-2" /></Button>
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">
                    <Button variant="secondary">Live demo <ExternalLink className="h-4 w-4 ml-2" /></Button>
                  </a>
                )}
              </div>
            </div>
            <div className="min-h-80 rounded-[1.5rem] border border-parchment/12 bg-black/30 p-6 flex flex-col justify-between overflow-hidden relative">
              {project.thumbnail ? (
                <>
                  <img src={project.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </>
              ) : null}
              <div className="flex items-center justify-between relative z-10">
                <Icon className="h-16 w-16 text-ember drop-shadow-[0_0_26px_rgba(232,117,26,0.55)]" />
                <Star className="h-6 w-6 text-denim" />
              </div>
              <p className="mt-8 text-sm leading-7 text-parchment/72 relative z-10">{project.summary}</p>
            </div>
          </div>
        </section>

        {project.galleryUrls && project.galleryUrls.length > 0 && (
          <section className="mt-6">
             <h2 className="font-display text-2xl font-black uppercase text-pearl mb-4">Project Gallery <span className="text-ember">//</span></h2>
             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {project.galleryUrls.map((url: string, i: number) => (
                 <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-parchment/10 bg-black/40 relative group">
                   <img src={url} alt={`Gallery image ${i+1}`} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                 </div>
               ))}
             </div>
          </section>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="glass rounded-[1.5rem] p-6">
            <h2 className="font-display text-2xl font-black uppercase text-pearl">Overview <span className="text-ember">//</span></h2>
            <p className="mt-4 leading-7 text-parchment/75">{project.summary}</p>
            {project.features && project.features.length > 0 && (
              <div className="mt-6 space-y-3">
                {project.features.map((feature: string) => (
                  <div key={feature} className="flex gap-3 text-sm text-parchment/78">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ember shadow-glow" /> {feature}
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="glass rounded-[1.5rem] p-6">
            <h2 className="font-display text-2xl font-black uppercase text-pearl">Project Preview <span className="text-ember">//</span></h2>
            <div className="mt-5 grid min-h-72 place-items-center rounded-[1.25rem] border border-parchment/12 overflow-hidden relative">
              {project.thumbnail ? (
                <img src={project.thumbnail} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(232,117,26,0.28),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]"></div>
              )}
              {!project.thumbnail && (
                <div className="text-center relative z-10 p-6">
                  <Icon className="mx-auto h-20 w-20 text-ember" />
                  <p className="mt-5 font-display text-3xl font-black uppercase text-pearl">{project.title}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="glass mt-6 rounded-[1.5rem] p-6">
          <h2 className="font-display text-2xl font-black uppercase text-pearl">Tech stack <span className="text-ember">//</span></h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {(project.tech || []).map((tech: string) => (
              <span key={tech} className="rounded-full border border-parchment/15 bg-white/5 px-4 py-2 text-sm text-parchment/78 hover:border-ember hover:text-white transition cursor-default">{tech}</span>
            ))}
          </div>
        </section>

        {allProjects.length > 1 && (
          <nav className="glass mt-6 grid gap-4 rounded-[1.5rem] p-4 md:grid-cols-3 md:items-center">
            <Link href={`/projects/${previous.slug}`} className="rounded-2xl bg-black/25 p-5 text-parchment/75 hover:text-ember transition">Previous<br /><span className="font-display text-xl font-bold text-pearl">{previous.title}</span></Link>
            <div className="grid place-items-center">
              <Icon className="h-12 w-12 text-ember" />
            </div>
            <Link href={`/projects/${next.slug}`} className="rounded-2xl bg-black/25 p-5 text-right text-parchment/75 hover:text-ember transition">Next<br /><span className="font-display text-xl font-bold text-pearl">{next.title}</span></Link>
          </nav>
        )}
      </div>
    </article>
  );
}
