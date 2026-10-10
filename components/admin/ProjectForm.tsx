"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CloudinaryUploader from "./CloudinaryUploader";
import {
  saveNewProject,
  updateExistingProject,
  FirestoreProject,
} from "@/lib/projectsService";

interface ProjectFormProps {
  initialData?: FirestoreProject | null;
  projectId?: string;
}

export default function ProjectForm({ initialData, projectId }: ProjectFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [type, setType] = useState(initialData?.type || "Creative Web App");
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear().toString());
  const [platform, setPlatform] = useState(initialData?.platform || "Web");
  const [role, setRole] = useState(initialData?.role || "Fullstack Engineer");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [rights, setRights] = useState(
    initialData?.rights || "All rights reserved."
  );
  const [live, setLive] = useState(initialData?.live || "");
  const [isComingSoon, setIsComingSoon] = useState(initialData?.isComingSoon ?? false);
  const [published, setPublished] = useState(initialData?.published ?? true);

  // Colors
  const [accentColor, setAccentColor] = useState(initialData?.accentColor || "#1cb647");
  const [secondaryColor, setSecondaryColor] = useState(
    initialData?.colors?.[1] || "#000000"
  );

  // Tags / Technologies
  const [techInput, setTechInput] = useState("");
  const [stack, setStack] = useState<string[]>(
    initialData?.stack || ["Next.js", "TypeScript", "Tailwind CSS"]
  );

  // Thumbnail (Listing)
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnailUrl || initialData?.objectives?.media?.src || ""
  );

  // Objectives (Walkthrough)
  const [objectivesTitle, setObjectivesTitle] = useState(
    initialData?.objectives?.title || "System Objectives"
  );
  const [objectivesText, setObjectivesText] = useState(
    initialData?.objectives?.text || ""
  );
  const [objectivesMediaMode, setObjectivesMediaMode] = useState<
    "video" | "image" | "slideshow"
  >(initialData?.objectivesMediaMode || (initialData?.objectives?.media?.type === "video" ? "video" : "image"));
  const [objectivesSingleMedia, setObjectivesSingleMedia] = useState(
    initialData?.objectives?.media?.src || ""
  );
  const [objectivesSlideshow, setObjectivesSlideshow] = useState<string[]>(
    initialData?.objectivesSlideshow || []
  );

  // Interactive Gallery (Devices)
  const [galleryDevices, setGalleryDevices] = useState<
    { type: "image" | "video"; src: string; title: string }[]
  >(
    initialData?.gallery?.devices?.map((d) => ({
      type: d.type || "image",
      src: d.src || "",
      title: d.title || "",
    })) || []
  );

  // Execution Protocol
  const [executionTitle, setExecutionTitle] = useState(
    initialData?.execution?.title || "Execution Protocol"
  );
  const [executionText, setExecutionText] = useState(
    initialData?.execution?.text || ""
  );
  const [executionMediaSrc, setExecutionMediaSrc] = useState(
    initialData?.execution?.media?.src || ""
  );

  // Key Metrics / Stats
  const [stats, setStats] = useState<{ value: string; label: string }[]>(
    initialData?.stats || [
      { value: "60fps", label: "Render performance" },
      { value: "99.9%", label: "Uptime" },
    ]
  );

  // Auto-generate slug from title if slug not manually customized
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData || !slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generated);
    }
  };

  // Stack tag helpers
  const addTechTag = () => {
    const val = techInput.trim();
    if (val && !stack.includes(val)) {
      setStack([...stack, val]);
      setTechInput("");
    }
  };

  const removeTechTag = (tag: string) => {
    setStack(stack.filter((t) => t !== tag));
  };

  // Stats helpers
  const addStatRow = () => {
    setStats([...stats, { value: "", label: "" }]);
  };

  const updateStatRow = (idx: number, field: "value" | "label", val: string) => {
    const next = [...stats];
    next[idx][field] = val;
    setStats(next);
  };

  const removeStatRow = (idx: number) => {
    setStats(stats.filter((_, i) => i !== idx));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setErrorMsg("Title and Slug are required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const isVideoObjectives =
      objectivesMediaMode === "video" ||
      objectivesSingleMedia.match(/\.(mp4|webm|mov)(\?.*)?$/i) !== null;

    const isVideoExecution =
      executionMediaSrc.match(/\.(mp4|webm|mov)(\?.*)?$/i) !== null;

    const payload: Partial<FirestoreProject> = {
      title,
      slug,
      type,
      year,
      platform,
      role,
      summary,
      rights,
      live: live.trim() || undefined,
      isComingSoon,
      published,
      colors: [accentColor, secondaryColor],
      accentColor,
      stack,
      tags: stack.slice(0, 3),
      archiveRef: initialData?.archiveRef || `PRJ${Math.floor(1000 + Math.random() * 9000)}`,
      thumbnailUrl: thumbnailUrl || objectivesSingleMedia || executionMediaSrc,
      pageIndex: [
        { id: "objectives", num: "01", title: objectivesTitle || "System Objectives" },
        { id: "gallery", num: "02", title: "Interactive Gallery" },
        { id: "execution", num: "03", title: executionTitle || "Execution Protocol" },
      ],
      objectives: {
        title: objectivesTitle,
        text: objectivesText,
        media: {
          type: isVideoObjectives ? "video" : "image",
          src: objectivesSingleMedia,
          ref: "OBJ_MEDIA",
        },
      },
      objectivesMediaMode,
      objectivesSlideshow,
      gallery: {
        devices: galleryDevices,
        features: [],
      },
      execution: {
        title: executionTitle,
        text: executionText,
        media: {
          type: isVideoExecution ? "video" : "image",
          src: executionMediaSrc,
          ref: "EXEC_MEDIA",
        },
      },
      stats: stats.filter((s) => s.value.trim() !== ""),
    };

    try {
      if (projectId) {
        await updateExistingProject(projectId, payload);
      } else {
        await saveNewProject(payload);
      }
      router.push("/malik");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save project. Please check Firestore permissions.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 max-w-5xl mx-auto pb-24 font-sans">
      {errorMsg && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300 font-mono text-xs">
          ✕ {errorMsg}
        </div>
      )}

      {/* TOP HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white">
            {projectId ? "EDIT PROJECT" : "NEW PROJECT"}
          </h2>
          <p className="text-xs text-white/50 font-mono">
            Fill in the project details. All media uploads directly to Cloudinary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/malik"
            className="px-4 py-2 rounded-xl border border-white/20 text-white/70 hover:text-white text-xs font-mono"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl border border-emerald-500 bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : projectId ? "Update Project" : "Publish Project"}
          </button>
        </div>
      </div>

      {/* SECTION 1: IDENTITY & META */}
      <div className="space-y-6 rounded-2xl border border-white/10 bg-black/40 p-6 md:p-8 backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="size-2 rounded-full bg-emerald-400" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-white">
            [01] Identity & Overview
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-white/80">Project Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Rotana Media Group"
              className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-white/80">Slug (URL) *</label>
            <div className="flex items-center bg-white/[0.03] border border-white/15 rounded-xl px-4 py-3 text-sm focus-within:border-emerald-400">
              <span className="text-white/40 font-mono text-xs mr-1">/projects/</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="rotana-media-group"
                className="bg-transparent text-white focus:outline-none flex-1 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-white/80">Project Type</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Entertainment Company"
              className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-white/80">Entry Year</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2025"
              className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-white/80">Platform</label>
            <input
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="Web / Mobile"
              className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-white/80">Primary Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Lead Development"
              className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-white/80">Project Overview (Summary)</label>
          <textarea
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Developed RMS's digital platform to showcase their role as a leading media conglomerate in the MENA region..."
            className="w-full bg-white/[0.03] border border-white/15 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-400 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-white/80">Live Project URL</label>
            <input
              type="text"
              value={live}
              onChange={(e) => setLive(e.target.value)}
              placeholder="https://rotanamedia.com"
              className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-white/80">Rights / Copyright Notice</label>
            <input
              type="text"
              value={rights}
              onChange={(e) => setRights(e.target.value)}
              placeholder="This project's all rights reserved to..."
              className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-white/80">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="size-4 rounded accent-emerald-500"
            />
            <span>Published (Visible on /projects)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-white/80">
            <input
              type="checkbox"
              checked={isComingSoon}
              onChange={(e) => setIsComingSoon(e.target.checked)}
              className="size-4 rounded accent-emerald-500"
            />
            <span>Show "Coming Soon" Badge</span>
          </label>
        </div>
      </div>

      {/* SECTION 2: TECH STACK & COLOR PALETTE */}
      <div className="space-y-6 rounded-2xl border border-white/10 bg-black/40 p-6 md:p-8 backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="size-2 rounded-full bg-cyan-400" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-white">
            [02] Technologies & Color Palette
          </h3>
        </div>

        {/* Tech Stack Input */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase text-white/80">Deployed Technologies</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTechTag();
                }
              }}
              placeholder="Type technology (e.g. Next.js, Three.js) and press Enter"
              className="flex-1 bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={addTechTag}
              className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono text-xs"
            >
              + Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {stack.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-xs"
              >
                {t}
                <button
                  type="button"
                  onClick={() => removeTechTag(t)}
                  className="hover:text-white"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-white/80">Primary Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="size-10 rounded-lg cursor-pointer bg-transparent border border-white/20 p-1"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-32 bg-white/[0.03] border border-white/15 rounded-xl px-3 py-2 text-sm font-mono text-white"
              />
              {/* Presets */}
              <div className="flex gap-1.5">
                {["#1cb647", "#00f3ff", "#00ff9f", "#fcee0a", "#ff003c"].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setAccentColor(col)}
                    className="size-6 rounded-full border border-white/30 transition-transform hover:scale-125"
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-white/80">Secondary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="size-10 rounded-lg cursor-pointer bg-transparent border border-white/20 p-1"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-32 bg-white/[0.03] border border-white/15 rounded-xl px-3 py-2 text-sm font-mono text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: THUMBNAIL (LISTING PAGE) */}
      <div className="space-y-6 rounded-2xl border border-white/10 bg-black/40 p-6 md:p-8 backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="size-2 rounded-full bg-amber-400" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-white">
            [03] Project Thumbnail (/projects Listing)
          </h3>
        </div>

        <CloudinaryUploader
          label="Thumbnail Image / Poster"
          helper="Shown in listing and preview cards"
          value={thumbnailUrl}
          mediaTypeOnly="image"
          onChange={(url) => setThumbnailUrl(url)}
        />
      </div>

      {/* SECTION 4: PROJECT WALKTHROUGH & OBJECTIVES */}
      <div className="space-y-6 rounded-2xl border border-white/10 bg-black/40 p-6 md:p-8 backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="size-2 rounded-full bg-violet-400" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-white">
            [04] Project Walkthrough & System Objectives
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-white/80">Section Title</label>
            <input
              type="text"
              value={objectivesTitle}
              onChange={(e) => setObjectivesTitle(e.target.value)}
              placeholder="System Objectives"
              className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-white/80">Media Display Mode</label>
            <select
              value={objectivesMediaMode}
              onChange={(e) => setObjectivesMediaMode(e.target.value as any)}
              className="w-full bg-[#111] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-400"
            >
              <option value="video">Single Video (Autoplays / Loops smoothly)</option>
              <option value="image">Single Static Image (No animation)</option>
              <option value="slideshow">Multiple Images (Slideshow transition)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-white/80">Objectives Narrative Text</label>
          <textarea
            rows={4}
            value={objectivesText}
            onChange={(e) => setObjectivesText(e.target.value)}
            placeholder="The primary objective was to engineer a digital platform that asserts dominance in the region..."
            className="w-full bg-white/[0.03] border border-white/15 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-violet-400 leading-relaxed"
          />
        </div>

        {/* Media Uploader based on mode */}
        {objectivesMediaMode === "slideshow" ? (
          <div className="space-y-2">
            <CloudinaryUploader
              label="Slideshow Images (Select multiple)"
              helper="Images rotate with smooth cross-fade animation"
              value={objectivesSlideshow.map((url) => ({ url, type: "image" }))}
              multiple
              mediaTypeOnly="image"
              onChange={(items: { url: string }[]) => {
                setObjectivesSlideshow(items.map((i) => i.url));
              }}
            />
          </div>
        ) : (
          <CloudinaryUploader
            label={objectivesMediaMode === "video" ? "Walkthrough Video (MP4)" : "Walkthrough Image"}
            helper={objectivesMediaMode === "video" ? "MP4 video will loop automatically" : "Static high-res image"}
            value={objectivesSingleMedia}
            mediaTypeOnly={objectivesMediaMode === "video" ? "video" : "image"}
            onChange={(url) => setObjectivesSingleMedia(url)}
          />
        )}
      </div>

      {/* SECTION 5: INTERACTIVE GALLERY (RESPONSIVE DEVICES / HORIZONTAL SCROLL) */}
      <div className="space-y-6 rounded-2xl border border-white/10 bg-black/40 p-6 md:p-8 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400" />
            <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-white">
              [05] Interactive Gallery (Horizontal Scroll Device Previews)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-white/40">
            Drag & horizontal scroll enabled for any number of devices
          </span>
        </div>

        <CloudinaryUploader
          label="Add Device Mockup Images or Videos"
          helper="Upload mobile/tablet screens (supports both MP4 video and images)"
          multiple
          value={galleryDevices.map((d) => ({
            url: d.src,
            type: d.type,
            title: d.title,
          }))}
          onChange={(items: { url: string; type: "image" | "video"; title?: string }[]) => {
            setGalleryDevices(
              items.map((item) => ({
                src: item.url,
                type: item.type,
                title: item.title || "Device Preview",
              }))
            );
          }}
        />

        {galleryDevices.length > 0 && (
          <div className="space-y-3 pt-3">
            <h4 className="text-xs font-mono text-white/60 uppercase">Device Captions / Titles:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {galleryDevices.map((dev, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-white/10 bg-white/[0.02] space-y-2">
                  <div className="text-[10px] font-mono text-white/40 flex items-center justify-between">
                    <span>DEVICE #{idx + 1} ({dev.type.toUpperCase()})</span>
                  </div>
                  <input
                    type="text"
                    value={dev.title}
                    onChange={(e) => {
                      const next = [...galleryDevices];
                      next[idx].title = e.target.value;
                      setGalleryDevices(next);
                    }}
                    placeholder="e.g. Mobile Experience"
                    className="w-full bg-black/40 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: EXECUTION PROTOCOL & METRICS */}
      <div className="space-y-6 rounded-2xl border border-white/10 bg-black/40 p-6 md:p-8 backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="size-2 rounded-full bg-pink-400" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-white">
            [06] Execution Protocol & Key Metrics
          </h3>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-white/80">Section Title</label>
          <input
            type="text"
            value={executionTitle}
            onChange={(e) => setExecutionTitle(e.target.value)}
            placeholder="Execution Protocol"
            className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-white/80">Execution Narrative Text</label>
          <textarea
            rows={4}
            value={executionText}
            onChange={(e) => setExecutionText(e.target.value)}
            placeholder="Built a robust, enterprise-grade Next.js solution with WebGL shaders and optimized asset pipelines..."
            className="w-full bg-white/[0.03] border border-white/15 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-pink-400 leading-relaxed"
          />
        </div>

        <CloudinaryUploader
          label="Execution Showcase Media"
          helper="Right-side media card for Execution section"
          value={executionMediaSrc}
          onChange={(url) => setExecutionMediaSrc(url)}
        />

        {/* Stats Repeater */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-white/80">Key Metrics / Impact Stats</label>
            <button
              type="button"
              onClick={addStatRow}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300"
            >
              + Add Metric
            </button>
          </div>

          <div className="space-y-2.5">
            {stats.map((st, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={st.value}
                  onChange={(e) => updateStatRow(idx, "value", e.target.value)}
                  placeholder="e.g. 60fps or 14+"
                  className="w-32 bg-white/[0.03] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white"
                />
                <input
                  type="text"
                  value={st.label}
                  onChange={(e) => updateStatRow(idx, "label", e.target.value)}
                  placeholder="e.g. Render loop performance"
                  className="flex-1 bg-white/[0.03] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => removeStatRow(idx)}
                  className="text-white/40 hover:text-rose-400 text-xs font-mono p-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="flex items-center justify-between border-t border-white/10 pt-6">
        <Link
          href="/malik"
          className="text-xs font-mono text-white/50 hover:text-white"
        >
          ← Return to Command Center
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 rounded-xl border border-emerald-500 bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
        >
          {submitting ? "Saving to Firestore..." : projectId ? "Save Changes" : "Publish Project"}
        </button>
      </div>
    </form>
  );
}
