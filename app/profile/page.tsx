"use client";

import { Award, Code2, Film, PenTool, Sparkles, MapPin, Briefcase, User } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const DEFAULT_STATS = [
  { label: "Projects", value: "15+" },
  { label: "Tools", value: "20+" },
  { label: "Code", value: "10K+" },
  { label: "Motion", value: "100%" }
];

const DEFAULT_TIMELINE = [
  { year: "2023", copy: "Started combining code, UI design, and video editing into one creative practice." },
  { year: "2024", copy: "Built practical systems, brand sites, and language technology projects." },
  { year: "2025", copy: "Expanded into AI security, advanced interfaces, and cinematic web experiences." },
  { year: "2026", copy: "Focused on premium interactive portfolios and motion-led product storytelling." }
];

const DEFAULT_CORE_FOCUS = [
  { title: "Creative development", subtitle: "Next.js, React, TypeScript, Tailwind CSS" },
  { title: "Video editing", subtitle: "Premiere Pro, pacing, story, color" },
  { title: "Cinematic UI", subtitle: "Design systems, layouts, interaction" },
  { title: "Motion graphics", subtitle: "After Effects, GSAP, Framer Motion" }
];

const FOCUS_ICONS = [Code2, Film, PenTool, Sparkles];

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({
    name: "Saransh Chaudhary",
    role: "Creative Developer",
    location: "India",
    bio: "I build cinematic digital experiences, interactive interfaces, and visual stories that blend creativity with technology.",
    email: "hello@saransh.dev",
    skills: ["Next.js", "React", "Three.js", "Framer Motion", "GSAP", "Premiere Pro", "After Effects", "Figma", "Python", "Java"],
    stats: DEFAULT_STATS,
    timeline: DEFAULT_TIMELINE,
    coreFocus: DEFAULT_CORE_FOCUS
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "cinematic_portfolio_data", "main"));
        if (snap.exists()) {
          const data = snap.data();
          const p = data.profile || {};
          setProfile((prev: any) => ({
            ...prev,
            ...p,
            stats: p.stats && p.stats.length > 0 ? p.stats : DEFAULT_STATS,
            timeline: p.timeline && p.timeline.length > 0 ? p.timeline : DEFAULT_TIMELINE,
            coreFocus: p.coreFocus && p.coreFocus.length > 0 ? p.coreFocus : DEFAULT_CORE_FOCUS
          }));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);

  return (
    <section className="px-4 pb-24 pt-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="glass rounded-[1.75rem] p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="h-32 w-32 sm:h-40 sm:w-40 shrink-0 rounded-full border-2 border-ember/30 bg-black/40 overflow-hidden shadow-[0_0_30px_rgba(232,117,26,0.15)] flex items-center justify-center">
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" /> : <User className="h-16 w-16 text-parchment/20" />}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-pearl drop-shadow-md">{profile.name}</h1>
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {profile.role && <span className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-ember"><Briefcase className="h-4 w-4" /> {profile.role}</span>}
                {profile.location && <span className="flex items-center gap-1.5 text-sm text-parchment/70"><MapPin className="h-4 w-4" /> {profile.location}</span>}
              </div>
              <p className="mt-5 text-parchment/80 leading-relaxed max-w-lg">{profile.bio}</p>
            </div>
          </div>
          <div className="glass rounded-[1.75rem] p-6 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              {(profile.stats || DEFAULT_STATS).map((stat: any) => (
                <div key={stat.label} className="rounded-2xl border border-parchment/12 bg-white/5 p-5">
                  <div className="font-display text-4xl font-black text-ember">{stat.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-parchment/65">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {profile.bio2 && (
          <div className="mt-8 glass rounded-[1.5rem] p-8">
            <h2 className="font-display text-2xl font-black uppercase text-pearl mb-4">Extended Origin</h2>
            <p className="text-parchment/75 leading-relaxed max-w-4xl">{profile.bio2}</p>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="glass rounded-[1.5rem] p-6">
            <h2 className="font-display text-2xl font-black uppercase text-pearl">Core Focus</h2>
            <div className="mt-5 grid gap-4">
              {(profile.coreFocus || DEFAULT_CORE_FOCUS).map((item: any, i: number) => {
                const Icon = FOCUS_ICONS[i % FOCUS_ICONS.length];
                return (
                  <div key={item.title} className="flex gap-4 rounded-2xl border border-parchment/12 bg-black/25 p-4">
                    <Icon className="h-6 w-6 shrink-0 text-ember" />
                    <div><p className="font-semibold text-pearl">{item.title}</p><p className="text-sm text-parchment/70">{item.subtitle}</p></div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-parchment/10 text-sm text-parchment/60 flex items-center justify-between">
              <span className="uppercase tracking-widest text-xs">Direct Comms</span>
              <a href={`mailto:${profile.email}`} className="text-ember font-semibold hover:text-white transition">{profile.email}</a>
            </div>
          </section>

          <section className="glass rounded-[1.5rem] p-6">
            <h2 className="font-display text-2xl font-black uppercase text-pearl">Timeline</h2>
            <div className="mt-6 space-y-4">
              {(profile.timeline || DEFAULT_TIMELINE).map((entry: any) => (
                <div key={entry.year} className="grid gap-4 rounded-2xl border border-parchment/12 bg-white/5 p-5 sm:grid-cols-[120px_1fr]">
                  <span className="font-display text-3xl font-black text-ember">{entry.year}</span>
                  <p className="leading-7 text-parchment/76">{entry.copy}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="glass mt-6 rounded-[1.5rem] p-6">
          <h2 className="flex items-center gap-3 font-display text-2xl font-black uppercase text-pearl"><Award className="h-6 w-6 text-ember" /> Technologies & Toolkit</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {(profile.skills && profile.skills.length > 0 ? profile.skills : ["Next.js", "React", "Three.js", "Framer Motion", "GSAP", "Premiere Pro", "After Effects", "Figma", "Python", "Java"]).map((tool: string) => (
              <span key={tool} className="rounded-full border border-parchment/15 bg-white/5 px-4 py-2 text-sm text-parchment/78 hover:border-ember/50 hover:text-white transition cursor-default">{tool}</span>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
