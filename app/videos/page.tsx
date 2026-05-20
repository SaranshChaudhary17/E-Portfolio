"use client";

import { Clapperboard, Maximize2, Play, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const snap = await getDoc(doc(db, "cinematic_portfolio_data", "main"));
        if (snap.exists()) {
          setVideos(snap.data().videos || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchVideos();
  }, []);

  const featured = videos.filter(v => v.featured);
  const regular = videos.filter(v => !v.featured);

  return (
    <section className="px-4 pb-24 pt-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Motion & Editing" title="Video Archive" copy="Showreels, animated interfaces, and cinematic product demos." />

        {featured.length > 0 && (
          <div className="mt-12 space-y-8 mb-16">
            <h3 className="font-display text-2xl font-black uppercase text-pearl">Featured Work</h3>
            {featured.map((video) => (
              <div key={video.id} className="relative aspect-video overflow-hidden rounded-[1.75rem] border border-parchment/15 bg-black/40 shadow-[0_0_40px_rgba(232,117,26,0.15)] group">
                {video.type === "youtube" ? (
                  <iframe src={`https://www.youtube.com/embed/${video.url.split('v=')[1]?.split('&')[0] || video.url.split('/').pop()}`} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                ) : (
                  <video src={video.url} className="h-full w-full object-cover" controls preload="metadata" />
                )}
                {!video.type || video.type === "local" ? (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex flex-col justify-end p-8">
                    <p className="font-display text-3xl font-black uppercase text-pearl drop-shadow-md">{video.title}</p>
                    {video.subtitle && <p className="text-parchment/80 mt-2 max-w-2xl drop-shadow-md">{video.subtitle}</p>}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {regular.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-xl font-black uppercase text-pearl mb-6">Archive</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regular.map((video) => (
                <div key={video.id} className="group relative aspect-video overflow-hidden rounded-[1.4rem] border border-parchment/15 bg-black/40">
                  {video.type === "youtube" ? (
                    <iframe src={`https://www.youtube.com/embed/${video.url.split('v=')[1]?.split('&')[0] || video.url.split('/').pop()}`} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  ) : (
                    <video src={video.url} className="h-full w-full object-cover" controls preload="metadata" />
                  )}
                  {!video.type || video.type === "local" ? (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 flex flex-col justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="font-display text-lg font-black uppercase text-pearl leading-tight">{video.title}</p>
                      {video.subtitle && <p className="text-xs text-parchment/60 mt-1 line-clamp-2">{video.subtitle}</p>}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {videos.length === 0 && (
           <p className="text-parchment/60 mt-12">No videos found. Add them from the Command Center.</p>
        )}
      </div>
    </section>
  );
}
