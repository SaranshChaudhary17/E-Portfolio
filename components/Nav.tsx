"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { profile } from "@/data/profile";
import { useScramble } from "@/components/ScrambleText";
import EcgLine from "@/components/EcgLine";

const LINKS: [string, string][] = [
  ["Home", "/"],
  ["About", "/about"],
  ["Projects", "/projects"],
  ["Contact", "/contact"],
];

export default function Nav() {
  const path = usePathname();
  const router = useRouter();

  // Hide on malik routes
  if (path?.startsWith("/malik")) {
    return null;
  }

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [time, setTime] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBusy(false);
    setOpen(false);
  }, [path]);

  // Close nav drawer when clicking anywhere outside
  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [open]);

  useEffect(() => {
    const f = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    f();
    const i = setInterval(f, 30000);
    return () => clearInterval(i);
  }, []);

  const go = (href: string) => {
    if (href === path) {
      setOpen(false);
      return;
    }
    setBusy(true);
    setTimeout(() => router.push(href), 450);
  };

  const current =
    LINKS.find(([, h]) => (h === "/" ? path === "/" : path.startsWith(h))) ??
    LINKS[0];
  const idx = LINKS.indexOf(current) + 1;
  const nameParts = profile.name.split(" ");

  // Cyberpunk random number swap hooks for top-left branding
  const firstName = useScramble(nameParts[0]);
  const portfolioText = useScramble("Portfolio");
  const lastName = useScramble(nameParts[1] || "DEV");
  const yearText = useScramble("2026");

  const triggerBranding = () => {
    firstName.trigger();
    portfolioText.trigger();
    lastName.trigger();
    yearText.trigger();
  };

  // Cyberpunk random number swap hooks for bottom-left contact & time
  const emailScramble = useScramble(profile.email);
  const timeScramble = useScramble(time || "12:00 PM");

  const triggerContact = () => {
    emailScramble.trigger();
    timeScramble.trigger();
  };

  return (
    <>
      {/* Page switch loader */}
      <div
        className={`pointer-events-none fixed inset-0 z-[90] bg-[#0D0D0D] transition-opacity duration-300 ${busy ? "opacity-100" : "opacity-0"}`}
      >
        <div
          className={`absolute bottom-0 left-0 h-1 bg-[var(--accent)] transition-[width] ease-out ${busy ? "w-full duration-[600ms]" : "w-0 duration-0"}`}
        />
      </div>

      {/* TOP-LEFT: DUAL-LINE BRANDING (RANDOM NUMBER SWAP ON HOVER) */}
      <div
        onMouseEnter={triggerBranding}
        className="fixed left-8 top-10 z-40 text-xs font-mono leading-tight tracking-wider md:left-14 md:top-12 cursor-pointer select-none group"
      >
        <div className="flex items-center gap-3">
          <span
            onMouseEnter={firstName.trigger}
            className="font-bold text-white/90 group-hover:text-white transition-colors"
          >
            {firstName.display}
          </span>
          <span className="text-white/30">|</span>
          <span
            onMouseEnter={portfolioText.trigger}
            className="text-white/60 group-hover:text-white/80 transition-colors"
          >
            {portfolioText.display}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span
            onMouseEnter={lastName.trigger}
            className="font-bold text-white/90 group-hover:text-white transition-colors"
          >
            {lastName.display}
          </span>
          <span className="text-white/30">|</span>
          <span
            onMouseEnter={yearText.trigger}
            className="text-white/60 group-hover:text-white/80 transition-colors"
          >
            {yearText.display}
          </span>
        </div>
      </div>

      {/* BOTTOM-LEFT: CONTACT & LOCAL TIME (RANDOM NUMBER SWAP ON HOVER) */}
      <div
        onMouseEnter={triggerContact}
        className="fixed bottom-11 left-8 z-40 hidden gap-12 font-mono text-[11px] sm:flex md:left-14 md:bottom-14 select-none cursor-pointer"
      >
        <div onMouseEnter={emailScramble.trigger}>
          <div className="text-white/40 mb-0.5 tracking-wider">Wanna Say Hello?</div>
          <a
            href={`mailto:${profile.email}`}
            className="text-white/80 hover:text-[var(--accent)] transition-colors inline-block"
          >
            {emailScramble.display}
          </a>
        </div>
        <div onMouseEnter={timeScramble.trigger}>
          <div className="text-white/40 mb-0.5 tracking-wider">Local Time</div>
          <div className="text-white/80 hover:text-[var(--accent)] transition-colors inline-block">
            {timeScramble.display}
          </div>
        </div>
      </div>

      {/* BOTTOM-RIGHT: ANIMATED ECG HEARTBEAT PULSE + NAV DRAWER BUTTON */}
      <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 md:right-14">
        {/* Animated ECG Heartbeat waveform */}
        <EcgLine />

        <div ref={menuRef} className="relative">
          {open && (
            <div className="absolute bottom-full right-0 mb-3 w-72 rounded-xl border border-white/10 bg-black/85 p-3 backdrop-blur-xl shadow-2xl">
              <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                {profile.socials.map(([n, u]) => (
                  <a
                    key={n}
                    href={u}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-white/10 px-3 py-2 hover:border-[var(--accent)] transition-colors"
                  >
                    {n}
                  </a>
                ))}
              </div>
              {[...LINKS].reverse().map(([n, h], i) => (
                <button
                  key={h}
                  onClick={() => go(h)}
                  className={`mb-2 flex w-full items-center justify-between rounded-lg border px-4 py-3 font-display text-2xl uppercase transition-colors ${h === current[1] ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10" : "border-white/10 text-white/70 hover:border-white/30 hover:text-white"}`}
                >
                  <span>
                    <span className="mr-3 font-mono text-xs opacity-50">
                      [{LINKS.length - i}]
                    </span>
                    {n}
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setOpen((o) => !o)}
            className="flex w-64 sm:w-72 items-center justify-between rounded-xl border border-white/10 bg-black/60 py-2 pl-4 pr-2 backdrop-blur-xl hover:border-white/20 transition-all shadow-xl"
          >
            <span className="font-display text-2xl uppercase tracking-wider text-white">
              <span className="mr-3 font-mono text-xs opacity-50">[{idx}]</span>
              {current[0]}
            </span>
            <span className="rounded-lg bg-white px-3 py-2 text-black font-bold">
              {open ? "×" : "⠿"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
