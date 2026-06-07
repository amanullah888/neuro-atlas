"use client";

import { motion } from "framer-motion";
import { Brain, Zap, AlertTriangle, TrendingUp, Activity, Shield } from "lucide-react";

interface SystemStatusProps {
  selectedNodeId: string | null;
}

const INSIGHTS = [
  {
    id: 1,
    icon: Brain,
    type: "insight",
    color: "#a78bfa",
    title: "Cognitive Peak Window",
    body: "Optimal focus state detected 09:00–12:30. Schedule deep work sessions.",
    score: 92,
    badge: "ACTIVE",
  },
  {
    id: 2,
    icon: AlertTriangle,
    type: "anomaly",
    color: "#f87171",
    title: "Cortisol Spike Detected",
    body: "Stress biomarkers elevated 34% above baseline. Activate recovery protocol.",
    score: 45,
    badge: "ALERT",
  },
  {
    id: 3,
    icon: Activity,
    type: "insight",
    color: "#34d399",
    title: "Aerobic Efficiency +12%",
    body: "VO2 max trending upward. Progressive overload maintained optimally.",
    score: 81,
    badge: "TREND",
  },
  {
    id: 4,
    icon: Shield,
    type: "insight",
    color: "#60a5fa",
    title: "Immune Load Nominal",
    body: "Inflammatory markers stable. Recovery protocols functioning within bounds.",
    score: 78,
    badge: "STABLE",
  },
  {
    id: 5,
    icon: TrendingUp,
    type: "prediction",
    color: "#00d4ff",
    title: "Peak Performance: +48h",
    body: "Predictive model forecasts performance apex in 2 days. Taper training now.",
    score: 88,
    badge: "PREDICT",
  },
];

const BADGE_COLORS: Record<string, string> = {
  ACTIVE: "#34d399",
  ALERT: "#f87171",
  TREND: "#a78bfa",
  STABLE: "#60a5fa",
  PREDICT: "#00d4ff",
};

const AI_STATUS = [
  { label: "Neural Engine", value: "ONLINE", color: "#34d399" },
  { label: "Prediction Model", value: "v4.2.1", color: "#a78bfa" },
  { label: "Data Sync", value: "LIVE", color: "#00d4ff" },
  { label: "Anomaly Detection", value: "ARMED", color: "#f87171" },
];

export function SystemStatus({ selectedNodeId }: SystemStatusProps) {
  return (
    <div className="h-full flex flex-col gap-3 py-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest">System Status</h2>
          <p className="text-sm font-semibold text-white/80 mt-0.5">AI Intelligence Feed</p>
        </div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-emerald-400"
          style={{ boxShadow: "0 0 8px #34d399" }}
        />
      </div>

      {/* AI System Status Grid */}
      <div className="glass rounded-xl p-3 grid grid-cols-2 gap-2">
        {AI_STATUS.map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">{s.label}</span>
            <span className="text-[10px] font-mono" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Cognitive Load Bar */}
      <div className="glass rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Cognitive Load</span>
          <span className="text-[10px] font-mono text-violet-400">74%</span>
        </div>
        <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 8%)" }}>
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: "linear-gradient(90deg, #a78bfa, #7c3aed)" }}
            initial={{ width: 0 }}
            animate={{ width: "74%" }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />
          <motion.div
            className="absolute inset-y-0 rounded-full opacity-60"
            style={{ background: "linear-gradient(90deg, transparent, #a78bfa, transparent)", width: "30%" }}
            animate={{ left: ["-30%", "100%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="mt-1.5 flex justify-between">
          {[0, 25, 50, 75, 100].map((v) => (
            <span key={v} className="text-[8px] font-mono text-white/20">{v}</span>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {INSIGHTS.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              whileHover={{ scale: 1.01, x: 3 }}
              className="glass rounded-xl p-3 cursor-pointer group"
              style={{ borderColor: insight.color + "20" }}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="mt-0.5 p-1.5 rounded-lg flex-shrink-0"
                  style={{ background: insight.color + "18" }}
                >
                  <Icon size={11} style={{ color: insight.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-white/85 truncate">{insight.title}</span>
                    <span
                      className="text-[8px] font-mono px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0"
                      style={{
                        background: BADGE_COLORS[insight.badge] + "18",
                        color: BADGE_COLORS[insight.badge],
                        border: `1px solid ${BADGE_COLORS[insight.badge]}30`,
                      }}
                    >
                      {insight.badge}
                    </span>
                  </div>
                  <p className="text-[9px] text-white/40 leading-relaxed">{insight.body}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="flex-1 h-0.5 rounded-full" style={{ background: "oklch(1 0 0 / 8%)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${insight.score}%`, background: insight.color, opacity: 0.7 }}
                      />
                    </div>
                    <span className="text-[8px] font-mono" style={{ color: insight.color }}>{insight.score}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active anomalies count */}
      <motion.div
        className="glass rounded-xl p-2.5 flex items-center justify-between"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-amber-400" />
          <span className="text-[10px] font-mono text-white/50">Active Anomalies</span>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-rose-400"
          />
          <span className="text-[10px] font-mono text-rose-400">1 ALERT</span>
        </div>
      </motion.div>
    </div>
  );
}
