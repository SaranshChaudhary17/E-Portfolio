"use client";
import { useState, useRef } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface UploadedItem {
  url: string;
  type: "image" | "video";
  title?: string;
}

interface CloudinaryUploaderProps {
  label?: string;
  helper?: string;
  value?: string | UploadedItem[];
  multiple?: boolean;
  mediaTypeOnly?: "image" | "video" | "both";
  onChange: (result: any) => void;
}

export default function CloudinaryUploader({
  label = "Upload Media",
  helper = "PNG, JPG, MP4, WebM (Cloudinary CDN)",
  value,
  multiple = false,
  mediaTypeOnly = "both",
  onChange,
}: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptTypes =
    mediaTypeOnly === "image"
      ? "image/*"
      : mediaTypeOnly === "video"
      ? "video/*"
      : "image/*,video/*";

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      if (multiple) {
        const uploadedList: UploadedItem[] = Array.isArray(value) ? [...value] : [];
        const total = files.length;
        for (let i = 0; i < total; i++) {
          const file = files[i];
          const res = await uploadToCloudinary(file, (p) => {
            const overall = Math.round(((i + p / 100) / total) * 100);
            setProgress(overall);
          });
          uploadedList.push({
            url: res.secure_url,
            type: res.resource_type,
            title: file.name.replace(/\.[^/.]+$/, ""),
          });
        }
        onChange(uploadedList);
      } else {
        const file = files[0];
        const res = await uploadToCloudinary(file, (p) => setProgress(p));
        onChange(res.secure_url);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Upload failed. Please check network/Cloudinary keys.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeSingle = () => {
    onChange("");
  };

  const removeItem = (idx: number) => {
    if (Array.isArray(value)) {
      const next = value.filter((_, i) => i !== idx);
      onChange(next);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase font-mono tracking-wider text-white/80">
          {label}
        </label>
        <span className="text-[10px] font-mono text-white/40">{helper}</span>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          uploading
            ? "border-cyan-500/50 bg-cyan-950/10 pointer-events-none"
            : "border-white/20 bg-black/40 hover:border-white/40 hover:bg-white/[0.02]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptTypes}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono text-xs">
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
              <span>UPLOADING TO CLOUDINARY... {progress}%</span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden max-w-md mx-auto">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex justify-center text-white/50">
              <svg
                className="size-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-xs text-white/70">
              <span className="font-semibold text-white">Click to upload</span> or drag and drop
            </p>
            <p className="text-[10px] text-white/40">
              {multiple ? "Select multiple media files" : "Select single image or video"}
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-400 bg-rose-950/20 border border-rose-800/40 p-2 rounded-lg font-mono">
          {error}
        </p>
      )}

      {/* Previews */}
      {!multiple && typeof value === "string" && value && (
        <div className="relative inline-block mt-3 rounded-lg overflow-hidden border border-white/20 bg-black/60 group">
          {value.match(/\.(mp4|webm|mov)(\?.*)?$/i) ? (
            <video
              src={value}
              className="w-48 aspect-video object-cover"
              muted
              playsInline
              loop
            />
          ) : (
            <img src={value} alt="Preview" className="w-48 aspect-video object-cover" />
          )}
          <button
            type="button"
            onClick={removeSingle}
            className="absolute top-2 right-2 p-1 bg-black/80 hover:bg-rose-600 rounded-full text-white text-xs transition-colors"
            title="Remove"
          >
            ✕
          </button>
        </div>
      )}

      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {value.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden border border-white/15 bg-black/60 group aspect-[9/14]"
            >
              {item.type === "video" || item.url.match(/\.(mp4|webm|mov)(\?.*)?$/i) ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.title || `Item ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              {item.title && (
                <div className="absolute bottom-0 inset-x-0 bg-black/80 px-2 py-1 text-[9px] font-mono text-white/80 truncate">
                  {item.title}
                </div>
              )}
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-black/80 hover:bg-rose-600 rounded-full text-white text-[10px] transition-colors"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
