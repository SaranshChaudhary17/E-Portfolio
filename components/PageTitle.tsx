export default function PageTitle({ children, crumb }: { children: string; crumb?: string }) {
  return (
    <div className="pointer-events-none absolute right-6 top-14 z-20 text-right md:right-14 select-none">
      <div
        className="font-mono text-[10px] tracking-widest uppercase opacity-70 mb-1"
        style={{ color: "var(--accent)" }}
      >
        HOME / {crumb ?? children.toUpperCase()}
      </div>
      <h1
        className="font-display text-[clamp(56px,9vw,128px)] uppercase leading-[0.9] tracking-tight transition-colors duration-300 drop-shadow-sm"
        style={{ color: "var(--accent)" }}
      >
        {children}
      </h1>
    </div>
  );
}
