"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { NeuralMap } from "@/components/neuro-atlas/neural-map";
import { SystemStatus } from "@/components/neuro-atlas/system-status";
import { RecoveryEngine } from "@/components/neuro-atlas/recovery-engine";
import { PerformanceTimeline } from "@/components/neuro-atlas/performance-timeline";
import { TopBar } from "@/components/neuro-atlas/top-bar";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  value: number;
  category: "cognitive" | "physical" | "recovery" | "stress" | "core";
  connections: string[];
}

const CATEGORY_COLORS: Record<Node["category"], string> = {
  cognitive: "#a78bfa",
  physical: "#34d399",
  recovery: "#60a5fa",
  stress: "#f87171",
  core: "#00d4ff",
};

export default function NeuroAtlasPage() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  return (
    <motion.div
      className="h-screen flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <TopBar />

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT — System Status */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-64 flex-shrink-0 overflow-hidden border-r border-white/5 px-3"
          style={{ background: "oklch(1 0 0 / 2%)" }}
        >
          <SystemStatus selectedNodeId={selectedNode?.id ?? null} />
        </motion.aside>

        {/* CENTER — Neural Map */}
        <motion.main
          className="flex-1 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {/* Corner decorators */}
          <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-cyan-400/20 pointer-events-none" />
          <div className="absolute top-3 right-3 w-6 h-6 border-r border-t border-cyan-400/20 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-l border-b border-cyan-400/20 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-cyan-400/20 pointer-events-none" />

          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">Neural Performance Map</span>
          </div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.15 0.04 210 / 0.6) 0%, transparent 70%)",
            }}
          />

          <NeuralMap onNodeSelect={setSelectedNode} selectedNode={selectedNode} />

          {selectedNode && (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-strong rounded-2xl px-5 py-3 min-w-56"
              style={{ borderColor: "oklch(1 0 0 / 10%)" }}
            >
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-0.5">Selected Node</p>
                  <p className="text-sm font-semibold text-white">{selectedNode.label}</p>
                  <p
                    className="text-[9px] font-mono capitalize"
                    style={{ color: CATEGORY_COLORS[selectedNode.category] }}
                  >
                    {selectedNode.category} system
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-mono text-white">
                    {selectedNode.value}
                    <span className="text-sm text-white/30">%</span>
                  </p>
                  <p className="text-[9px] font-mono text-white/30">efficiency</p>
                </div>
              </div>
              <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 8%)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: CATEGORY_COLORS[selectedNode.category] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedNode.value}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </motion.div>
          )}
        </motion.main>

        {/* RIGHT — Recovery Engine */}
        <motion.aside
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-64 flex-shrink-0 overflow-hidden border-l border-white/5 px-3"
          style={{ background: "oklch(1 0 0 / 2%)" }}
        >
          <RecoveryEngine />
        </motion.aside>
      </div>

      {/* BOTTOM — Timeline */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex-shrink-0 border-t border-white/5 glass-strong"
        style={{ height: "130px" }}
      >
        <PerformanceTimeline />
      </motion.footer>
    </motion.div>
  );
}
