"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/auth";
import MalikNav from "@/components/admin/MalikNav";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  const router = useRouter();
  const { user, loading, isAuthorized } = useAdminAuth();

  useEffect(() => {
    if (!loading && (!user || !isAuthorized)) {
      router.replace("/malik/login");
    }
  }, [user, isAuthorized, loading, router]);

  if (loading || (!user && !isAuthorized)) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center text-emerald-400 font-mono text-xs">
        <span className="animate-pulse">VERIFYING MALIK AUTH...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <MalikNav />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <ProjectForm />
      </main>
    </div>
  );
}
