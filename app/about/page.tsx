import PageTitle from "@/components/PageTitle";
import { profile, calculateAge } from "@/data/profile";

export default function About() {
  const firstName = profile.name.split(" ")[0].toUpperCase();
  const currentAge = calculateAge();

  return (
    <section className="relative min-h-screen px-6 md:px-14 pt-36 md:pt-44 pb-36">
      {/* Top Right Header: "MEET SARANSH" with "HOME / ABOUT" crumb */}
      <PageTitle crumb="ABOUT">{`MEET ${firstName}`}</PageTitle>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
        {/* LEFT COLUMN: FRAMED MONOCHROME PORTRAIT CARD (ALIGNED TO LEFT MARGIN) */}
        <div className="lg:col-span-5 xl:col-span-4 flex justify-start">
          <div className="relative w-full max-w-[360px] lg:max-w-sm rounded-2xl border border-white/10 bg-neutral-900/30 p-2 md:p-2.5 backdrop-blur-sm shadow-2xl overflow-hidden group">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-950">
              <img
                src="/images/saransh.png"
                alt={profile.name}
                className="h-full w-full object-cover grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* CRT Scanline Overlay Texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)",
                }}
              />
              {/* Subtle Vignette Gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Status telemetry pill inside photo */}
              <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-white/80">
                <span className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  <span>DEV // ACTIVE</span>
                </span>
                <span className="text-white/40 tracking-wider">INDIA // UTC+5:30</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EDITORIAL CONTENT & EXPERIENCE HIGHLIGHTS */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center space-y-12 lg:space-y-14 pt-2 max-w-3xl">
          {/* SECTION 1: ROLE & PHILOSOPHY */}
          <div>
            <div
              className="font-mono text-xs uppercase tracking-widest mb-3 opacity-80"
              style={{ color: "var(--accent)" }}
            >
              {`A ${currentAge} Y.O`}
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.92] tracking-tight mb-6">
              <span className="block text-white">CREATIVE</span>
              <span className="block" style={{ color: "var(--accent)" }}>
                DEVELOPER
              </span>
            </h2>
            <p className="font-mono text-xs sm:text-[13px] leading-relaxed text-white/70 max-w-xl tracking-wide">
              Passionate about building powerful apps, crafting modern web experiences, and creating compelling visual stories. I combine development and creativity to turn ideas into functional digital products and engaging visuals that leave a lasting impression.
            </p>
          </div>

          {/* SECTION 2: EXPERIENCE METRICS & SKILLS */}
          <div>
            <div
              className="font-mono text-xs uppercase tracking-widest mb-3 opacity-80"
              style={{ color: "var(--accent)" }}
            >
              HAVING MORE THAN
            </div>
            <h3 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.92] tracking-tight mb-6">
              <span className="block text-white">3+ YEARS OF</span>
              <span className="block" style={{ color: "var(--accent)" }}>
                HANDS-ON EXPERIENCE
              </span>
            </h3>

            {/* TECH STACK BADGES */}
            <div className="flex flex-wrap gap-2.5 pt-2 font-mono text-[11px]">
              {[
                "NEXT.JS / REACT",
                "THREE.JS / WEBGL",
                "GSAP ANIMATIONS",
                "TAILWIND CSS",
                "TYPESCRIPT",
                "UI / UX DESIGN",
                "NODE.JS",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-white/70 hover:border-[var(--accent)] hover:text-white transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
