"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/lib/auth";
import MalikNav from "@/components/admin/MalikNav";
import {
  fetchProjects,
  updateExistingProject,
  removeProject,
  seedDefaultProjects,
  FirestoreProject,
} from "@/lib/projectsService";

export default function MalikDashboard() {
  const router = useRouter();
  const { user, loading, isAuthorized } = useAdminAuth();
  const [projectsList, setProjectsList] = useState<FirestoreProject[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user || !isAuthorized) {
        router.replace("/malik/login");
      } else {
        loadProjects();
      }
    }
  }, [user, isAuthorized, loading, router]);

  const loadProjects = async () => {
    setDataLoading(true);
    try {
      const data = await fetchProjects(true);
      setProjectsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleTogglePublish = async (p: FirestoreProject) => {
    if (!p.id) return;
    try {
      const newStatus = !p.published;
      await updateExistingProject(p.id, { published: newStatus });
      setProjectsList((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, published: newStatus } : item))
      );
      setActionMsg(`Project "${p.title}" ${newStatus ? "Published" : "Moved to Draft"}`);
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  const handleDelete = async (p: FirestoreProject) => {
    if (!p.id) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${p.title}"? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await removeProject(p.id);
      setProjectsList((prev) => prev.filter((item) => item.id !== p.id));
      setActionMsg(`Deleted "${p.title}"`);
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: any) {
      alert("Error deleting project: " + err.message);
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projectsList.length) return;

    const updated = [...projectsList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Re-index orders
    const newItems = updated.map((item, idx) => ({ ...item, order: idx }));
    setProjectsList(newItems);

    try {
      for (const item of newItems) {
        if (item.id && !item.id.startsWith("local-")) {
          await updateExistingProject(item.id, { order: item.order });
        }
      }
    } catch (err) {
      console.error("Failed to persist reorder:", err);
    }
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      const count = await seedDefaultProjects();
      setActionMsg(`Imported ${count} default projects to Firestore!`);
      await loadProjects();
    } catch (err: any) {
      alert("Failed to seed: " + err.message);
    } finally {
      setSeeding(false);
      setTimeout(() => setActionMsg(null), 3000);
    }
  };

  if (loading || (!user && !isAuthorized)) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center text-emerald-400 font-mono text-xs">
        <span className="animate-pulse">CHECKING MALIK AUTHENTICATION...</span>
      </div>
    );
  }

  const publishedCount = projectsList.filter((p) => p.published).length;
  const draftCount = projectsList.length - publishedCount;

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <MalikNav />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Banner notification */}
        {actionMsg && (
          <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 font-mono text-xs flex items-center justify-between">
            <span>✓ {actionMsg}</span>
            <button onClick={() => setActionMsg(null)} className="text-white/40 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Top Header & Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-bold uppercase tracking-wider text-white">
              PROJECT <span className="text-emerald-400">COMMAND CENTER</span>
            </h1>
            <p className="text-xs text-white/50 font-mono">
              Manage live portfolio projects, order sequence, and Cloudinary media assets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {projectsList.some((p) => p.id?.startsWith("local-")) && (
              <button
                onClick={handleSeedDefaults}
                disabled={seeding}
                className="px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 text-xs font-mono hover:bg-cyan-900/40 transition-colors disabled:opacity-50"
              >
                {seeding ? "Importing to Firestore..." : "⚡ Sync Defaults to Firestore"}
              </button>
            )}

            <Link
              href="/malik/projects/new"
              className="px-5 py-2.5 rounded-xl border border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold text-xs tracking-wider uppercase hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10"
            >
              <span>+</span> Create New Project
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="text-[10px] text-white/50 uppercase tracking-wider">Total Projects</div>
            <div className="text-2xl font-bold text-white mt-1">{projectsList.length}</div>
          </div>
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10">
            <div className="text-[10px] text-emerald-400 uppercase tracking-wider">Live / Published</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{publishedCount}</div>
          </div>
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/10">
            <div className="text-[10px] text-amber-400 uppercase tracking-wider">Drafts</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{draftCount}</div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-mono tracking-widest text-white/70">
              Project Directory ({projectsList.length})
            </h2>
            <span className="text-[11px] font-mono text-white/40">
              Use ↑ ↓ arrows to adjust display order on /projects
            </span>
          </div>

          {dataLoading ? (
            <div className="p-12 text-center text-white/40 font-mono text-xs border border-white/10 rounded-2xl">
              Loading projects from Firestore...
            </div>
          ) : projectsList.length === 0 ? (
            <div className="p-16 text-center space-y-4 border border-dashed border-white/15 rounded-2xl bg-white/[0.01]">
              <p className="text-sm text-white/60">No projects found in database.</p>
              <div className="flex justify-center gap-3">
                <Link
                  href="/malik/projects/new"
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold text-xs uppercase"
                >
                  Create First Project
                </Link>
                <button
                  onClick={handleSeedDefaults}
                  className="px-4 py-2 rounded-lg border border-white/20 text-white text-xs font-mono"
                >
                  Seed 4 Sample Projects
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-black/40 backdrop-blur-md">
              {projectsList.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Left: Reorder controls + Thumbnail + Details */}
                  <div className="flex items-center gap-4">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1 text-white/40">
                      <button
                        onClick={() => handleMoveOrder(idx, "up")}
                        disabled={idx === 0}
                        className="hover:text-emerald-400 disabled:opacity-20 p-1 text-xs"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMoveOrder(idx, "down")}
                        disabled={idx === projectsList.length - 1}
                        className="hover:text-emerald-400 disabled:opacity-20 p-1 text-xs"
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Media Thumbnail */}
                    <div className="size-16 rounded-xl overflow-hidden border border-white/15 bg-black shrink-0 relative">
                      {p.thumbnailUrl || p.objectives?.media?.src ? (
                        <img
                          src={p.thumbnailUrl || p.objectives?.media?.src}
                          alt={p.title}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center font-mono text-[10px] text-white/30">
                          NO_IMG
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-display text-base font-bold text-white uppercase tracking-wide">
                          {p.title}
                        </h3>
                        {p.published ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            LIVE
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            DRAFT
                          </span>
                        )}
                        {p.id?.startsWith("local-") && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                            LOCAL_MOCK
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono text-white/50 flex-wrap">
                        <span>slug: /{p.slug}</span>
                        <span>•</span>
                        <span>{p.type || "General"}</span>
                        <span>•</span>
                        <span>{p.year || "2025"}</span>
                        {p.accentColor && (
                          <div className="flex items-center gap-1.5">
                            <span
                              className="size-2.5 rounded-full border border-white/30"
                              style={{ backgroundColor: p.accentColor }}
                            />
                            <span className="text-[10px]">{p.accentColor}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2.5 self-end md:self-center font-mono">
                    {/* Toggle Live */}
                    <button
                      onClick={() => handleTogglePublish(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                        p.published
                          ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/30"
                          : "border-white/20 text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                      title={p.published ? "Make Draft" : "Make Live"}
                    >
                      {p.published ? "Live" : "Draft"}
                    </button>

                    {/* View on Site */}
                    <Link
                      href={`/projects/${p.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-lg text-xs border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors"
                      title="Preview page"
                    >
                      View ↗
                    </Link>

                    {/* Edit */}
                    <Link
                      href={`/malik/projects/${p.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                    >
                      Edit
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(p)}
                      className="px-3 py-1.5 rounded-lg text-xs border border-rose-500/30 text-rose-400 hover:bg-rose-950/40 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
