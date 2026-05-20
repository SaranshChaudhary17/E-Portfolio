"use client";

import { Expand, Image as ImageIcon } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);

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

  return (
    <section className="px-4 pb-24 pt-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Visual archive" title="Creative Gallery" copy="A masonry-inspired archive for comic concepts, UI designs, motion graphics, posters, and experiments." />
        <div className="mt-10 columns-1 gap-5 md:columns-2 xl:columns-3">
          {items.length > 0 ? items.map((item, index) => (
            <article key={item.id} className="glass group mb-5 break-inside-avoid overflow-hidden rounded-[1.4rem]">
              <div className={`relative flex place-items-center ${index % 3 === 0 ? "h-96" : index % 3 === 1 ? "h-72" : "h-80"} bg-[radial-gradient(circle_at_50%_40%,rgba(232,117,26,0.22),transparent_28%),radial-gradient(circle_at_70%_70%,rgba(169,196,218,0.18),transparent_28%)]`}>
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
                <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ember text-white z-10" aria-label={`Open ${item.title}`}>
                  <Expand className="h-5 w-5" />
                </button>
              </div>
            </article>
          )) : (
            <p className="text-parchment/60 col-span-full">No gallery items found. Add them from the Command Center.</p>
          )}
        </div>
      </div>
    </section>
  );
}
