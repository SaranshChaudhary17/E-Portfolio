"use client";
import { useState } from "react";
import PageTitle from "@/components/PageTitle";
import { profile } from "@/data/profile";
import { useScramble } from "@/components/ScrambleText";

export default function Contact() {
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const badgeScramble = useScramble("WANNA SAY HELLO?");
  const emailScramble = useScramble(profile.email);
  const phoneScramble = useScramble(profile.phone);

  const githubScramble = useScramble(profile.socials[0]?.[0] || "GITHUB");
  const linkedinScramble = useScramble(profile.socials[1]?.[0] || "LINKEDIN");

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <PageTitle>Contact</PageTitle>

      <div className="w-full max-w-4xl text-center font-mono">
        {/* WANNA SAY HELLO? BADGE WITH HOVER SCRAMBLE */}
        <div
          onMouseEnter={badgeScramble.trigger}
          className="mx-auto mb-6 w-fit rounded border px-3 py-1 text-[10px] tracking-widest uppercase transition-colors cursor-pointer select-none"
          style={{
            borderColor: "var(--accent)",
            color: "var(--accent)",
            backgroundColor: "rgba(255,255,255,0.03)",
          }}
        >
          {badgeScramble.display}
        </div>

        {/* EMAIL ROW WITH HOVER SCRAMBLE (DOUBLED TEXT SIZE + THEME ACCENT) */}
        <a
          href={`mailto:${profile.email}`}
          onMouseEnter={emailScramble.trigger}
          className="block border-y border-white/15 py-8 md:py-10 text-[clamp(28px,4.5vw,68px)] font-display uppercase tracking-wider transition-all duration-300 hover:tracking-widest cursor-pointer leading-none"
          style={{ color: "var(--accent)" }}
        >
          {emailScramble.display}
        </a>

        {/* PHONE NUMBER ROW WITH HOVER SCRAMBLE (DOUBLED SIZE + THEME ACCENT) */}
        <button
          onClick={() => setShowPhoneModal(true)}
          onMouseEnter={phoneScramble.trigger}
          className="block w-full border-b border-white/15 py-8 md:py-10 text-[clamp(28px,4.5vw,68px)] font-display uppercase tracking-wider transition-all duration-300 hover:tracking-widest cursor-pointer leading-none"
          style={{ color: "var(--accent)" }}
        >
          {phoneScramble.display}
        </button>

        {/* SOCIAL LINKS WITH HOVER SCRAMBLE */}
        <div className="mt-10 flex justify-center gap-10 text-xs opacity-70">
          <a
            href={profile.socials[0]?.[1] || "#"}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={githubScramble.trigger}
            className="hover:text-[var(--accent)] transition-colors uppercase tracking-wider text-xs cursor-pointer"
          >
            {githubScramble.display}
          </a>
          <a
            href={profile.socials[1]?.[1] || "#"}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={linkedinScramble.trigger}
            className="hover:text-[var(--accent)] transition-colors uppercase tracking-wider text-xs cursor-pointer"
          >
            {linkedinScramble.display}
          </a>
        </div>
      </div>

      {/* CALL / WHATSAPP ACTION MODAL (NO EMOJIS, CLEAN LABELS) */}
      {showPhoneModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150"
          onClick={() => setShowPhoneModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border bg-black/90 p-6 shadow-2xl font-mono text-center relative"
            style={{ borderColor: "var(--accent)" }}
          >
            <button
              onClick={() => setShowPhoneModal(false)}
              className="absolute right-4 top-4 text-white/40 hover:text-white text-base transition-colors cursor-pointer"
            >
              ✕
            </button>
            <div className="text-[10px] tracking-widest uppercase opacity-60 mb-2">
              CONNECT // DIRECT LINE
            </div>
            <div
              className="text-xl font-bold font-mono tracking-wider mb-6"
              style={{ color: "var(--accent)" }}
            >
              {profile.phone}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${profile.phoneRaw}`}
                className="flex items-center justify-center rounded-xl border border-white/20 py-3.5 px-4 font-display text-xl uppercase tracking-widest text-white hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all cursor-pointer"
              >
                CALL
              </a>
              <a
                href={profile.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-3.5 px-4 font-display text-xl uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
              >
                WHATSAPP
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
