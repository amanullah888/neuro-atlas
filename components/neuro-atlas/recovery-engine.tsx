"use client";

import { motion } from "framer-motion";
import { Moon, Dumbbell, Wind, Droplets, Thermometer, Clock } from "lucide-react";

const RECOVERY_SCORE = 76;

const HEAT_ZONES = [
  { label: "Quads", fatigue: 78, x: 42, y: 35 },
  { label: "Hamstrings", fatigue: 62, x: 52, y: 55 },
  { label: "Core", fatigue: 45, x: 47, y: 45 },
  { label: "Shoulders", fatigue: 89, x: 30, y: 22 },
  { label: "Lower Back", fatigue: 55, x: 47, y: 62 },
  { label: "Calves", fatigue: 71, x: 45, y: 75 },
];

function fatigueColor(v: number) {
  if (v >= 80) return "#f87171";
  if (v >= 60) return "#fb923c";
  if (v >= 40) return "#facc15";
  return "#34d399";
}

const RECOMMENDATIONS = [
  { icon: Moon, label: "Sleep Extension", detail: "+45 min tonight", priority: "HIGH", color: "#60a5fa" },
  { icon: Wind, label: "Cold Plunge Protocol", detail: "12°C · 3 min", priority: "MED", color: "#00d4ff" },
  { icon: Dumbbell, label: "Deload Shoulders", detail: "72h rest window", priority: "HIGH", color: "#f87171" },
  { icon: Droplets, label: "Hydration Deficit", detail: "+800ml electrolytes", priority: "MED", color: "#34d399" },
  { icon: Thermometer, label: "Infrared Sauna", detail: "20 min post-training", priority: "LOW", color: "#a78bfa" },
];

const PRIORITY_STYLE: Record<string, string> = {
  HIGH: "#f87171",
  MED: "#facc15",
  LOW: "#34d399",
};

function ScoreRing({ score }: { score: number }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle cx={56} cy={56} r={r} fill="none" stroke="oklch(1 0 0 / 8%)" strokeWidth={6} />
        <motion.circle
          cx={56} cy={56} r={r}
          fill="none"
          stroke="url(#recoveryGrad)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        />
        <defs>
          <linearGradient id="recoveryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative flex flex-col items-center">
        <motion.span
          className="text-2xl font-bold font-mono text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {score}
        </motion.span>
        <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Recovery</span>
      </div>
    </div>
  );
}

function FatigueMap() {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Fatigue Heat Map</span>
        <Clock size={10} className="text-white/30" />
      </div>
      <div className="relative w-full h-28 rounded-lg overflow-hidden" style={{ background: "oklch(1 0 0 / 4%)" }}>
        {/* Simple human silhouette hint */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: "radial-gradient(ellipse 30% 40% at 47% 40%, white 0%, transparent 100%)",
          }}
        />
        {HEAT_ZONES.map((zone) => (
          <motion.div
            key={zone.label}
            className="absolute rounded-full"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: 12 + (zone.fatigue / 100) * 8,
              height: 12 + (zone.fatigue / 100) * 8,
              background: fatigueColor(zone.fatigue),
              boxShadow: `0 0 ${zone.fatigue / 5}px ${fatigueColor(zone.fatigue)}`,
              transform: "translate(-50%, -50%)",
              opacity: 0.7 + (zone.fatigue / 100) * 0.3,
            }}
            animate={{ scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() }}
          />
        ))}
        {/* Legend */}
        <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
          {["#34d399", "#facc15", "#fb923c", "#f87171"].map((c) => (
            <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
          ))}
          <span className="text-[7px] font-mono text-white/30 ml-0.5">low → high</span>
        </div>
      </div>
      {/* Top fatigued zone */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[9px] font-mono text-white/30">Peak fatigue</span>
        <span className="text-[9px] font-mono text-rose-400">Shoulders · 89%</span>
      </div>
    </div>
  );
}

export function RecoveryEngine() {
  return (
    <div className="h-full flex flex-col gap-3 py-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest">Recovery Engine</h2>
          <p className="text-sm font-semibold text-white/80 mt-0.5">Predictive Protocol</p>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 rounded-full border border-cyan-400/40 border-t-cyan-400"
          style={{ borderColor: "#00d4ff40", borderTopColor: "#00d4ff" }}
        />
      </div>

      {/* Score + Predicted fatigue */}
      <div className="glass rounded-xl p-3 flex items-center gap-4">
        <ScoreRing score={RECOVERY_SCORE} />
        <div className="flex-1 space-y-2">
          <div>
            <div className="text-[9px] font-mono text-white/30 uppercase tracking-wider mb-1">Predicted Fatigue +24h</div>
            <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 8%)" }}>
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: "linear-gradient(90deg, #34d399, #facc15, #f87171)" }}
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1.5, delay: 0.6 }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[8px] font-mono text-white/25">low</span>
              <span className="text-[8px] font-mono text-amber-400">65% load</span>
              <span className="text-[8px] font-mono text-white/25">high</span>
            </div>
          </div>
          <div>
            <div className="text-[9px] font-mono text-white/30 uppercase tracking-wider mb-1">Readiness Index</div>
            <div className="flex items-center gap-2">
              {[82, 76, 88, 71, 90].map((v, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${(v / 100) * 24}px`,
                    background: `oklch(0.68 0.18 ${155 + i * 15})`,
                    opacity: 0.7,
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.08 + 0.8, origin: "bottom" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fatigue Heat Map */}
      <FatigueMap />

      {/* Recommendations */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider block px-1">Recommendations</span>
        {RECOMMENDATIONS.map((rec, i) => {
          const Icon = rec.icon;
          return (
            <motion.div
              key={rec.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.4 }}
              whileHover={{ scale: 1.01, x: -3 }}
              className="glass rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer"
              style={{ borderColor: rec.color + "20" }}
            >
              <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: rec.color + "18" }}>
                <Icon size={11} style={{ color: rec.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-white/80 truncate">{rec.label}</span>
                  <span
                    className="text-[8px] font-mono px-1 py-0.5 rounded flex-shrink-0 ml-1"
                    style={{ color: PRIORITY_STYLE[rec.priority], background: PRIORITY_STYLE[rec.priority] + "15" }}
                  >
                    {rec.priority}
                  </span>
                </div>
                <p className="text-[9px] text-white/35 mt-0.5">{rec.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
