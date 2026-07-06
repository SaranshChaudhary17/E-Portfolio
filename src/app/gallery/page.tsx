"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { portfolioData, GalleryItem } from "@/lib/portfolioData";

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    portfolioData.getGallery().then(setItems);
  }, []);

  return (
    <div className="min-h-screen w-full px-6 py-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-[#F4F2EE] tracking-tighter uppercase">
          Creative <span className="text-[#E8751A]">Gallery</span>
        </h1>
        <p className="mt-4 text-[#A9C4DA] max-w-2xl mx-auto">
          Comics, UI Concepts, Posters, and Experimental Visuals.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={`group relative bg-[#1A1A1A] rounded-xl overflow-hidden cursor-pointer border border-[#333] hover:border-[#E8751A]/50 transition-colors ${item.span ?? "col-span-1 row-span-1"}`}
          >
            {/* Show image if URL provided, else show gradient placeholder */}
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#333] to-[#111] -z-10 group-hover:scale-110 transition-transform duration-700" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

            <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
              <h3 className="text-[#F4F2EE] font-bold text-lg">{item.title}</h3>
              {item.category && (
                <p className="text-[#E8751A] text-xs uppercase tracking-widest font-semibold mt-1">{item.category}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
