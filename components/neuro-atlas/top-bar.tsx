"use client";

import { motion } from "framer-motion";
import { Cpu, Radio, Settings, User } from "lucide-react";

const VITALS = [
  { label: "HRV", value: "58ms", status: "normal", color: "#34d399" },
  { label: "RHR", value: "52bpm", status: "optimal", color: "#60a5fa" },
  { label: "SpO₂", value: "98%", status: "normal", color: "#00d4ff" },
  { label: "Core Temp", value: "36.8°C", status: "normal", color: "#a78bfa" },
];

export function TopBar() {
  return (
    <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 glass-strong border-b border-white/5">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <motion.div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00d4ff22, #a78bfa22)", border: "1px solid #00d4ff30" }}
            animate={{ boxShadow: ["0 0 10px #00d4ff20", "0 0 25px #00d4ff40", "0 0 10px #00d4ff20"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Cpu size={16} className="text-cyan-400" />
          </motion.div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-tight">NeuroAtlas</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
              style={{ background: "#00d4ff15", color: "#00d4ff", border: "1px solid #00d4ff30" }}>
              v2.4.1
            </span>
          </div>
          <p className="text-[9px] font-mono text-white/30 tracking-widest uppercase">Human Performance Intelligence</p>
        </div>
      </div>

      {/* Live vitals */}
      <div className="flex items-center gap-1">
        {VITALS.map((v, i) => (
          <motion.div
            key={v.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            className="flex flex-col items-center px-3 py-1 rounded-lg"
            style={{ background: "oklch(1 0 0 / 4%)", border: "1px solid oklch(1 0 0 / 6%)" }}
          >
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">{v.label}</span>
            <span className="text-[11px] font-mono font-semibold" style={{ color: v.color }}>{v.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#34d399", boxShadow: "0 0 6px #34d399" }}
          />
          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">Live</span>
        </div>

        <div className="w-px h-4 bg-white/10" />

        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Radio size={14} className="text-white/30" />
        </motion.div>

        <button
          className="p-1.5 rounded-lg text-white/30 hover:text-white/60 transition-colors"
          style={{ background: "oklch(1 0 0 / 4%)" }}
        >
          <Settings size={14} />
        </button>

        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #a78bfa33, #60a5fa33)", border: "1px solid #a78bfa30" }}
        >
          <User size={13} className="text-violet-300" />
        </div>
      </div>
    </header>
  );
}
