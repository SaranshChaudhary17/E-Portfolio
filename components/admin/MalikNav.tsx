"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/auth";

export default function MalikNav() {
  const router = useRouter();
  const { user, logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/malik/login");
  };

  return (
    <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link href="/malik" className="flex items-center gap-2 group">
            <span className="size-2.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
            <span className="font-display text-lg font-bold uppercase tracking-wider text-white">
              MALIK <span className="text-emerald-400">HQ</span>
            </span>
          </Link>
          <span className="hidden sm:inline-block text-[10px] font-mono text-white/40 border border-white/10 px-2 py-0.5 rounded">
            PROJECT ENGINE
          </span>
        </div>

        {/* Navigation links */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link
            href="/malik"
            className="text-xs uppercase font-mono tracking-wider text-white/70 hover:text-white transition-colors"
          >
            All Projects
          </Link>
          <Link
            href="/malik/projects/new"
            className="text-xs uppercase font-mono tracking-wider px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400 transition-all flex items-center gap-1.5"
          >
            <span>+</span> New Project
          </Link>
          <a
            href="/projects"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex text-xs uppercase font-mono tracking-wider text-white/40 hover:text-white/80 transition-colors items-center gap-1"
          >
            View Live Site ↗
          </a>

          {/* User profile & Logout */}
          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt="Avatar"
                className="size-7 rounded-full border border-white/20"
              />
            )}
            <button
              onClick={handleLogout}
              className="text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors"
              title="Logout"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
