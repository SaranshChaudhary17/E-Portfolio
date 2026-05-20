"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Search, Save, LayoutDashboard, Image as ImageIcon, Video, User, Settings, LogOut, CheckCircle2, Loader2, Trash, Mail, Edit3, Plus, X, UploadCloud, Link as LinkIcon, Github, PlayCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | false>(false); // tracks what is uploading
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data states
  const [projects, setProjects] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({ name: "", role: "", location: "", bio: "", bio2: "", email: "", avatarUrl: "", skills: [] });
  const [socials, setSocials] = useState<any>({
    email: "hello@saransh.dev",
    github: "https://github.com/SaranshChaudhary17",
    githubUser: "SaranshChaudhary17",
    linkedin: "https://linkedin.com",
    linkedinUser: "Saransh Chaudhary",
    instagram: "https://instagram.com",
    instagramUser: "Creative visuals"
  });

  // Edit states
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [editingMediaTitle, setEditingMediaTitle] = useState("");
  const [editingMediaCategory, setEditingMediaCategory] = useState("");
  
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [newVideo, setNewVideo] = useState<any>({ title: "", subtitle: "", type: "youtube", url: "", featured: false });

  const fetchContent = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "cinematic_portfolio_data", "main");
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        const data = snap.data();
        setProjects(data.projects || []);
        setGallery(data.gallery || []);
        setVideos(data.videos || []);
        setMessages(data.messages || []);
        setProfile(data.profile || { name: "", role: "", location: "", bio: "", bio2: "", email: "", avatarUrl: "", skills: [] });
        setSocials(data.socials || {
          email: data.profile?.email || "hello@saransh.dev",
          github: "https://github.com/SaranshChaudhary17",
          githubUser: "SaranshChaudhary17",
          linkedin: "https://linkedin.com",
          linkedinUser: "Saransh Chaudhary",
          instagram: "https://instagram.com",
          instagramUser: "Creative visuals"
        });
      } else {
        await setDoc(docRef, { projects: [], gallery: [], videos: [], messages: [], profile: {}, socials: {} });
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchContent();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://media-library.cloudinary.com/global/all.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        const existingScript = document.querySelector('script[src="https://media-library.cloudinary.com/global/all.js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, []);

  const openCloudinaryMediaLibrary = (onInsert: (urls: string[]) => void, multiple = false) => {
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      const widget = (window as any).cloudinary.createMediaLibrary({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "",
        multiple: multiple,
        remove_header: false
      }, {
        insertHandler: (data: any) => {
          const urls = data.assets.map((asset: any) => asset.secure_url);
          onInsert(urls);
        }
      });
      widget.show();
    } else {
      alert("Cloudinary Media Library script is still loading. Please try again in a moment.");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Jaat@9412") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid security clearance code.");
    }
  };

  const showSuccess = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // --- Profile Logic ---
  const handleSaveProfile = async () => {
    try {
      const docRef = doc(db, "cinematic_portfolio_data", "main");
      await updateDoc(docRef, { profile });
      showSuccess();
    } catch (e) {
      console.error(e);
      setError("Failed to save profile.");
    }
  };

  const handleSaveSocials = async () => {
    try {
      const docRef = doc(db, "cinematic_portfolio_data", "main");
      await updateDoc(docRef, { socials });
      showSuccess();
    } catch (e) {
      console.error(e);
      setError("Failed to save social links.");
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      setProfile({ ...profile, skills: [...(profile.skills || []), newSkill.trim()] });
      setNewSkill("");
    }
  };
  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({ ...profile, skills: (profile.skills || []).filter((s: string) => s !== skillToRemove) });
  };

  // --- Cloudinary Upload Logic ---
  const uploadToCloudinary = async (file: File) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "portfolio");

    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url;
  };

  // General Media Upload (Avatar, Gallery image, Project Thumbnail)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "avatar" | "gallery" | "project_thumbnail" | "project_gallery" | "video_local") => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(target);

      if (target === "project_gallery") {
        const uploadPromises = files.map(file => uploadToCloudinary(file));
        const urls = await Promise.all(uploadPromises);
        setEditingProject({
          ...editingProject,
          galleryUrls: [...(editingProject.galleryUrls || []), ...urls]
        });
      } else if (target === "gallery") {
        const uploadPromises = files.map(async (file, index) => {
          const url = await uploadToCloudinary(file);
          return {
            id: (Date.now() + index + Math.random()).toString(),
            url,
            title: file.name,
            category: "Uncategorized",
            createdAt: new Date().toISOString()
          };
        });
        const newItems = await Promise.all(uploadPromises);
        const docRef = doc(db, "cinematic_portfolio_data", "main");
        const updatedGallery = [...gallery, ...newItems];
        await updateDoc(docRef, { gallery: updatedGallery });
        setGallery(updatedGallery);
      } else {
        const file = files[0];
        const url = await uploadToCloudinary(file);
        
        if (target === "avatar") {
          setProfile({ ...profile, avatarUrl: url });
        } else if (target === "project_thumbnail") {
          setEditingProject({ ...editingProject, thumbnail: url });
        } else if (target === "video_local") {
          setNewVideo({ ...newVideo, url });
        }
      }

      showSuccess();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file(s).");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // --- Project Logic ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "cinematic_portfolio_data", "main");
      let newProjects;
      
      const techArray = typeof editingProject.tech === "string" 
        ? editingProject.tech.split(",").map((t: string) => t.trim()).filter(Boolean) 
        : editingProject.tech;

      const finalProject = {
        ...editingProject,
        tech: techArray,
        id: editingProject.id || Date.now().toString()
      };

      if (projects.find(p => p.id === finalProject.id)) {
        newProjects = projects.map(p => p.id === finalProject.id ? finalProject : p);
      } else {
        newProjects = [...projects, finalProject];
      }

      await updateDoc(docRef, { projects: newProjects });
      setProjects(newProjects);
      
      setShowProjectForm(false);
      setEditingProject(null);
      showSuccess();
    } catch (err) {
      console.error("Save project failed:", err);
    }
  };

  // --- Video Logic ---
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "cinematic_portfolio_data", "main");
      const finalVideo = { ...newVideo, id: Date.now().toString(), createdAt: new Date().toISOString() };
      await updateDoc(docRef, { videos: arrayUnion(finalVideo) });
      setVideos([...videos, finalVideo]);
      setShowVideoForm(false);
      setNewVideo({ title: "", subtitle: "", type: "youtube", url: "", featured: false });
      showSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Deletion and Edits ---
  const handleDelete = async (fieldName: "gallery" | "videos" | "projects", item: any) => {
    try {
      const docRef = doc(db, "cinematic_portfolio_data", "main");
      await updateDoc(docRef, { [fieldName]: arrayRemove(item) });
      
      if (fieldName === "projects") setProjects(projects.filter(p => p.id !== item.id));
      if (fieldName === "gallery") setGallery(gallery.filter(g => g.id !== item.id));
      if (fieldName === "videos") setVideos(videos.filter(v => v.id !== item.id));
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const handleEditMediaData = async (fieldName: "gallery" | "videos", id: string) => {
    try {
      const targetArray = fieldName === "gallery" ? gallery : videos;
      const newArray = targetArray.map(item => {
        if (item.id === id) {
          if (fieldName === "gallery") return { ...item, title: editingMediaTitle, category: editingMediaCategory };
          if (fieldName === "videos") return { ...item, title: editingMediaTitle };
        }
        return item;
      });
      
      const docRef = doc(db, "cinematic_portfolio_data", "main");
      await updateDoc(docRef, { [fieldName]: newArray });
      
      if (fieldName === "gallery") setGallery(newArray);
      if (fieldName === "videos") setVideos(newArray);
      
      setEditingMediaId(null);
      showSuccess();
    } catch (e) {
      console.error("Rename failed:", e);
    }
  };

  const handleDeleteMessage = async (msg: any) => {
    try {
      const docRef = doc(db, "cinematic_portfolio_data", "main");
      await updateDoc(docRef, { messages: arrayRemove(msg) });
      setMessages(messages.filter(m => m.id !== msg.id));
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const handleResetPortfolio = async () => {
    if (confirm("Are you sure you want to RESET the entire portfolio to defaults? This deletes all data!")) {
      try {
        const docRef = doc(db, "cinematic_portfolio_data", "main");
        await setDoc(docRef, { projects: [], gallery: [], videos: [], messages: [], profile: {} });
        fetchContent();
        showSuccess();
      } catch (e) {
        console.error(e);
      }
    }
  }

  // --- View Rendering ---

  if (!isAuthenticated) {
    return (
      <section className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass w-full max-w-md rounded-[2rem] p-8 text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-ember/10 border border-ember/30 text-ember shadow-glow">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl font-black uppercase text-pearl mb-2">Restricted Access</h1>
          <p className="text-parchment/60 mb-8 text-sm">Enter the command override code to access the portfolio CMS.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password..." className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none transition focus:border-ember/50 focus:bg-black/60" />
              {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            </div>
            <Button type="submit" className="w-full py-6 text-sm font-bold uppercase tracking-wider">Authenticate</Button>
          </form>
        </motion.div>
      </section>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: Search },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "videos", label: "Videos", icon: Video },
    { id: "profile", label: "Profile", icon: User },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <section className="min-h-screen px-4 pb-24 pt-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Mobile Collapsible Navigation Header */}
          <div className="lg:hidden glass rounded-2xl p-4 flex flex-col gap-2 z-30 sticky top-24">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ember leading-none">Creator Studio</p>
                <p className="mt-1 text-lg font-display font-black text-pearl leading-none">Admin Panel</p>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-parchment/12 px-4 py-2.5 text-xs font-semibold text-pearl hover:bg-white/10 transition"
              >
                {(() => {
                  const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon || LayoutDashboard;
                  return <><ActiveIcon className="h-4 w-4 text-ember shadow-glow" /> {tabs.find(t => t.id === activeTab)?.label}</>;
                })()}
                <span className="text-parchment/40 text-[10px] ml-1">▼</span>
              </button>
            </div>
            
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden flex flex-col gap-1 mt-3 pt-3 border-t border-parchment/10"
                >
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => { 
                          setActiveTab(tab.id); 
                          setShowProjectForm(false); 
                          setShowVideoForm(false); 
                          setIsMobileMenuOpen(false); 
                        }}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                          isActive ? "bg-ember/15 text-ember border border-ember/30" : "text-parchment/60 hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <Icon className="h-4 w-4" /> {tab.label}
                      </button>
                    );
                  })}
                  <button 
                    onClick={() => { setIsAuthenticated(false); setIsMobileMenuOpen(false); }} 
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-parchment/60 hover:bg-white/5 hover:text-red-400 transition border border-transparent mt-2"
                  >
                    <LogOut className="h-4 w-4" /> Disconnect
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Sticky Sidebar */}
          <aside className="hidden lg:flex glass shrink-0 lg:w-64 rounded-[1.75rem] p-5 flex-col h-[calc(100vh-10rem)] sticky top-24 z-10">
            <div className="mb-8 px-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Creator Studio</p>
              <p className="mt-1 text-2xl font-display font-black text-pearl">Admin Panel</p>
            </div>
            <nav className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setShowProjectForm(false); setShowVideoForm(false); }}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive ? "bg-ember/15 text-ember border border-ember/30 shadow-glow" : "text-parchment/60 hover:bg-white/5 hover:text-pearl border border-transparent"
                    }`}
                  >
                    <Icon className="h-5 w-5" /> {tab.label}
                  </button>
                );
              })}
            </nav>
            <button onClick={() => setIsAuthenticated(false)} className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-parchment/60 hover:bg-white/5 hover:text-red-400 transition">
              <LogOut className="h-5 w-5" /> Disconnect
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 glass rounded-[1.75rem] p-6 lg:p-10 relative overflow-hidden min-h-[600px]">
            {/* Success Toast */}
            <AnimatePresence>
              {saved && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-6 left-1/2 -translate-x-1/2 bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold backdrop-blur-md z-20">
                  <CheckCircle2 className="h-4 w-4" /> Changes saved successfully
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl font-black uppercase text-pearl">
                {showProjectForm ? "Edit Project" : showVideoForm ? "Add Video" : tabs.find(t => t.id === activeTab)?.label}
              </h2>
              {activeTab === "profile" && !showProjectForm && (
                <Button onClick={handleSaveProfile} className="gap-2"><Save className="h-4 w-4" /> Save Profile</Button>
              )}
              {activeTab === "projects" && !showProjectForm && (
                <Button onClick={() => { setEditingProject({ tech: "", galleryUrls: [] }); setShowProjectForm(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add Project</Button>
              )}
              {activeTab === "videos" && !showVideoForm && (
                <Button onClick={() => { setNewVideo({ title: "", subtitle: "", type: "youtube", url: "", featured: false }); setShowVideoForm(true); }} className="gap-2"><Plus className="h-4 w-4" /> Add Video</Button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-ember" /></div>
            ) : (
              <div className="space-y-6">
                
                {/* 1. Dashboard */}
                {activeTab === "dashboard" && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-parchment/12 bg-black/25 p-5"><div className="font-display text-2xl font-bold text-ember">{projects.length}</div><div className="mt-1 text-xs uppercase tracking-widest text-parchment/60">Projects</div></div>
                    <div className="rounded-2xl border border-parchment/12 bg-black/25 p-5"><div className="font-display text-2xl font-bold text-ember">{gallery.length}</div><div className="mt-1 text-xs uppercase tracking-widest text-parchment/60">Gallery Items</div></div>
                    <div className="rounded-2xl border border-parchment/12 bg-black/25 p-5"><div className="font-display text-2xl font-bold text-ember">{videos.length}</div><div className="mt-1 text-xs uppercase tracking-widest text-parchment/60">Videos</div></div>
                    <div className="rounded-2xl border border-parchment/12 bg-black/25 p-5"><div className="font-display text-2xl font-bold text-ember">{messages.length}</div><div className="mt-1 text-xs uppercase tracking-widest text-parchment/60">Messages</div></div>
                    <div className="sm:col-span-2 lg:col-span-4 rounded-2xl border border-parchment/12 bg-black/25 p-6 mt-4">
                      <p className="text-parchment/70">Connected to <strong>Cloudinary</strong> for fast media delivery and <strong>Firestore</strong> for data persistence.</p>
                    </div>
                  </div>
                )}

                {/* 2. Projects */}
                {activeTab === "projects" && showProjectForm && (
                  <form onSubmit={handleSaveProject} className="space-y-6">
                    {/* Media Section */}
                    <div className="p-5 rounded-2xl border border-parchment/12 bg-black/20 space-y-4">
                      <h3 className="font-bold text-pearl text-sm uppercase tracking-widest mb-4">Project Media</h3>
                      <div className="grid md:grid-cols-[200px_1fr] gap-6">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Thumbnail Cover</label>
                          <div className="aspect-video bg-black/40 border-2 border-dashed border-parchment/20 rounded-xl flex items-center justify-center relative overflow-hidden group">
                            {editingProject.thumbnail ? (
                              <img src={editingProject.thumbnail} alt="thumb" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-center p-2"><ImageIcon className="h-6 w-6 mx-auto mb-1 text-parchment/40" /><span className="text-[10px] text-parchment/50 uppercase">No Image</span></div>
                            )}
                            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                              {uploading === "project_thumbnail" ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-6 w-6 text-white" />}
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "project_thumbnail")} />
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => openCloudinaryMediaLibrary((urls) => setEditingProject((prev: any) => ({ ...prev, thumbnail: urls[0] })))}
                            className="mt-2 w-full rounded-xl bg-white/5 border border-parchment/10 text-pearl hover:bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition duration-300 flex items-center justify-center gap-2"
                          >
                            <UploadCloud className="h-4 w-4" /> Select from Cloudinary Library
                          </button>
                          <label className="mt-2 w-full rounded-xl bg-white/5 border border-parchment/10 text-pearl hover:bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition duration-300 flex items-center justify-center gap-2 cursor-pointer">
                            {uploading === "project_thumbnail" ? (
                              <Loader2 className="h-4 w-4 animate-spin text-ember" />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-ember" />
                            )}
                            Select from Local Storage
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "project_thumbnail")} />
                          </label>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Slideshow Gallery ({editingProject.galleryUrls?.length || 0})</label>
                          <div className="flex flex-wrap gap-2">
                            {(editingProject.galleryUrls || []).map((url: string, i: number) => (
                              <div key={i} className="h-16 w-16 rounded-md overflow-hidden relative group">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setEditingProject({...editingProject, galleryUrls: editingProject.galleryUrls.filter((_:any, idx:number) => idx !== i)})} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Trash className="h-4 w-4 text-white" /></button>
                              </div>
                            ))}
                            <label className="h-16 w-16 bg-black/40 border border-dashed border-parchment/30 rounded-md flex items-center justify-center cursor-pointer hover:border-ember transition">
                              {uploading === "project_gallery" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 text-parchment/50" />}
                              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload(e, "project_gallery")} />
                            </label>
                          </div>
                          <div className="mt-2 flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                openCloudinaryMediaLibrary((urls) => {
                                  setEditingProject((prev: any) => ({
                                    ...prev,
                                    galleryUrls: [...(prev.galleryUrls || []), ...urls]
                                  }));
                                }, true);
                              }}
                              className="w-full rounded-xl bg-white/5 border border-parchment/10 text-pearl hover:bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition duration-300 flex items-center justify-center gap-2"
                            >
                              <UploadCloud className="h-4 w-4" /> Browse Cloudinary Library
                            </button>
                            <label className="w-full rounded-xl bg-white/5 border border-parchment/10 text-pearl hover:bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition duration-300 flex items-center justify-center gap-2 cursor-pointer">
                              {uploading === "project_gallery" ? (
                                <Loader2 className="h-4 w-4 animate-spin text-ember" />
                              ) : (
                                <ImageIcon className="h-4 w-4 text-ember" />
                              )}
                              Upload from Local Storage
                              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload(e, "project_gallery")} />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Title</label><input required type="text" value={editingProject.title || ""} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" /></div>
                      <div><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Slug (URL friendly)</label><input required type="text" value={editingProject.slug || ""} onChange={e => setEditingProject({...editingProject, slug: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" /></div>
                      <div><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Category / Type</label><input required type="text" value={editingProject.category || ""} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" /></div>
                      <div><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Year</label><input type="text" value={editingProject.year || ""} onChange={e => setEditingProject({...editingProject, year: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" /></div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2"><Github className="inline w-3 h-3 mr-1"/> GitHub Repo URL</label>
                        <input type="text" value={editingProject.github || ""} onChange={e => setEditingProject({...editingProject, github: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2"><LinkIcon className="inline w-3 h-3 mr-1"/> Live Demo URL</label>
                        <input type="text" value={editingProject.liveUrl || ""} onChange={e => setEditingProject({...editingProject, liveUrl: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" />
                      </div>
                      <div className="md:col-span-2"><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Tagline (Short Summary)</label><input type="text" value={editingProject.tagline || ""} onChange={e => setEditingProject({...editingProject, tagline: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" /></div>
                      <div className="md:col-span-2"><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Full Description</label><textarea required rows={4} value={editingProject.summary || ""} onChange={e => setEditingProject({...editingProject, summary: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50"></textarea></div>
                      <div className="md:col-span-2"><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Tech Stack (comma separated)</label><input type="text" value={typeof editingProject.tech === "string" ? editingProject.tech : (editingProject.tech || []).join(", ")} onChange={e => setEditingProject({...editingProject, tech: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" /></div>
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-parchment/10">
                      <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Save Project</Button>
                      <Button type="button" variant="secondary" onClick={() => setShowProjectForm(false)}>Cancel</Button>
                    </div>
                  </form>
                )}

                {activeTab === "projects" && !showProjectForm && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((proj) => (
                      <div key={proj.id} className="bg-black/20 rounded-xl border border-parchment/10 overflow-hidden group">
                        <div className="h-32 bg-black/40 relative">
                          {proj.thumbnail ? <img src={proj.thumbnail} className="w-full h-full object-cover opacity-60" /> : <div className="absolute inset-0 bg-gradient-to-br from-parchment/5 to-transparent"></div>}
                          <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                            <span className="font-bold text-pearl leading-tight">{proj.title || "Untitled"}</span>
                            <span className="text-[10px] uppercase text-ember">{proj.category}</span>
                          </div>
                        </div>
                        <div className="p-3 flex justify-between bg-black/40 border-t border-parchment/5">
                          <button onClick={() => { setEditingProject(proj); setShowProjectForm(true); }} className="text-xs text-parchment/60 hover:text-white transition flex items-center gap-1"><Edit3 className="h-3 w-3" /> Edit</button>
                          <button onClick={() => handleDelete("projects", proj)} className="text-xs text-red-400 hover:text-red-300 transition flex items-center gap-1"><Trash className="h-3 w-3" /> Delete</button>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && <p className="text-parchment/60 col-span-full">No projects found. Add one above.</p>}
                  </div>
                )}

                {/* 3. Gallery */}
                {activeTab === "gallery" && (
                  <div className="space-y-4">
                    {/* Cloudinary Integration Block */}
                    <div className="glass p-5 rounded-2xl border border-parchment/12 bg-black/20 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-parchment/10 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-ember shadow-glow" />
                            <h3 className="font-bold text-pearl text-sm uppercase tracking-widest">Cloudinary Integration</h3>
                          </div>
                          <p className="text-xs text-parchment/60 mt-1">Select files straight from your Cloudinary asset library or use external URLs.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            openCloudinaryMediaLibrary(async (urls) => {
                              try {
                                const newItems = urls.map(url => ({
                                  id: (Date.now() + Math.random()).toString(),
                                  url,
                                  title: url.split("/").pop() || "Untitled",
                                  category: "Uncategorized",
                                  createdAt: new Date().toISOString()
                                }));
                                const docRef = doc(db, "cinematic_portfolio_data", "main");
                                setGallery(prev => {
                                  const updated = [...prev, ...newItems];
                                  updateDoc(docRef, { gallery: updated });
                                  return updated;
                                });
                                showSuccess();
                              } catch (e) {
                                console.error("Cloudinary library select failed:", e);
                              }
                            }, true);
                          }}
                          className="rounded-xl bg-ember hover:bg-[#ff8a22] text-white px-5 py-3 text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-glow shrink-0 font-display"
                        >
                          <UploadCloud className="h-4 w-4" /> Browse Cloudinary Library
                        </button>
                      </div>


                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {gallery.map((g) => (
                        <div key={g.id} className="relative group aspect-square sm:aspect-video bg-black/40 rounded-xl border border-parchment/10 overflow-hidden">
                          {g.url && <img src={g.url} alt={g.title} className="w-full h-full object-cover" />}
                          
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-3">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setEditingMediaId(g.id); setEditingMediaTitle(g.title || ""); setEditingMediaCategory(g.category || ""); }} className="bg-black/50 p-2 rounded-lg hover:bg-white/10 transition"><Edit3 className="h-4 w-4 text-pearl" /></button>
                              <button onClick={() => handleDelete("gallery", g)} className="bg-black/50 p-2 rounded-lg hover:bg-red-500/20 transition"><Trash className="h-4 w-4 text-red-400" /></button>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-pearl truncate">{g.title}</p>
                              <span className="text-[9px] uppercase tracking-widest text-ember">{g.category || "Uncategorized"}</span>
                            </div>
                          </div>
                          
                          {editingMediaId === g.id && (
                            <div className="absolute inset-0 bg-black/95 p-3 flex flex-col justify-center gap-2 z-10">
                              <input type="text" placeholder="Title" value={editingMediaTitle} onChange={e => setEditingMediaTitle(e.target.value)} className="w-full bg-black/50 border border-parchment/20 rounded px-2 py-1 text-xs text-white" />
                              <input type="text" placeholder="Category (e.g., UI, Comic)" value={editingMediaCategory} onChange={e => setEditingMediaCategory(e.target.value)} className="w-full bg-black/50 border border-parchment/20 rounded px-2 py-1 text-xs text-white" />
                              <div className="flex gap-2 mt-1">
                                <button type="button" className="w-full h-7 text-xs rounded-lg bg-ember text-white font-semibold flex items-center justify-center hover:bg-[#ff8a22] transition" onClick={() => handleEditMediaData("gallery", g.id)}>Save</button>
                                <button type="button" className="w-full h-7 text-xs rounded-lg bg-linen text-void font-semibold flex items-center justify-center hover:bg-pearl transition" onClick={() => setEditingMediaId(null)}>Cancel</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <label className="aspect-square sm:aspect-video bg-transparent border-2 border-dashed border-parchment/20 rounded-xl flex flex-col items-center justify-center text-parchment/40 hover:border-ember/50 hover:text-ember transition cursor-pointer relative">
                        {uploading === "gallery" ? <Loader2 className="h-6 w-6 animate-spin" /> : "+ Upload Image"}
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload(e, "gallery")} disabled={uploading !== false} />
                      </label>
                    </div>
                  </div>
                )}

                {/* 4. Videos */}
                {activeTab === "videos" && showVideoForm && (
                  <form onSubmit={handleSaveVideo} className="space-y-4 bg-black/20 p-6 rounded-2xl border border-parchment/10">
                    <div className="flex gap-4 border-b border-parchment/10 pb-4 mb-4">
                      <label className="flex items-center gap-2 text-sm text-pearl cursor-pointer"><input type="radio" checked={newVideo.type === "youtube"} onChange={() => setNewVideo({...newVideo, type: "youtube", url: ""})} /> YouTube Link</label>
                      <label className="flex items-center gap-2 text-sm text-pearl cursor-pointer"><input type="radio" checked={newVideo.type === "local"} onChange={() => setNewVideo({...newVideo, type: "local", url: ""})} /> Local File (Cloudinary)</label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Title</label><input required type="text" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" /></div>
                      <div><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Subtitle / Tagline</label><input type="text" value={newVideo.subtitle} onChange={e => setNewVideo({...newVideo, subtitle: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" /></div>
                      
                      <div className="md:col-span-2">
                        {newVideo.type === "youtube" ? (
                          <><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">YouTube URL</label><input required type="url" placeholder="https://youtube.com/watch?v=..." value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" /></>
                        ) : (
                          <>
                            <label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Cloudinary Video URL / File Upload</label>
                            <div className="space-y-3">
                              <button
                                type="button"
                                onClick={() => {
                                  openCloudinaryMediaLibrary((urls) => {
                                    setNewVideo((prev: any) => ({ ...prev, url: urls[0] }));
                                  });
                                }}
                                className="w-full rounded-xl bg-white/5 border border-parchment/10 text-pearl hover:bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition duration-300 flex items-center justify-center gap-2"
                              >
                                <UploadCloud className="h-4 w-4" /> Select Video from Cloudinary Library
                              </button>
                              <div className="text-center text-[10px] text-parchment/40 font-bold uppercase tracking-wider">— OR UPLOAD FROM DEVICE —</div>
                              <label className="flex items-center justify-center h-12 w-full rounded-xl border border-parchment/12 bg-black/40 cursor-pointer hover:border-ember/50 transition">
                                {uploading === "video_local" ? <Loader2 className="h-5 w-5 animate-spin" /> : newVideo.url ? <span className="text-green-400 text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> File Ready (or URL selected)</span> : <span className="text-sm text-parchment/60 flex items-center gap-2"><UploadCloud className="h-4 w-4"/> Select MP4 File</span>}
                                <input type="file" accept="video/*" className="hidden" onChange={e => handleFileUpload(e, "video_local")} disabled={uploading !== false} />
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-3 p-4 bg-black/30 rounded-xl border border-parchment/10 cursor-pointer">
                          <input type="checkbox" checked={newVideo.featured} onChange={e => setNewVideo({...newVideo, featured: e.target.checked})} className="w-4 h-4 rounded" />
                          <div><p className="font-semibold text-pearl text-sm">Mark as Featured</p><p className="text-xs text-parchment/50">Featured videos appear prominently at the top of the Videos showcase.</p></div>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 mt-4 border-t border-parchment/10">
                      <Button type="submit" disabled={newVideo.type === "local" && !newVideo.url} className="gap-2"><Save className="h-4 w-4" /> Save Video</Button>
                      <Button type="button" variant="secondary" onClick={() => setShowVideoForm(false)}>Cancel</Button>
                    </div>
                  </form>
                )}

                {activeTab === "videos" && !showVideoForm && (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {videos.map((v) => (
                        <div key={v.id} className={`relative group aspect-video bg-black/40 rounded-xl border ${v.featured ? 'border-ember/50 shadow-[0_0_15px_rgba(232,117,26,0.15)]' : 'border-parchment/10'} overflow-hidden`}>
                          {v.type === "youtube" ? (
                            <div className="w-full h-full bg-black flex items-center justify-center"><PlayCircle className="h-10 w-10 text-red-600" /></div>
                          ) : (
                            v.url && <video src={v.url} className="w-full h-full object-cover" />
                          )}
                          
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-3">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setEditingMediaId(v.id); setEditingMediaTitle(v.title || ""); }} className="bg-black/50 p-2 rounded-lg hover:bg-white/10 transition"><Edit3 className="h-4 w-4 text-pearl" /></button>
                              <button onClick={() => handleDelete("videos", v)} className="bg-black/50 p-2 rounded-lg hover:bg-red-500/20 transition"><Trash className="h-4 w-4 text-red-400" /></button>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-pearl truncate">{v.title}</p>
                              {v.featured && <span className="text-[9px] uppercase tracking-widest text-ember">Featured</span>}
                            </div>
                          </div>

                          {editingMediaId === v.id && (
                            <div className="absolute inset-0 bg-black/95 p-3 flex flex-col justify-center gap-2 z-10">
                              <input type="text" placeholder="Title" value={editingMediaTitle} onChange={e => setEditingMediaTitle(e.target.value)} className="w-full bg-black/50 border border-parchment/20 rounded px-2 py-1 text-xs text-white" />
                              <div className="flex gap-2 mt-1">
                                <button type="button" className="w-full h-7 text-xs rounded-lg bg-ember text-white font-semibold flex items-center justify-center hover:bg-[#ff8a22] transition" onClick={() => handleEditMediaData("videos", v.id)}>Save</button>
                                <button type="button" className="w-full h-7 text-xs rounded-lg bg-linen text-void font-semibold flex items-center justify-center hover:bg-pearl transition" onClick={() => setEditingMediaId(null)}>Cancel</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Profile */}
                {activeTab === "profile" && (
                  <div className="grid lg:grid-cols-[1fr_0.8fr] gap-8">
                    <div className="space-y-5">
                      <h3 className="text-lg font-display font-bold text-pearl uppercase">Personal Info</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Display Name</label><input type="text" value={profile.name || ""} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" /></div>
                        <div><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Job Role / Title</label><input type="text" value={profile.role || ""} onChange={e => setProfile({...profile, role: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" /></div>
                        <div><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Location</label><input type="text" value={profile.location || ""} onChange={e => setProfile({...profile, location: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" /></div>
                        <div><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Email Signal</label><input type="email" value={profile.email || ""} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50" /></div>
                      </div>
                      <div><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Bio (Short)</label><textarea rows={2} value={profile.bio || ""} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50"></textarea></div>
                      <div><label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Bio 2 (Extended Story)</label><textarea rows={4} value={profile.bio2 || ""} onChange={e => setProfile({...profile, bio2: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50"></textarea></div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-display font-bold text-pearl uppercase mb-4">Avatar</h3>
                        <div className="flex items-center gap-6">
                          <div className="h-24 w-24 rounded-full border border-parchment/20 bg-black/40 overflow-hidden flex-shrink-0">
                            {profile.avatarUrl ? <img src={profile.avatarUrl} className="w-full h-full object-cover" /> : <User className="h-10 w-10 m-7 text-parchment/20"/>}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-parchment/10 rounded-xl hover:bg-white/10 cursor-pointer transition text-xs font-semibold text-pearl">
                                {uploading === "avatar" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />} Upload from device
                                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, "avatar")} disabled={uploading !== false} />
                              </label>
                              <span className="text-[10px] text-parchment/40 font-bold uppercase tracking-wider">or</span>
                              <button
                                type="button"
                                onClick={() => {
                                  openCloudinaryMediaLibrary((urls) => {
                                    setProfile((prev: any) => ({ ...prev, avatarUrl: urls[0] }));
                                  });
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-parchment/10 rounded-xl hover:bg-white/10 text-xs font-semibold text-pearl transition duration-300"
                              >
                                <UploadCloud className="h-4 w-4" /> Cloudinary Library
                              </button>
                            </div>
                            <p className="text-[10px] text-parchment/50">Supports either device upload, Cloudinary browsing, or direct hosted image links.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-display font-bold text-pearl uppercase mb-4">Dynamic Skills</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(profile.skills || []).map((skill: string) => (
                            <span key={skill} className="bg-ember/10 border border-ember/20 text-ember px-3 py-1 rounded-full text-xs flex items-center gap-2">
                              {skill} <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-white"><X className="h-3 w-3"/></button>
                            </span>
                          ))}
                        </div>
                        <input 
                          type="text" 
                          placeholder="Type a skill and press Enter..." 
                          value={newSkill} 
                          onChange={e => setNewSkill(e.target.value)} 
                          onKeyDown={handleAddSkill}
                          className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50 text-sm" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Messages */}
                {activeTab === "messages" && (
                  <div className="space-y-4">
                    {messages.length === 0 && <p className="text-parchment/60">No transmissions received yet.</p>}
                    {messages.map((msg) => (
                      <div key={msg.id} className="bg-black/20 p-5 rounded-xl border border-parchment/10 relative group">
                        <button onClick={() => handleDeleteMessage(msg)} className="absolute top-4 right-4 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition"><Trash className="h-4 w-4" /></button>
                        <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-widest text-denim">
                          <span className="font-bold text-ember">{msg.name}</span><span>•</span><span>{new Date(msg.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-pearl mb-4">{msg.message}</p>
                        <a href={`mailto:${msg.email}`} className="inline-flex items-center gap-2 text-sm text-parchment/60 font-semibold hover:text-white transition bg-black/30 px-3 py-2 rounded-lg"><Mail className="h-4 w-4"/> Reply to {msg.email}</a>
                      </div>
                    ))}
                  </div>
                )}

                {/* 7. Settings */}
                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-5 rounded-xl border border-parchment/12 bg-black/25">
                      <div>
                        <p className="font-bold text-pearl">Cinematic Effects</p>
                        <p className="text-xs text-parchment/60 mt-1">Toggle global particle effects and glow for the frontend.</p>
                      </div>
                      <div className="w-12 h-6 bg-ember rounded-full relative cursor-pointer shadow-glow"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div></div>
                    </div>

                    <div className="glass p-6 rounded-2xl border border-parchment/12 space-y-6">
                      <div className="flex items-center gap-3">
                        <LinkIcon className="h-5 w-5 text-ember animate-pulse" />
                        <h3 className="text-lg font-display font-bold text-pearl uppercase">Contact & Social Links</h3>
                      </div>
                      <p className="text-xs text-parchment/60 -mt-2">Configure the email and social accounts displayed on your public Contact page.</p>
                      
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Email Address</label>
                          <input type="email" value={socials.email || ""} onChange={e => setSocials({...socials, email: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50 text-sm" />
                        </div>
                        
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">GitHub Profile URL</label>
                          <input type="text" value={socials.github || ""} onChange={e => setSocials({...socials, github: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">GitHub Username / Display</label>
                          <input type="text" value={socials.githubUser || ""} onChange={e => setSocials({...socials, githubUser: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50 text-sm" />
                        </div>
                        
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">LinkedIn Profile URL</label>
                          <input type="text" value={socials.linkedin || ""} onChange={e => setSocials({...socials, linkedin: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">LinkedIn Display Name</label>
                          <input type="text" value={socials.linkedinUser || ""} onChange={e => setSocials({...socials, linkedinUser: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50 text-sm" />
                        </div>
                        
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Instagram Profile URL</label>
                          <input type="text" value={socials.instagram || ""} onChange={e => setSocials({...socials, instagram: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-parchment/60 mb-2">Instagram Display Name</label>
                          <input type="text" value={socials.instagramUser || ""} onChange={e => setSocials({...socials, instagramUser: e.target.value})} className="w-full rounded-xl border border-parchment/12 bg-black/40 px-4 py-3 text-pearl outline-none focus:border-ember/50 text-sm" />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <button type="button" onClick={handleSaveSocials} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ember text-white shadow-glow px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#ff8a22] transition">
                          <Save className="h-4 w-4" /> Save Social Links
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-5 rounded-xl border border-red-500/20 bg-red-500/5">
                      <div>
                        <p className="font-bold text-red-400 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Danger Zone: Factory Reset</p>
                        <p className="text-xs text-parchment/60 mt-1">Wipes the entire database structure and resets to empty state.</p>
                      </div>
                      <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-wide bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:bg-red-500 transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" onClick={handleResetPortfolio}>Reset Portfolio</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
