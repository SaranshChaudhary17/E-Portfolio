"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/auth";
import MalikNav from "@/components/admin/MalikNav";
import ProjectForm from "@/components/admin/ProjectForm";
import { fetchProjectById, FirestoreProject } from "@/lib/projectsService";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading, isAuthorized } = useAdminAuth();
  const [project, setProject] = useState<FirestoreProject | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || !isAuthorized) {
        router.replace("/malik/login");
      } else {
        loadData();
      }
    }
  }, [user, isAuthorized, loading, router, id]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const data = await fetchProjectById(id);
      setProject(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || (!user && !isAuthorized)) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center text-emerald-400 font-mono text-xs">
        <span className="animate-pulse">VERIFYING MALIK AUTH...</span>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-[#060606] text-white">
        <MalikNav />
        <div className="max-w-7xl mx-auto px-6 py-24 text-center font-mono text-xs text-white/40">
          LOADING PROJECT RECORD FROM FIRESTORE...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#060606] text-white">
        <MalikNav />
        <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
          <p className="font-mono text-sm text-rose-400">Project record not found.</p>
          <button
            onClick={() => router.push("/malik")}
            className="px-4 py-2 rounded-lg border border-white/20 text-xs font-mono"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <MalikNav />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <ProjectForm initialData={project} projectId={id} />
      </main>
    </div>
  );
}
