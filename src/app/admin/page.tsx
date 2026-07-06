"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData, Project, Video, GalleryItem, ProfileData, ContactMessage } from "@/lib/portfolioData";

const ADMIN_PASSWORD = "Jaat@9412";
const getErrorMessage = (error: unknown) => error instanceof Error ? error.message : String(error);

// ─── Tiny UI helpers ──────────────────────────────────────────────────────────
const Input = ({ label, value, onChange, textarea = false, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-mono uppercase tracking-widest text-[#7FA1BE]">{label}</label>
    {textarea ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-[#F4F2EE] text-sm focus:outline-none focus:border-[#E8751A] transition-colors resize-none"
      />
    ) : (
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-[#F4F2EE] text-sm focus:outline-none focus:border-[#E8751A] transition-colors"
      />
    )}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", size = "md" }: {
  children: React.ReactNode; onClick: () => void; variant?: "primary" | "danger" | "ghost"; size?: "sm" | "md";
}) => {
  const base = "rounded-lg font-semibold transition-all active:scale-95 cursor-pointer";
  const sz = size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm";
  const v = variant === "primary"
    ? "bg-[#E8751A] text-[#0D0D0D] hover:bg-[#B85A12]"
    : variant === "danger"
      ? "bg-red-900/40 border border-red-700 text-red-400 hover:bg-red-900/70"
      : "border border-[#333] text-[#7FA1BE] hover:border-[#E8751A] hover:text-[#E8751A]";
  return <button className={`${base} ${sz} ${v}`} onClick={onClick}>{children}</button>;
};

const Toast = ({ msg }: { msg: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#E8751A] text-[#0D0D0D] font-bold px-6 py-3 rounded-full shadow-2xl text-sm"
  >
    {msg}
  </motion.div>
);

// ─── Cloudinary Upload Helper ────────────────────────────────────────────────
async function uploadToCloudinary(file: File): Promise<string> {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!CLOUD_NAME || !UPLOAD_PRESET || CLOUD_NAME === "your_cloud_name_here") {
    throw new Error("Missing Cloudinary configuration. Please set it in .env.local");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url;
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────
function ProjectsTab({ onSave, onError }: { onSave: () => void; onError: (m: string) => void }) {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ slug: "", title: "", type: "", description: "", techStack: "", liveUrl: "", githubUrl: "", thumbnailUrl: "", galleryUrls: [] as string[] });
  const [thumbLoading, setThumbLoading] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = editing !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [editing]);

  useEffect(() => { portfolioData.getProjects().then(setItems); }, []);

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ slug: p.slug, title: p.title, type: p.type, description: p.description || "", techStack: (p.techStack || []).join(", "), liveUrl: p.liveUrl || "", githubUrl: p.githubUrl || "", thumbnailUrl: p.thumbnailUrl || "", galleryUrls: p.galleryUrls || [] });
  };

  const openNew = () => {
    setEditing({ slug: "", title: "", type: "" });
    setForm({ slug: "", title: "", type: "", description: "", techStack: "", liveUrl: "", githubUrl: "", thumbnailUrl: "", galleryUrls: [] });
  };

  const handleThumbFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm(f => ({ ...f, thumbnailUrl: url }));
    } catch (e: unknown) {
      onError(getErrorMessage(e));
    } finally {
      setThumbLoading(false);
    }
  };

  const handleGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setGalleryLoading(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        urls.push(await uploadToCloudinary(files[i]));
      }
      setForm(f => ({ ...f, galleryUrls: [...f.galleryUrls, ...urls] }));
    } catch (e: unknown) {
      onError(getErrorMessage(e));
    } finally {
      setGalleryLoading(false);
    }
  };

  const saveItem = async () => {
    const updated: Project = { slug: form.slug, title: form.title, type: form.type, description: form.description, techStack: form.techStack.split(",").map(s => s.trim()).filter(Boolean), liveUrl: form.liveUrl, githubUrl: form.githubUrl, thumbnailUrl: form.thumbnailUrl || undefined, galleryUrls: form.galleryUrls.length > 0 ? form.galleryUrls : undefined };
    const existing = items.findIndex(p => p.slug === editing?.slug);
    const next = existing >= 0 ? items.map((p, i) => i === existing ? updated : p) : [...items, updated];
    try {
      await portfolioData.saveProjects(next);
      setItems(next); setEditing(null); onSave();
    } catch (e: unknown) {
      onError(getErrorMessage(e));
    }
  };

  const deleteItem = async (slug: string) => {
    const next = items.filter(p => p.slug !== slug);
    await portfolioData.saveProjects(next);
    setItems(next); 
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[#7FA1BE] text-sm">{items.length} projects</p>
        <Btn onClick={openNew}>+ New Project</Btn>
      </div>
      <div className="space-y-3">
        {items.map(p => (
          <div key={p.slug} className="flex items-center justify-between bg-[#111] border border-[#222] rounded-xl px-4 py-3 gap-4">
            <div className="flex items-center gap-3">
              {p.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.thumbnailUrl} alt={p.title} className="w-12 h-10 rounded-lg object-cover border border-[#333]" />
              ) : (
                <div className="w-12 h-10 rounded-lg bg-[#222] border border-[#333] flex items-center justify-center text-[#444] text-xs">No img</div>
              )}
              <div>
                <p className="text-[#F4F2EE] font-semibold text-sm">{p.title}</p>
                <p className="text-[#E8751A] text-xs font-mono uppercase mt-0.5">{p.type}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Btn size="sm" variant="ghost" onClick={() => openEdit(p)}>Edit</Btn>
              <Btn size="sm" variant="danger" onClick={() => deleteItem(p.slug)}>Delete</Btn>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-[#161616] border border-[#333] rounded-2xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto overscroll-contain">
              <h3 className="text-[#F4F2EE] font-heading font-bold text-xl">{editing.slug ? "Edit Project" : "New Project"}</h3>
              <Input label="Slug (URL ID)" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} placeholder="my-project" />
              <Input label="Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
              <Input label="Type / Category" value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))} placeholder="Web Platform" />
              <Input label="Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} textarea placeholder="Short description..." />
              <Input label="Tech Stack (comma-separated)" value={form.techStack} onChange={v => setForm(f => ({ ...f, techStack: v }))} placeholder="Next.js, React, TypeScript" />
              <Input label="Live URL" value={form.liveUrl} onChange={v => setForm(f => ({ ...f, liveUrl: v }))} />
              <Input label="GitHub URL" value={form.githubUrl} onChange={v => setForm(f => ({ ...f, githubUrl: v }))} />

              {/* ── Thumbnail picker ── */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase tracking-widest text-[#7FA1BE]">Project Thumbnail</label>
                {form.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.thumbnailUrl} alt="thumbnail preview" className="w-full h-40 object-cover rounded-xl border border-[#333]" />
                )}
                <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-colors ${
                  thumbLoading ? "border-[#E8751A]/40 text-[#E8751A]/40" : "border-[#333] hover:border-[#E8751A] text-[#7FA1BE] hover:text-[#E8751A]"
                }`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-sm font-medium">{thumbLoading ? "Uploading to Cloud..." : form.thumbnailUrl ? "Replace Image" : "Upload Thumbnail"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbFile} disabled={thumbLoading} />
                </label>
                {form.thumbnailUrl && (
                  <button onClick={() => setForm(f => ({ ...f, thumbnailUrl: "" }))} className="text-xs text-red-400 hover:text-red-300 text-left transition-colors">✕ Remove thumbnail</button>
                )}
              </div>

              {/* ── Slideshow Gallery picker ── */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#222]">
                <label className="text-xs font-mono uppercase tracking-widest text-[#7FA1BE]">Slideshow Images (Optional)</label>
                {form.galleryUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {form.galleryUrls.map((url, idx) => (
                      <div key={idx} className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Slide ${idx}`} className="w-full h-20 object-cover rounded-lg border border-[#333]" />
                        <button onClick={() => setForm(f => ({ ...f, galleryUrls: f.galleryUrls.filter((_, i) => i !== idx) }))} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400 text-xs font-bold rounded-lg backdrop-blur-sm">
                          ✕ Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-colors ${
                  galleryLoading ? "border-[#E8751A]/40 text-[#E8751A]/40" : "border-[#333] hover:border-[#E8751A] text-[#7FA1BE] hover:text-[#E8751A]"
                }`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-sm font-medium">{galleryLoading ? "Uploading to Cloud..." : "Add Images to Slideshow"}</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryFiles} disabled={galleryLoading} />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Btn onClick={saveItem}>Save Project</Btn>
                <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Videos Tab ──────────────────────────────────────────────────────────────
function VideosTab({ onSave, onError }: { onSave: () => void; onError: (m: string) => void }) {
  const [items, setItems] = useState<Video[]>([]);
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState({ id: "", title: "", subtitle: "", youtubeUrl: "", localVideoUrl: "", featured: false });
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoSource, setVideoSource] = useState<"youtube" | "local">("youtube");

  useEffect(() => {
    document.body.style.overflow = editing !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [editing]);

  useEffect(() => { portfolioData.getVideos().then(setItems); }, []);

  const openEdit = (v: Video) => {
    setEditing(v);
    const src = v.localVideoUrl ? "local" : "youtube";
    setVideoSource(src);
    setForm({ id: v.id, title: v.title, subtitle: v.subtitle || "", youtubeUrl: v.youtubeUrl || "", localVideoUrl: v.localVideoUrl || "", featured: !!v.featured });
  };
  const openNew = () => {
    setEditing({ id: "", title: "" });
    setVideoSource("youtube");
    setForm({ id: "", title: "", subtitle: "", youtubeUrl: "", localVideoUrl: "", featured: false });
  };

  const handleVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm(f => ({ ...f, localVideoUrl: url, youtubeUrl: "" }));
    } catch (e: unknown) {
      onError(getErrorMessage(e));
    } finally {
      setVideoLoading(false);
    }
  };

  const saveItem = async () => {
    const updated: Video = {
      id: form.id, title: form.title, subtitle: form.subtitle, featured: form.featured,
      youtubeUrl: videoSource === "youtube" ? form.youtubeUrl : undefined,
      localVideoUrl: videoSource === "local" ? form.localVideoUrl : undefined,
    };
    const existing = items.findIndex(v => v.id === editing?.id);
    const next = existing >= 0 ? items.map((v, i) => i === existing ? updated : v) : [...items, updated];
    try {
      await portfolioData.saveVideos(next);
      setItems(next); setEditing(null); onSave();
    } catch (e: unknown) {
      onError(getErrorMessage(e));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[#7FA1BE] text-sm">{items.length} videos</p>
        <Btn onClick={openNew}>+ New Video</Btn>
      </div>
      <div className="space-y-3">
        {items.map(v => (
          <div key={v.id} className="flex items-center justify-between bg-[#111] border border-[#222] rounded-xl px-4 py-3 gap-4">
            <div>
              <p className="text-[#F4F2EE] font-semibold text-sm">{v.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {v.featured && <span className="text-xs font-mono text-[#E8751A] uppercase">★ Featured</span>}
                {v.localVideoUrl && <span className="text-xs font-mono text-[#A9C4DA] bg-[#A9C4DA]/10 px-2 py-0.5 rounded-full">📁 Local</span>}
                {v.youtubeUrl && <span className="text-xs font-mono text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">▶ YouTube</span>}
              </div>
            </div>
            <Btn size="sm" variant="ghost" onClick={() => openEdit(v)}>Edit</Btn>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-[#161616] border border-[#333] rounded-2xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto overscroll-contain">
              <h3 className="text-[#F4F2EE] font-heading font-bold text-xl">Video Entry</h3>
              <Input label="ID" value={form.id} onChange={v => setForm(f => ({ ...f, id: v }))} />
              <Input label="Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
              <Input label="Subtitle" value={form.subtitle} onChange={v => setForm(f => ({ ...f, subtitle: v }))} />

              {/* ── Source toggle ── */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase tracking-widest text-[#7FA1BE]">Video Source</label>
                <div className="flex bg-[#0D0D0D] border border-[#333] rounded-xl p-1 gap-1">
                  {(["youtube", "local"] as const).map(src => (
                    <button key={src} onClick={() => setVideoSource(src)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                        videoSource === src ? "bg-[#E8751A] text-[#0D0D0D]" : "text-[#7FA1BE] hover:text-[#F4F2EE]"
                      }`}>
                      {src === "youtube" ? "▶ YouTube URL" : "📁 Local File"}
                    </button>
                  ))}
                </div>
              </div>

              {videoSource === "youtube" ? (
                <Input label="YouTube URL" value={form.youtubeUrl} onChange={v => setForm(f => ({ ...f, youtubeUrl: v }))} placeholder="https://youtube.com/watch?v=..." />
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-[#7FA1BE]">Local Video File</label>
                  {form.localVideoUrl && (
                    <video src={form.localVideoUrl} controls className="w-full rounded-xl border border-[#333] max-h-40" />
                  )}
                  <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-colors ${
                    videoLoading ? "border-[#E8751A]/40 text-[#E8751A]/40" : "border-[#333] hover:border-[#E8751A] text-[#7FA1BE] hover:text-[#E8751A]"
                  }`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    <span className="text-sm font-medium">{videoLoading ? "Uploading to Cloud..." : form.localVideoUrl ? "Replace Video" : "Select Video File"}</span>
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoFile} disabled={videoLoading} />
                  </label>
                  {form.localVideoUrl && (
                    <button onClick={() => setForm(f => ({ ...f, localVideoUrl: "" }))} className="text-xs text-red-400 hover:text-red-300 text-left transition-colors">✕ Remove video</button>
                  )}
                </div>
              )}

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-[#E8751A] w-4 h-4" />
                <span className="text-sm text-[#A9C4DA]">Featured video</span>
              </label>
              <div className="flex gap-3 pt-2">
                <Btn onClick={saveItem}>Save</Btn>
                <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Gallery Tab ─────────────────────────────────────────────────────────────
function GalleryTab({ onSave, onError }: { onSave: () => void; onError: (m: string) => void }) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState({ id: "", title: "", category: "", imageUrl: "" });

  useEffect(() => {
    document.body.style.overflow = editing !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [editing]);

  useEffect(() => { portfolioData.getGallery().then(setItems); }, []);

  const openEdit = (g: GalleryItem) => { setEditing(g); setForm({ id: g.id, title: g.title, category: g.category || "", imageUrl: g.imageUrl || "" }); };
  const openNew = () => { setEditing({ id: "", title: "" }); setForm({ id: Date.now().toString(), title: "", category: "", imageUrl: "" }); };

  const saveItem = async () => {
    const updated: GalleryItem = { ...editing!, ...form };
    const existing = items.findIndex(g => g.id === editing?.id);
    const next = existing >= 0 ? items.map((g, i) => i === existing ? updated : g) : [...items, updated];
    try {
      await portfolioData.saveGallery(next);
      setItems(next); setEditing(null); onSave();
    } catch (e: unknown) {
      onError(getErrorMessage(e));
    }
  };

  const deleteItem = async (id: string) => {
    const next = items.filter(g => g.id !== id);
    await portfolioData.saveGallery(next);
    setItems(next); 
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[#7FA1BE] text-sm">{items.length} items</p>
        <Btn onClick={openNew}>+ Add Image</Btn>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(g => (
          <div key={g.id} className="bg-[#111] border border-[#222] rounded-xl p-3 space-y-2">
            <p className="text-[#F4F2EE] font-semibold text-sm truncate">{g.title}</p>
            <p className="text-[#7FA1BE] text-xs">{g.category}</p>
            <div className="flex gap-2">
              <Btn size="sm" variant="ghost" onClick={() => openEdit(g)}>Edit</Btn>
              <Btn size="sm" variant="danger" onClick={() => deleteItem(g.id)}>✕</Btn>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-[#161616] border border-[#333] rounded-2xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto overscroll-contain">
              <h3 className="text-[#F4F2EE] font-heading font-bold text-xl">Gallery Item</h3>
              <Input label="Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
              <Input label="Category" value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} />
              <Input label="Image URL (optional)" value={form.imageUrl} onChange={v => setForm(f => ({ ...f, imageUrl: v }))} />
              <div className="flex gap-3 pt-2">
                <Btn onClick={saveItem}>Save</Btn>
                <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { defaultProfile } from "@/lib/portfolioData";

function ProfileTab({ onSave, onError }: { onSave: () => void; onError: (m: string) => void }) {
  const [form, setForm] = useState<ProfileData>(defaultProfile);
  
  useEffect(() => { portfolioData.getProfile().then(setForm); }, []);
  const [skillInput, setSkillInput] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);

  const addSkill = () => {
    if (skillInput.trim()) { setForm(f => ({ ...f, skills: [...f.skills, skillInput.trim()] })); setSkillInput(""); }
  };
  const removeSkill = (i: number) => setForm(f => ({ ...f, skills: f.skills.filter((_, idx) => idx !== i) }));

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm(f => ({ ...f, avatarUrl: url }));
    } catch (e: unknown) {
      onError(getErrorMessage(e));
    } finally {
      setAvatarLoading(false);
    }
  };

  const save = async () => {
    try {
      await portfolioData.saveProfile(form); onSave();
    } catch (e: unknown) {
      onError(getErrorMessage(e));
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Avatar uploader ── */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono uppercase tracking-widest text-[#7FA1BE]">Profile Picture</label>
        <div className="flex items-center gap-5">
          {/* Avatar preview */}
          <div className="relative w-20 h-20 rounded-full border-2 border-[#E8751A]/60 overflow-hidden bg-[#111] shrink-0 flex items-center justify-center">
            {form.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          {/* Upload / remove */}
          <div className="flex flex-col gap-2 flex-1">
            <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition-colors ${
              avatarLoading ? "border-[#E8751A]/40 text-[#E8751A]/40" : "border-[#333] hover:border-[#E8751A] text-[#7FA1BE] hover:text-[#E8751A]"
            }`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-sm font-medium">
                {avatarLoading ? "Uploading to Cloud..." : form.avatarUrl ? "Replace Photo" : "Upload Photo"}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} disabled={avatarLoading} />
            </label>
            {form.avatarUrl && (
              <button
                onClick={() => setForm(f => ({ ...f, avatarUrl: "" }))}
                className="text-xs text-red-400 hover:text-red-300 transition-colors text-left"
              >
                ✕ Remove photo
              </button>
            )}
          </div>
        </div>
      </div>

      <Input label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
      <Input label="Role" value={form.role} onChange={v => setForm(f => ({ ...f, role: v }))} />
      <Input label="Location" value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} />
      <Input label="Bio (paragraph 1)" value={form.bio} onChange={v => setForm(f => ({ ...f, bio: v }))} textarea />
      <Input label="Bio (paragraph 2)" value={form.bio2} onChange={v => setForm(f => ({ ...f, bio2: v }))} textarea />
      <div>
        <label className="text-xs font-mono uppercase tracking-widest text-[#7FA1BE] mb-2 block">Skills</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.skills.map((s, i) => (
            <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full border border-[#333] bg-[#111] text-[#A9C4DA] text-xs">
              {s}
              <button onClick={() => removeSkill(i)} className="text-red-400 hover:text-red-300 ml-1">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()}
            placeholder="Add skill..." className="bg-[#111] border border-[#333] rounded-xl px-4 py-2 text-[#F4F2EE] text-sm focus:outline-none focus:border-[#E8751A] flex-1" />
          <Btn onClick={addSkill}>Add</Btn>
        </div>
      </div>
      <Btn onClick={save}>Save Profile</Btn>
    </div>
  );
}

// ─── Messages Tab ────────────────────────────────────────────────────────────
function MessagesTab() {
  const [items, setItems] = useState<ContactMessage[]>([]);

  useEffect(() => { portfolioData.getMessages().then(setItems); }, []);

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const next = items.filter(m => m.id !== id);
    await portfolioData.saveMessages(next);
    setItems(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[#7FA1BE] text-sm">{items.length} messages</p>
      </div>
      <div className="space-y-4">
        {items.length === 0 && <p className="text-[#444] text-center py-10 font-mono text-sm">No transmissions received yet.</p>}
        {items.map(m => (
          <div key={m.id} className="bg-[#111] border border-[#222] rounded-xl p-5 space-y-4 relative group">
            <button onClick={() => deleteItem(m.id)} className="absolute top-4 right-4 text-xs text-red-500/0 group-hover:text-red-400 transition-colors font-mono">
              ✕ Delete
            </button>
            <div className="flex justify-between items-start mr-10">
              <div>
                <p className="text-[#F4F2EE] font-bold text-lg">{m.name}</p>
                <a href={`mailto:${m.email}`} className="text-[#E8751A] hover:text-[#B85A12] transition-colors text-xs font-mono">{m.email}</a>
              </div>
              <p className="text-[#7FA1BE] text-xs font-mono text-right">{new Date(m.date).toLocaleString()}</p>
            </div>
            <div className="bg-[#0D0D0D] border border-[#333] rounded-lg p-4">
              <p className="text-[#A9C4DA] text-sm whitespace-pre-wrap leading-relaxed">{m.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
const TABS = ["Projects", "Videos", "Gallery", "Profile", "Messages"] as const;
type Tab = typeof TABS[number];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Projects");
  const [toast, setToast] = useState("");
  const [stats, setStats] = useState({ projects: 0, videos: 0, gallery: 0, skills: 0, messages: 0 });

  const loadStats = () => {
    Promise.all([
      portfolioData.getProjects(),
      portfolioData.getVideos(),
      portfolioData.getGallery(),
      portfolioData.getProfile(),
      portfolioData.getMessages()
    ]).then(([p, v, g, prof, m]) => {
      setStats({
        projects: p.length,
        videos: v.length,
        gallery: g.length,
        skills: prof.skills.length,
        messages: m.length
      });
    });
  };

  const migrateFromLocalStorage = async () => {
    if (!confirm("Migrate data from LocalStorage to the Cloud? This will overwrite current Cloud data.")) return;
    try {
      const p = localStorage.getItem("portfolio_projects");
      if (p) await portfolioData.saveProjects(JSON.parse(p));
      const v = localStorage.getItem("portfolio_videos");
      if (v) await portfolioData.saveVideos(JSON.parse(v));
      const g = localStorage.getItem("portfolio_gallery");
      if (g) await portfolioData.saveGallery(JSON.parse(g));
      const pr = localStorage.getItem("portfolio_profile");
      if (pr) await portfolioData.saveProfile(JSON.parse(pr));
      showToast("Migration successful!");
      loadStats();
      setTimeout(() => window.location.reload(), 1000);
    } catch (e: unknown) {
      setToast("Migration failed: " + getErrorMessage(e));
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "1") {
      setAuthed(true);
      loadStats();
    }
  }, []);

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "1");
      setAuthed(true);
      setPwError(false);
      loadStats();
    } else {
      setPwError(true);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const logout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
    setPw("");
  };

  // ── Auth Gate ──
  if (!authed) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0D0D0D] px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-[#161616] border border-[#222] rounded-2xl p-8 shadow-2xl space-y-6">
          <div>
            <p className="text-xs font-mono text-[#E8751A] tracking-widest uppercase">Restricted Area</p>
            <h1 className="text-3xl font-heading font-bold text-[#F4F2EE] mt-1">Admin Access</h1>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setPwError(false); }}
              onKeyDown={e => e.key === "Enter" && login()}
              placeholder="Enter password"
              className={`w-full bg-[#111] border rounded-xl px-4 py-3 text-[#F4F2EE] text-sm focus:outline-none transition-colors ${pwError ? "border-red-500 focus:border-red-500" : "border-[#333] focus:border-[#E8751A]"}`}
            />
            {pwError && <p className="text-red-400 text-xs">Incorrect password.</p>}
            <button onClick={login}
              className="w-full bg-[#E8751A] text-[#0D0D0D] font-bold rounded-xl py-3 hover:bg-[#B85A12] transition-colors active:scale-95">
              Unlock Dashboard
            </button>
          </div>
          <p className="text-xs text-[#333] text-center font-mono">This page is not publicly linked.</p>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen w-full bg-[#0D0D0D] px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
        <div>
          <p className="text-xs font-mono text-[#E8751A] uppercase tracking-widest">Admin Dashboard</p>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#F4F2EE] mt-0.5">Portfolio Control</h1>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={migrateFromLocalStorage} className="text-xs text-[#E8751A] hover:text-[#B85A12] transition-colors font-mono border border-[#E8751A]/50 px-3 py-1.5 rounded-lg">
            Migrate Local Data to Cloud
          </button>
          <a href="/" target="_blank" className="text-xs text-[#7FA1BE] hover:text-[#E8751A] transition-colors font-mono border border-[#333] px-3 py-1.5 rounded-lg">
            ↗ View Site
          </a>
          <button onClick={logout} className="text-xs text-red-400 hover:text-red-300 font-mono border border-red-900 px-3 py-1.5 rounded-lg transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
        {[
          { label: "Projects", value: stats.projects, color: "#E8751A" },
          { label: "Videos", value: stats.videos, color: "#7FA1BE" },
          { label: "Gallery", value: stats.gallery, color: "#A9C4DA" },
          { label: "Skills", value: stats.skills, color: "#D9C7B8" },
          { label: "Messages", value: stats.messages, color: "#7FA1BE" },
        ].map(s => (
          <div key={s.label} className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-4">
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: s.color }}>{s.label}</p>
            <p className="text-3xl font-heading font-bold text-[#F4F2EE] mt-1">{s.value}</p>
          </div>
        ))}
      </div>


      {/* Tabs */}
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-1 bg-[#111] border border-[#222] rounded-2xl p-1.5 mb-6 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab ? "bg-[#E8751A] text-[#0D0D0D]" : "text-[#7FA1BE] hover:text-[#F4F2EE]"}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {activeTab === "Projects" && <ProjectsTab onSave={() => { showToast("Projects saved!"); loadStats(); }} onError={showToast} />}
              {activeTab === "Videos" && <VideosTab onSave={() => { showToast("Videos saved!"); loadStats(); }} onError={showToast} />}
              {activeTab === "Gallery" && <GalleryTab onSave={() => { showToast("Gallery saved!"); loadStats(); }} onError={showToast} />}
              {activeTab === "Profile" && <ProfileTab onSave={() => { showToast("Profile saved!"); loadStats(); }} onError={showToast} />}
              {activeTab === "Messages" && <MessagesTab />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Reset all */}
        <div className="mt-4 flex justify-end">
          <button onClick={() => { portfolioData.resetAll(); showToast("Reset to defaults"); }}
            className="text-xs text-red-500/60 hover:text-red-400 font-mono transition-colors">
            Reset all to defaults
          </button>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>{toast && <Toast msg={toast} />}</AnimatePresence>
    </div>
  );
}
