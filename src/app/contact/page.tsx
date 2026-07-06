"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { portfolioData } from "@/lib/portfolioData";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    try {
      await portfolioData.addMessage(form);
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to send transmission. The network might be down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] w-full px-6 py-24 max-w-4xl mx-auto flex flex-col justify-center items-center relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E8751A]/5 via-transparent to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <span className="text-[#E8751A] font-bold tracking-widest uppercase text-sm">Transmission</span>
        <h1 className="text-4xl md:text-7xl font-heading font-bold text-[#F4F2EE] tracking-tighter uppercase mt-4">
          Initiate Contact
        </h1>
        <p className="mt-6 text-[#A9C4DA] max-w-lg mx-auto text-lg">
          Open for cinematic collaborations, creative development roles, and futuristic projects.
        </p>
      </motion.div>

      {success ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-16 w-full max-w-xl flex flex-col items-center justify-center gap-6 bg-[#111]/50 backdrop-blur-xl p-12 border border-[#E8751A]/50 rounded-2xl text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#E8751A]/20 flex items-center justify-center mb-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8751A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#F4F2EE]">Transmission Received</h2>
          <p className="text-[#A9C4DA]">Your message has been securely delivered to the mainframe. I will respond shortly.</p>
          <button onClick={() => setSuccess(false)} className="mt-4 px-6 py-2 border border-[#333] hover:border-[#E8751A] text-[#7FA1BE] hover:text-[#E8751A] rounded-lg transition-colors text-sm font-mono uppercase">
            Send Another
          </button>
        </motion.div>
      ) : (
        <motion.form 
          onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-16 w-full max-w-xl flex flex-col gap-6 bg-[#111]/50 backdrop-blur-xl p-8 border border-[#333] rounded-2xl"
      >
        <div className="flex flex-col gap-2">
          <label className="text-[#7FA1BE] text-sm uppercase tracking-widest font-bold">Identity</label>
          <input 
            type="text" 
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            placeholder="Name / Designation" 
            className="w-full bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-[#F4F2EE] focus:outline-none focus:border-[#E8751A] transition-colors"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-[#7FA1BE] text-sm uppercase tracking-widest font-bold">Signal Point</label>
          <input 
            type="email" 
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            placeholder="Email Address" 
            className="w-full bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-[#F4F2EE] focus:outline-none focus:border-[#E8751A] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#7FA1BE] text-sm uppercase tracking-widest font-bold">Message</label>
          <textarea 
            rows={5} 
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            required
            placeholder="Transmission content..." 
            className="w-full bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-[#F4F2EE] focus:outline-none focus:border-[#E8751A] transition-colors resize-none"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4 bg-[#E8751A] text-[#0D0D0D] font-bold tracking-widest uppercase py-4 rounded-lg hover:bg-[#B85A12] disabled:bg-[#333] disabled:text-[#666] transition-colors"
        >
          {loading ? "Sending..." : "Send Transmission"}
        </button>
      </motion.form>
      )}
    </div>
  );
}
