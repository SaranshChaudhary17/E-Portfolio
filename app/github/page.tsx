"use client";

import { useEffect, useState } from "react";
import { ExternalLink, GitBranch, Github, Star, Terminal } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const DEFAULT_GITHUB = {
  profileName: "Saransh Chaudhary",
  profileHandle: "@SaranshChaudhary17",
  profileUrl: "https://github.com/SaranshChaudhary17",
  repos: "52",
  followers: "128",
  following: "45",
  stars: "89",
  contributions: "1,248 Contributions",
  streak: "27 Day streak",
  commits: "82 Commits/month",
  recentActivity: [
    "Updated cinematic project pages",
    "Added 3D portfolio interaction",
    "Improved responsive UI",
    "Optimized animation timing",
    "Refined GitHub dashboard"
  ],
  languages: [
    { name: "JavaScript", value: "35.6%", color: "bg-ember" },
    { name: "TypeScript", value: "20.3%", color: "bg-denim" },
    { name: "Python", value: "15.1%", color: "bg-linen" },
    { name: "Java", value: "10.8%", color: "bg-burnt" },
    { name: "HTML/CSS", value: "8.2%", color: "bg-steel" },
    { name: "Other", value: "10.0%", color: "bg-parchment" }
  ]
};

export default function GithubPage() {
  const [github, setGithub] = useState<any>(DEFAULT_GITHUB);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, "cinematic_portfolio_data", "main"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.github) {
            setGithub({ ...DEFAULT_GITHUB, ...data.github });
          }
          if (data.projects && data.projects.length > 0) {
            setProjects(data.projects);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Repos", value: github.repos },
    { label: "Followers", value: github.followers },
    { label: "Following", value: github.following },
    { label: "Stars", value: github.stars }
  ];

  const contributionStats = [
    github.contributions,
    github.streak,
    github.commits
  ];

  return (
    <section className="px-4 pb-24 pt-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="glass rounded-[1.75rem] p-6 md:p-8">
            <SectionHeading eyebrow="Developer command center" title="GitHub Repository" copy={`Explore code, contributions, and open-source projects from the ${github.profileHandle} workspace.`} />
            <a href={github.profileUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ember px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-glow">
              View GitHub profile <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="glass rounded-[1.75rem] p-6 md:p-8">
            <div className="flex items-center gap-5">
              <div className="grid h-20 w-20 place-items-center rounded-full border border-ember/40 bg-ember/15">
                <Github className="h-10 w-10 text-ember" />
              </div>
              <div>
                <h2 className="font-display text-3xl font-black text-pearl">{github.profileName}</h2>
                <p className="text-parchment/70">{github.profileHandle}</p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-4 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-parchment/12 bg-white/5 p-4 text-center text-sm text-parchment/70">
                  <span className="block font-display text-2xl font-black text-pearl">{stat.value}</span>
                  {stat.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="glass rounded-[1.5rem] p-6">
            <h2 className="font-display text-2xl font-black uppercase text-pearl">Languages Used</h2>
            <div className="mt-7 grid gap-4">
              {(github.languages || []).map((lang: any) => (
                <div key={lang.name}>
                  <div className="mb-2 flex justify-between text-sm text-parchment/75">
                    <span>{lang.name}</span><span>{lang.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className={`h-2 rounded-full ${lang.color || "bg-ember"}`} style={{ width: lang.value }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="glass rounded-[1.5rem] p-6">
            <h2 className="font-display text-2xl font-black uppercase text-pearl">Contribution Graph</h2>
            <div className="mt-6 grid grid-cols-[repeat(26,minmax(0,1fr))] gap-1">
              {Array.from({ length: 156 }).map((_, index) => {
                const hot = index % 9 === 0 || (index > 55 && index < 95 && index % 3 === 0);
                const cool = index % 5 === 0;
                return <span key={index} className={`h-3 rounded-[3px] ${hot ? "bg-ember" : cool ? "bg-denim/70" : "bg-white/10"}`} />;
              })}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {contributionStats.map((item) => (
                <div key={item} className="rounded-2xl border border-parchment/12 bg-black/25 p-4 text-parchment/75">{item}</div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="glass rounded-[1.5rem] p-6">
            <h2 className="font-display text-2xl font-black uppercase text-pearl">Top repositories</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project: any) => (
                <a key={project.id || project.slug} href={project.github || `https://github.com/${github.profileHandle?.replace("@", "")}/${project.repository || project.slug}`} target="_blank" rel="noreferrer" className="rounded-2xl border border-parchment/12 bg-white/5 p-5 transition hover:border-ember/50">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-lg font-bold text-pearl">{project.repository || project.title}</h3>
                    <Github className="h-5 w-5 text-ember shrink-0" />
                  </div>
                  <p className="mt-3 min-h-16 text-sm leading-6 text-parchment/70">{project.tagline}</p>
                  <div className="mt-4 flex gap-4 text-sm text-parchment/70">
                    <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-ember" /> {project.stars || (120 + (project.title?.length || 0))}</span>
                    <span className="inline-flex items-center gap-1"><GitBranch className="h-4 w-4 text-denim" /> {project.forks || (12 + (project.tech?.length || 0))}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
          <aside className="glass rounded-[1.5rem] p-6">
            <h2 className="flex items-center gap-3 font-display text-2xl font-black uppercase text-pearl"><Terminal className="h-6 w-6 text-ember" /> Recent Activity</h2>
            <div className="mt-5 rounded-2xl bg-black/55 p-5 font-mono text-sm text-denim">
              <p className="text-ember">{github.profileHandle?.replace("@", "") || "Saransh"}@github ~</p>
              <p>$ git log --oneline -5</p>
              {(github.recentActivity || []).map((line: string, i: number) => (
                <p key={i} className="mt-3 text-parchment/75">{String(i + 1).padStart(2, "0")} {line}</p>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
