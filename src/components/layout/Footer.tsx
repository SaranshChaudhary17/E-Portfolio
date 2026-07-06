"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 border-t border-[#333] mt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <Link href="/" className="font-heading font-bold text-xl tracking-tighter text-[#F4F2EE]">
            SARANSH<span className="text-[#E8751A]">.</span>
          </Link>
          <p className="text-sm text-[#7FA1BE]">
            Creative Developer & Motion Designer
          </p>
        </div>
        
        <div className="flex gap-6 text-sm text-[#7FA1BE]">
          <Link href="/projects" className="hover:text-[#E8751A] transition-colors">Projects</Link>
          <Link href="/github" className="hover:text-[#E8751A] transition-colors">GitHub</Link>
          <Link href="/contact" className="hover:text-[#E8751A] transition-colors">Contact</Link>
        </div>

        <p className="text-xs text-[#333]">
          © {new Date().getFullYear()} Saransh Chaudhary. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
