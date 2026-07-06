"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { portfolioData, Video } from "@/lib/portfolioData";

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    portfolioData.getVideos().then(setVideos);
  }, []);

  const featured = videos.find(v => v.featured) ?? videos[0];
  const rest = videos.filter(v => v.id !== featured?.id);

  const VideoCard = ({ video, large = false }: { video: Video; large?: boolean }) => {
    const ytId = video.youtubeUrl ? getYouTubeId(video.youtubeUrl) : null;
    const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
    const isLocal = !!video.localVideoUrl;

    // Local video — render native player
    if (isLocal) {
      return (
        <div className={`group relative ${large ? "aspect-video" : "aspect-video"} bg-[#111] rounded-2xl overflow-hidden border border-[#333] hover:border-[#E8751A] transition-colors`}>
          <video
            src={video.localVideoUrl}
            controls
            className="absolute inset-0 w-full h-full object-cover"
            preload="metadata"
          />
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
            {video.subtitle && <span className="text-[#E8751A] font-bold uppercase tracking-widest text-xs">{video.subtitle}</span>}
            <h2 className={`text-[#F4F2EE] font-heading font-bold ${large ? "text-2xl md:text-3xl" : "text-lg"} mt-1 drop-shadow-lg`}>{video.title}</h2>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`group relative ${large ? "aspect-video" : "aspect-video"} bg-[#111] rounded-2xl overflow-hidden border border-[#333] hover:border-[#E8751A] transition-colors cursor-pointer`}
        onClick={() => video.youtubeUrl && window.open(video.youtubeUrl, "_blank")}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={video.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent z-10" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className={`${large ? "w-20 h-20" : "w-14 h-14"} rounded-full bg-[#E8751A]/20 backdrop-blur-md flex items-center justify-center border border-[#E8751A] group-hover:scale-110 transition-transform opacity-0 group-hover:opacity-100`}>
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-[#F4F2EE] border-b-[8px] border-b-transparent ml-1" />
          </div>
        </div>

        <div className="absolute bottom-6 left-6 z-20">
          {video.subtitle && <span className="text-[#E8751A] font-bold uppercase tracking-widest text-xs">{video.subtitle}</span>}
          <h2 className={`text-[#F4F2EE] font-heading font-bold ${large ? "text-2xl md:text-4xl" : "text-lg"} mt-1`}>{video.title}</h2>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen w-full bg-[#0D0D0D] px-6 py-24 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-7xl"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#333]">
          <div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-[#F4F2EE] tracking-tighter uppercase">
              Editing <span className="text-[#E8751A]">Studio</span>
            </h1>
            <p className="mt-2 text-[#7FA1BE] uppercase tracking-widest text-sm">Cinematic Motion Graphics</p>
          </div>
          <div className="flex gap-4">
            <span className="w-12 h-1 bg-[#E8751A] rounded-full" />
            <span className="w-12 h-1 bg-[#333] rounded-full" />
            <span className="w-12 h-1 bg-[#333] rounded-full" />
          </div>
        </div>
      </motion.div>

      <div className="w-full max-w-7xl mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <VideoCard video={featured} large />
          </motion.div>
        )}

        <div className="flex flex-col gap-8">
          {rest.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.2 }}
            >
              <VideoCard video={video} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
