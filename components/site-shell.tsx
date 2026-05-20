"use client";

import Link from "next/link";
import Image from "next/image";
import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { navItems } from "@/data/site";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  return (
    <div className="cinematic-shell min-h-screen">
      <div className="noise" />
      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8">
        <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Saransh home" onClick={() => setMobileMenuOpen(false)}>
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-ember/35 bg-ember/10 flex items-center justify-center p-1.5 shadow-glow">
              <Image
                src="/logo.png"
                alt="Saransh Chaudhary Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.24em] text-parchment/80 sm:block">Saransh</span>
          </Link>
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-parchment/72 transition hover:text-pearl",
                    active && "text-ember"
                  )}
                >
                  {item.label}
                  {active ? <motion.span layoutId="nav-dot" className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ember" /> : null}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="grid h-11 w-11 place-items-center rounded-full border border-parchment/20 bg-white/5 text-pearl lg:hidden" 
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9999] flex flex-col items-center justify-center lg:hidden"
              style={{
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)"
              }}
            >
              {/* Dark premium glass solid layer (guarantees 100% readability by blocking text behind it) */}
              <div className="absolute inset-0 bg-[#0d0d0d]/95" />
              
              {/* Premium backdrop blur layer (frosted glass effect) */}
              <div 
                className="absolute inset-0 backdrop-blur-3xl"
                style={{
                  backdropFilter: "blur(45px)",
                  WebkitBackdropFilter: "blur(45px)"
                }}
              />

              {/* Close Button in Upper Right */}
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full border border-parchment/20 bg-white/5 text-pearl hover:bg-white/10 transition z-20"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Menu Content (layered above the background and blur) */}
              <div className="relative z-10 flex flex-col items-center gap-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 text-2xl font-display font-black uppercase tracking-widest text-parchment/70 transition hover:text-ember",
                        active && "text-ember"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <aside className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 rounded-[1.75rem] border border-parchment/12 bg-black/30 p-3 backdrop-blur-xl xl:flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group grid h-12 w-12 place-items-center rounded-2xl text-parchment/70 transition hover:bg-white/10 hover:text-ember",
                active && "bg-ember/16 text-ember shadow-glow"
              )}
              aria-label={item.label}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </aside>
      <main className="pt-24">{children}</main>
    </div>
  );
}
