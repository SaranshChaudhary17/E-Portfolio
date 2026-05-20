"use client";

import { Expand, Image as ImageIcon, X } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const snap = await getDoc(doc(db, "cinematic_portfolio_data", "main"));
        if (snap.exists()) {
          setItems(snap.data().gallery || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchGallery();
  }, []);

  // Lock body scroll when fullscreen lightbox is active
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  // Support closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <section className="px-4 pb-24 pt-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Visual archive" title="Creative Gallery" copy="A masonry-inspired archive for comic concepts, UI designs, motion graphics, posters, and experiments." />
        <div className="mt-10 columns-1 gap-5 md:columns-2 xl:columns-3">
          {items.length > 0 ? items.map((item, index) => (
            <article key={item.id} className="glass group mb-5 break-inside-avoid overflow-hidden rounded-[1.4rem]">
              <div 
                className={`relative flex place-items-center cursor-pointer ${index % 3 === 0 ? "h-96" : index % 3 === 1 ? "h-72" : "h-80"} bg-[radial-gradient(circle_at_50%_40%,rgba(232,117,26,0.22),transparent_28%),radial-gradient(circle_at_70%_70%,rgba(169,196,218,0.18),transparent_28%)]`}
                onClick={() => setSelectedItem(item)}
              >
                {item.url ? (
                  <img src={item.url} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                ) : (
                  <ImageIcon className="m-auto h-14 w-14 text-ember transition group-hover:scale-110" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-5">
                  <p className="font-display text-lg font-black uppercase text-pearl">{item.title || "Untitled"}</p>
                  {item.category && <p className="text-[10px] font-semibold uppercase tracking-widest text-ember mt-1">{item.category}</p>}
                </div>
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-denim">Archive {String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 font-display text-2xl font-black uppercase text-pearl truncate max-w-[200px]">{item.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedItem(item)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ember text-white z-10 transition-all duration-300 hover:scale-110 active:scale-95" 
                  aria-label={`Open ${item.title}`}
                >
                  <Expand className="h-5 w-5" />
                </button>
              </div>
            </article>
          )) : (
            <p className="text-parchment/60 col-span-full">No gallery items found. Add them from the Command Center.</p>
          )}
        </div>
      </div>

      {/* Premium Fullscreen Lightbox Overlay */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-300 animate-in fade-in"
          onClick={() => setSelectedItem(null)}
        >
          {/* Close button in upper right corner */}
          <button 
            onClick={() => setSelectedItem(null)}
            className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-pearl/20 bg-void/40 text-pearl hover:bg-white/10 hover:border-pearl/40 transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-95 z-[110]"
            aria-label="Close fullscreen"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Fullscreen content container */}
          <div 
            className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image content itself
          >
            <div className="relative max-w-full max-h-[75vh] md:max-h-[80vh] flex items-center justify-center rounded-xl overflow-hidden shadow-[0_0_60px_rgba(232,117,26,0.15)] border border-pearl/10">
              <img 
                src={selectedItem.url} 
                alt={selectedItem.title || "Fullscreen view"} 
                className="max-w-full max-h-[75vh] md:max-h-[80vh] object-contain transition-transform duration-500 hover:scale-[1.01]"
              />
            </div>
            
            {/* Title & Info Box */}
            <div className="mt-6 text-center max-w-2xl px-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ember mb-2">
                {selectedItem.category || "Uncategorized"}
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-black uppercase tracking-wide text-pearl">
                {selectedItem.title || "Untitled Archive"}
              </h2>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

