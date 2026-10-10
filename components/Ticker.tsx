"use client";
import { usePathname } from "next/navigation";

const ITEMS = [
  ["CORE_ID", "CREATIVE DEVELOPER"],
  ["MOBILE_DEV", "ANDROID / IOS DEVELOPER"],
  ["POST_PROD", "VIDEO EDITING / MOTION FX"],
  ["STACK", "NEXT.JS / REACT / NODE"],
  ["RENDERING", "WEBGL / THREE.JS"],
  ["UI_UX", "INTERACTION DESIGN"],
  ["STATUS", "AVAILABLE FOR WORK"],
];

export default function Ticker() {
  const pathname = usePathname();

  // Only render on the Home page
  if (pathname !== "/") return null;

  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="pointer-events-none fixed right-6 top-6 z-30 w-[46vw] overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max animate-ticker gap-10 whitespace-nowrap font-mono text-sm text-[#F4F2EE]">
        {[...row, ...row].map(([k, v], i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="rounded border border-white/20 px-1 text-[10px] opacity-60 font-mono tracking-wider">
              {k}
            </span>
            <b className="tracking-wider text-white/90">{v}</b>
          </span>
        ))}
      </div>
    </div>
  );
}
