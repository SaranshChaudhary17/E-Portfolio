"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { portfolioData, ProfileData, defaultProfile } from "@/lib/portfolioData";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    portfolioData.getProfile().then(setProfile);
  }, []);

  return (
    <div className="min-h-screen w-full px-6 py-24 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-[#F4F2EE] tracking-tighter uppercase">
          Origin <span className="text-[#E8751A]">Story</span>
        </h1>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:col-span-1"
        >
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#E8751A] to-[#B85A12] p-1">
            <div className="w-full h-full rounded-xl bg-[#0D0D0D] flex items-center justify-center overflow-hidden relative">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[#E8751A]/10 animate-pulse" />
                  <span className="text-[#7FA1BE] font-mono text-sm z-10">[ Profile Image ]</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <div>
              <h3 className="text-[#7FA1BE] font-bold uppercase tracking-wider text-xs">Role</h3>
              <p className="text-[#F4F2EE] text-lg font-semibold mt-1">{profile.role}</p>
            </div>
            <div>
              <h3 className="text-[#7FA1BE] font-bold uppercase tracking-wider text-xs">Location</h3>
              <p className="text-[#F4F2EE] text-lg font-semibold mt-1">{profile.location}</p>
            </div>
            <div>
              <h3 className="text-[#7FA1BE] font-bold uppercase tracking-wider text-xs">Name</h3>
              <p className="text-[#F4F2EE] text-lg font-semibold mt-1">{profile.name}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="md:col-span-2 flex flex-col gap-8"
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-[#A9C4DA] leading-relaxed">{profile.bio}</p>
            <p className="text-lg text-[#F4F2EE] mt-6 leading-relaxed">{profile.bio2}</p>
          </div>

          <div className="border-t border-[#333] pt-8">
            <h2 className="text-2xl font-bold text-[#F4F2EE] mb-6">Core Arsenal</h2>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full border border-[#333] bg-[#111] text-[#A9C4DA] text-sm hover:border-[#E8751A] hover:text-[#E8751A] transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
