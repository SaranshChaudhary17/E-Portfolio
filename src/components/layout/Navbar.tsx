"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "GitHub", path: "/github" },
  { name: "Videos", path: "/videos" },
  { name: "Gallery", path: "/gallery" },
  { name: "Profile", path: "/profile" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto"
      >
        {/* Premium Floating Glassmorphic Capsule */}
        <div className="w-full flex items-center justify-between bg-[#161616]/75 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3 md:px-6 md:py-3.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
          <Link href="/" className="font-heading font-bold text-lg md:text-xl tracking-tighter text-[#F4F2EE] z-50 transition-transform active:scale-95">
            SARANSH<span className="text-[#E8751A]">.</span>
          </Link>
          
          {/* PC Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== "/" && pathname.startsWith(link.path));
              
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-full",
                    isActive ? "text-[#F4F2EE]" : "text-[#7FA1BE] hover:text-[#D9C7B8]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-[#333]/50 rounded-full -z-10 border border-[#E8751A]/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Hamburger Button for Mobile */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 text-[#F4F2EE] hover:text-[#E8751A] focus:outline-none z-50 rounded-full active:bg-[#333]/30 transition-colors"
            aria-label="Toggle Menu"
          >
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {isOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </motion.header>

      {/* Mobile Dynamic Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0D0D0D]/90 backdrop-blur-2xl z-40 md:hidden flex flex-col justify-center px-8"
          >
            <nav className="flex flex-col gap-6 mt-12">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.path || (link.path !== "/" && pathname.startsWith(link.path));
                
                return (
                  <motion.div
                    key={link.name}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ delay: index * 0.06, ease: "easeOut" }}
                  >
                    <Link
                      href={link.path}
                      className={cn(
                        "text-2xl font-heading font-bold tracking-tight uppercase transition-all duration-300 block",
                        isActive ? "text-[#E8751A] translate-x-2" : "text-[#7FA1BE] hover:text-[#F4F2EE]"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "text-xs font-mono tracking-widest",
                          isActive ? "text-[#E8751A]" : "text-[#7FA1BE]/40"
                        )}>
                          0{index + 1}
                        </span>
                        {link.name}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Glowing accents in the mobile drawer */}
            <div className="absolute bottom-12 left-8 right-8 border-t border-[#333]/30 pt-6">
              <p className="text-xs font-mono text-[#7FA1BE]/50 tracking-wider">CREATIVE DEV // INTERACTIVE</p>
              <p className="text-xs font-mono text-[#E8751A] tracking-wider mt-1">SARANSH CHAUDHARY</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
