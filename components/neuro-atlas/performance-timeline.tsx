"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DATA = {
  cognitive: [72, 85, 91, 78, 92, 65, 58],
  physical: [80, 74, 68, 85, 77, 82, 70],
  recovery: [60, 68, 72, 63, 70, 85, 76],
  stress: [45, 55, 40, 65, 42, 30, 38],
};

const SERIES = [
  { key: "cognitive" as const, label: "Cognitive", color: "#a78bfa" },
  { key: "physical" as const, label: "Physical", color: "#34d399" },
  { key: "recovery" as const, label: "Recovery", color: "#60a5fa" },
  { key: "stress" as const, label: "Stress Load", color: "#f87171" },
];

const TODAY = 6; // index of current day

function sparklinePath(values: number[], width: number, height: number, padX = 20, padY = 8) {
  const n = values.length;
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;
  const xStep = (width - padX * 2) / (n - 1);

  const pts = values.map((v, i) => ({
    x: padX + i * xStep,
    y: padY + (1 - (v - minV) / range) * (height - padY * 2),
  }));

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cpX = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C ${cpX} ${pts[i - 1].y} ${cpX} ${pts[i].y} ${pts[i].x} ${pts[i].y}`;
  }
  return { d, pts };
}

export function PerformanceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 80 });
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [activeSeries, setActiveSeries] = useState<Set<string>>(new Set(SERIES.map(s => s.key)));

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const e = entries[0];
      setDims({ w: e.contentRect.width, h: e.contentRect.height });
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const toggleSeries = (key: string) => {
    setActiveSeries(prev => {
      const next = new Set(prev);
      if (next.has(key)) { if (next.size > 1) next.delete(key); }
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col gap-2 px-2 py-2">
      {/* Header row */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Performance Evolution Stream</h2>
        </div>
        <div className="flex items-center gap-2">
          {SERIES.map(s => (
            <button
              key={s.key}
              onClick={() => toggleSeries(s.key)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono transition-all"
              style={{
                background: activeSeries.has(s.key) ? s.color + "18" : "oklch(1 0 0 / 4%)",
                border: `1px solid ${activeSeries.has(s.key) ? s.color + "40" : "oklch(1 0 0 / 8%)"}`,
                color: activeSeries.has(s.key) ? s.color : "oklch(1 0 0 / 30%)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: activeSeries.has(s.key) ? s.color : "oklch(1 0 0 / 20%)" }} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div ref={containerRef} className="flex-1 relative">
        <svg width={dims.w} height={dims.h} className="absolute inset-0">
          <defs>
            {SERIES.map(s => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* Horizontal grid lines */}
          {[25, 50, 75].map(v => {
            const y = 8 + (1 - v / 100) * (dims.h - 16);
            return (
              <line key={v} x1={20} y1={y} x2={dims.w - 20} y2={y}
                stroke="oklch(1 0 0 / 6%)" strokeWidth={1} strokeDasharray="3 6" />
            );
          })}

          {/* Day columns + hover */}
          {DAYS.map((day, i) => {
            const xStep = (dims.w - 40) / (DAYS.length - 1);
            const x = 20 + i * xStep;
            const isToday = i === TODAY;
            const isHovered = hoveredDay === i;

            return (
              <g key={day}>
                {isHovered && (
                  <line x1={x} y1={8} x2={x} y2={dims.h - 8}
                    stroke="oklch(1 0 0 / 20%)" strokeWidth={1} strokeDasharray="2 3" />
                )}
                {isToday && (
                  <line x1={x} y1={8} x2={x} y2={dims.h - 8}
                    stroke="#00d4ff" strokeWidth={1} strokeOpacity={0.4} />
                )}
                <rect
                  x={x - 16} y={8} width={32} height={dims.h - 16}
                  fill="transparent"
                  style={{ cursor: "crosshair" }}
                  onMouseEnter={() => setHoveredDay(i)}
                  onMouseLeave={() => setHoveredDay(null)}
                />
              </g>
            );
          })}

          {/* Series paths */}
          {SERIES.filter(s => activeSeries.has(s.key)).map(s => {
            const { d, pts } = sparklinePath(DATA[s.key], dims.w, dims.h);
            const areaD = d + ` L ${pts[pts.length - 1].x} ${dims.h - 8} L ${pts[0].x} ${dims.h - 8} Z`;

            return (
              <g key={s.key}>
                <path d={areaD} fill={`url(#grad-${s.key})`} />
                <motion.path
                  d={d}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                />
                {/* Data points */}
                {pts.map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r={i === TODAY ? 5 : 3}
                      fill={i === TODAY ? s.color : "oklch(0.1 0 0)"}
                      stroke={s.color}
                      strokeWidth={i === TODAY ? 2 : 1.5}
                      opacity={hoveredDay === null || hoveredDay === i ? 1 : 0.3}
                    />
                    {hoveredDay === i && (
                      <text x={pt.x} y={pt.y - 8} textAnchor="middle"
                        fill={s.color} fontSize={8} fontFamily="var(--font-geist-mono)">
                        {DATA[s.key][i]}%
                      </text>
                    )}
                  </g>
                ))}
              </g>
            );
          })}

          {/* Day labels */}
          {DAYS.map((day, i) => {
            const xStep = (dims.w - 40) / (DAYS.length - 1);
            const x = 20 + i * xStep;
            return (
              <text key={day} x={x} y={dims.h + 2} textAnchor="middle"
                fill={i === TODAY ? "#00d4ff" : "oklch(1 0 0 / 25%)"}
                fontSize={9} fontFamily="var(--font-geist-mono)">
                {i === TODAY ? "TODAY" : day}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
