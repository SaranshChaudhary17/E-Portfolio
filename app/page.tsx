"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Film, Github, Images, Mail, UserRound } from "lucide-react";
import { AmbientScene } from "@/components/three/ambient-scene";
import { CinematicCard } from "@/components/cinematic-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { featuredProjects } from "@/data/projects";
import { identity, stats } from "@/data/site";

const hubs = [
  { href: "/projects", label: "Projects", copy: "Interactive projects and creative experiments.", icon: Code2 },
  { href: "/github", label: "GitHub", copy: "Code, repositories, metrics, and open-source energy.", icon: Github },
  { href: "/videos", label: "Video Editing", copy: "Cinematic edits, reels, and motion graphics.", icon: Film },
  { href: "/gallery", label: "Gallery", copy: "Posters, concepts, UI studies, and visual worlds.", icon: Images },
  { href: "/profile", label: "Profile", copy: "Journey, skills, tools, and achievements.", icon: UserRound },
  { href: "/contact", label: "Contact", copy: "Start a collaboration with a cinematic signal.", icon: Mail }
];

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[calc(100vh-6rem)] overflow-hidden px-4 pb-14 pt-8 md:px-8">
        <AmbientScene />
        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.04fr_0.96fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-5 flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.34em] text-denim"
            >
              <span className="h-px w-12 bg-ember" /> Boot sequence online
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="max-w-[11ch] font-display text-[clamp(3.4rem,8.8vw,8rem)] font-black uppercase leading-[0.86] tracking-normal"
            >
              Saransh <span className="orange-text block">Chaudhary</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-parchment/82"
            >
              I build cinematic digital experiences, interactive interfaces, and visual stories that blend creativity with technology.
            </motion.p>
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm font-semibold uppercase tracking-[0.17em] text-denim">
              {identity.roles.map((role) => (
                <span key={role}>{role}</span>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.34 }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <Link href="/projects">
                <Button>Explore my work <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary">Start a signal</Button>
              </Link>
            </motion.div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-4">
                  <div className="font-display text-2xl font-black text-ember">{stat.value}</div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-parchment/65">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="glass relative overflow-hidden rounded-[2rem] p-5 md:p-7"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(232,117,26,0.28),transparent_28%)]" />
            <div className="relative">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-denim">Live interface</span>
                <span className="h-3 w-3 rounded-full bg-ember shadow-glow" />
              </div>
              <div className="grid gap-4">
                {hubs.slice(0, 4).map((hub, index) => {
                  const Icon = hub.icon;
                  return (
                    <Link key={hub.href} href={hub.href} className="group flex items-center gap-4 rounded-2xl border border-parchment/12 bg-black/25 p-4 transition hover:border-ember/50 hover:bg-ember/10">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-ember">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-xl font-bold uppercase text-pearl">{String(index + 1).padStart(2, "0")} / {hub.label}</span>
                        <span className="mt-1 block text-sm text-parchment/70">{hub.copy}</span>
                      </span>
                      <ArrowRight className="ml-auto h-5 w-5 text-denim transition group-hover:translate-x-1 group-hover:text-ember" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-pad px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Selected systems" title="Featured Projects" copy="Case studies shaped as cinematic products: readable, fast, and visually memorable." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredProjects.map((project, index) => <CinematicCard key={project.slug} project={project} index={index} />)}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 md:px-8">
        <div className="glass mx-auto grid max-w-7xl gap-8 rounded-[2rem] p-6 md:grid-cols-[1fr_0.85fr] md:p-10">
          <div>
            <SectionHeading eyebrow="Studio signal" title="Motion Driven" copy="The portfolio uses cinematic timing, ambient 3D, smooth scrolling, and restrained interface glow so the experience feels alive without sacrificing usability." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["GSAP transitions", "Framer orchestration", "React Three Fiber", "Lenis smooth scroll"].map((item) => (
              <div key={item} className="rounded-2xl border border-parchment/12 bg-black/25 p-5">
                <div className="mb-4 h-1 w-16 rounded-full bg-ember" />
                <p className="font-display text-xl font-bold uppercase text-pearl">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
