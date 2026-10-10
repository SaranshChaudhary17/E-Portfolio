"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth, AUTHORIZED_EMAIL } from "@/lib/auth";

export default function MalikLogin() {
  const router = useRouter();
  const { user, loading, isAuthorized, loginWithGoogle } = useAdminAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAuthorized) {
      router.replace("/malik");
    }
  }, [user, isAuthorized, loading, router]);

  const handleLogin = async () => {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      router.replace("/malik");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#060606] text-white flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-black/80 p-8 md:p-10 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Terminal Header Tag */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs text-white/60 tracking-widest uppercase">
              PORTFOLIO // GATEWAY
            </span>
          </div>
          <span className="font-mono text-[10px] text-white/40 border border-white/10 px-2 py-0.5 rounded">
            SYS_LOCK
          </span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold uppercase tracking-wider text-white">
            MALIK <span className="text-emerald-400">ACCESS</span>
          </h1>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-950/20 text-rose-300 text-xs font-mono leading-relaxed text-center tracking-wider">
            {errorMsg}
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          onClick={handleLogin}
          disabled={submitting || loading}
          className="w-full group relative flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 hover:border-emerald-400/50 text-white font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
        >
          {submitting ? (
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
              <svg
                className="animate-spin size-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>AUTHENTICATING...</span>
            </div>
          ) : (
            <>
              {/* Google G icon */}
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        <div className="pt-2 text-center">
          <a
            href="/"
            className="text-[11px] font-mono text-white/40 hover:text-white transition-colors"
          >
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
