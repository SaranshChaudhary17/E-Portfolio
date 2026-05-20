"use client";

import { useEffect, useState } from "react";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ContactPage() {
  const [socials, setSocials] = useState<any>({
    email: "hello@saransh.dev",
    github: "https://github.com/SaranshChaudhary17",
    githubUser: "SaranshChaudhary17",
    linkedin: "https://linkedin.com",
    linkedinUser: "Saransh Chaudhary",
    instagram: "https://instagram.com",
    instagramUser: "Creative visuals"
  });

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const snap = await getDoc(doc(db, "cinematic_portfolio_data", "main"));
        if (snap.exists()) {
          const data = snap.data();
          const loadedSocials = data.socials || {};
          setSocials({
            email: loadedSocials.email || data.profile?.email || "hello@saransh.dev",
            github: loadedSocials.github || "https://github.com/SaranshChaudhary17",
            githubUser: loadedSocials.githubUser || "SaranshChaudhary17",
            linkedin: loadedSocials.linkedin || "https://linkedin.com",
            linkedinUser: loadedSocials.linkedinUser || "Saransh Chaudhary",
            instagram: loadedSocials.instagram || "https://instagram.com",
            instagramUser: loadedSocials.instagramUser || "Creative visuals"
          });
        }
      } catch (e) {
        console.error("Error loading social links:", e);
      }
    };
    fetchSocials();
  }, []);

  const socialItems = [
    { Icon: Mail, label: "Email", value: socials.email, href: `mailto:${socials.email}` },
    { Icon: Github, label: "GitHub", value: socials.githubUser, href: socials.github },
    { Icon: Linkedin, label: "LinkedIn", value: socials.linkedinUser, href: socials.linkedin },
    { Icon: Instagram, label: "Instagram", value: socials.instagramUser, href: socials.instagram }
  ];

  return (
    <section className="px-4 pb-24 pt-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading eyebrow="Transmission room" title="Contact Signal" copy="For cinematic websites, interactive product ideas, creative edits, visual systems, or a portfolio that needs its own atmosphere." />
            <div className="mt-8 grid gap-4">
              {socialItems.map(({ Icon, label, value, href }) => {
                const SocialIcon = Icon;
                return (
                  <a 
                    key={label} 
                    href={href} 
                    target={label === "Email" ? undefined : "_blank"} 
                    rel={label === "Email" ? undefined : "noopener noreferrer"}
                    className="glass flex items-center gap-5 rounded-2xl p-5 border border-parchment/12 bg-black/20 hover:border-ember/40 hover:bg-ember/5 hover:scale-[1.01] transition-all duration-300 group cursor-pointer"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-ember group-hover:bg-ember group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                      <SocialIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-denim group-hover:text-ember transition-colors">{label}</p>
                      <p className="mt-1 text-pearl font-medium transition-colors group-hover:text-white">{value}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
