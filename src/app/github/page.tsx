"use client";

import { motion } from "framer-motion";

const repositories = [
  "sarvanash",
  "Ovid-Bathware",
  "invoice",
  "Ai-Powered-Phishing-Detection",
  "Gym-Web",
  "Electricity-Billing-System",
  "T2T-indian-Languages"
];

export default function GitHub() {
  return (
    <div className="min-h-screen w-full px-6 py-24 max-w-7xl mx-auto flex flex-col relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0D0D0D] via-[#0D0D0D] to-[#1A1A1A]" />
      
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-[#F4F2EE] tracking-tighter uppercase flex items-center gap-4">
          Command <span className="text-[#A9C4DA]">Center</span>
        </h1>
        <p className="mt-4 text-[#7FA1BE] font-mono text-sm uppercase tracking-widest">
          &gt; SYSTEM.USER.CONNECT(&quot;SaranshChaudhary17&quot;)
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-1 border border-[#333] bg-[#111]/80 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-6"
        >
          <div className="w-24 h-24 rounded-full bg-[#E8751A]/20 border-2 border-[#E8751A] flex items-center justify-center animate-pulse">
            <span className="text-[#E8751A] font-bold text-xl">SC</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#F4F2EE]">Saransh Chaudhary</h2>
            <p className="text-[#7FA1BE] font-mono text-sm mt-1">@SaranshChaudhary17</p>
          </div>
          <div className="h-[1px] w-full bg-[#333]" />
          <div className="flex justify-between items-center text-sm font-mono text-[#F4F2EE]">
            <span>Repositories</span>
            <span className="text-[#E8751A] font-bold">{repositories.length}</span>
          </div>
          <a href="https://github.com/SaranshChaudhary17" target="_blank" rel="noreferrer" className="mt-auto w-full py-3 rounded-lg border border-[#E8751A] text-[#E8751A] text-center uppercase tracking-widest text-xs font-bold hover:bg-[#E8751A] hover:text-[#0D0D0D] transition-colors">
            Access Terminal
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {repositories.map((repo) => (
            <div 
              key={repo}
              className="group border border-[#333] hover:border-[#A9C4DA]/50 bg-[#1A1A1A]/50 backdrop-blur-sm rounded-xl p-6 flex flex-col justify-between transition-colors cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#A9C4DA]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <h3 className="text-[#F4F2EE] font-bold text-lg group-hover:text-[#A9C4DA] transition-colors">{repo}</h3>
                <p className="text-[#7FA1BE] text-sm mt-2 font-mono">
                  &gt; ./build/{repo.toLowerCase()}
                </p>
              </div>
              <div className="relative z-10 mt-6 flex justify-between items-end">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#E8751A]" />
                  <span className="w-3 h-3 rounded-full bg-[#A9C4DA]" />
                  <span className="w-3 h-3 rounded-full bg-[#D9C7B8]" />
                </div>
                <span className="text-[#333] group-hover:text-[#E8751A] transition-colors font-mono text-xs">
                  EXECUTE
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
