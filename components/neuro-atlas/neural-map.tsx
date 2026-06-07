"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  value: number;
  category: "cognitive" | "physical" | "recovery" | "stress" | "core";
  connections: string[];
}

interface NeuralMapProps {
  onNodeSelect: (node: Node | null) => void;
  selectedNode: Node | null;
}

const NODES: Node[] = [
  { id: "core", x: 50, y: 50, label: "Neural Core", value: 87, category: "core", connections: ["cog1", "cog2", "phy1", "rec1", "str1"] },
  { id: "cog1", x: 25, y: 25, label: "Focus Index", value: 92, category: "cognitive", connections: ["core", "cog2"] },
  { id: "cog2", x: 30, y: 68, label: "Memory Load", value: 74, category: "cognitive", connections: ["core", "cog1", "str1"] },
  { id: "phy1", x: 72, y: 22, label: "Muscle Output", value: 68, category: "physical", connections: ["core", "phy2", "rec1"] },
  { id: "phy2", x: 78, y: 58, label: "VO2 Capacity", value: 81, category: "physical", connections: ["phy1", "core", "rec2"] },
  { id: "rec1", x: 62, y: 80, label: "Sleep Quality", value: 63, category: "recovery", connections: ["core", "phy1", "rec2"] },
  { id: "rec2", x: 82, y: 80, label: "HRV Score", value: 78, category: "recovery", connections: ["rec1", "phy2"] },
  { id: "str1", x: 18, y: 48, label: "Cortisol Load", value: 45, category: "stress", connections: ["core", "cog2"] },
  { id: "str2", x: 44, y: 14, label: "Inflammation", value: 38, category: "stress", connections: ["cog1", "phy1"] },
  { id: "meta1", x: 48, y: 82, label: "Metabolic Rate", value: 85, category: "physical", connections: ["core", "rec1", "phy2"] },
];

const CATEGORY_COLORS: Record<Node["category"], string> = {
  core: "#00d4ff",
  cognitive: "#a78bfa",
  physical: "#34d399",
  recovery: "#60a5fa",
  stress: "#f87171",
};

const CATEGORY_GLOW: Record<Node["category"], string> = {
  core: "0 0 30px #00d4ff88, 0 0 60px #00d4ff44",
  cognitive: "0 0 25px #a78bfa88, 0 0 50px #a78bfa44",
  physical: "0 0 25px #34d39988, 0 0 50px #34d39944",
  recovery: "0 0 25px #60a5fa88, 0 0 50px #60a5fa44",
  stress: "0 0 25px #f8717188, 0 0 50px #f8717144",
};

function getNodeRadius(node: Node) {
  return node.category === "core" ? 28 : 16 + (node.value / 100) * 8;
}

export function NeuralMap({ onNodeSelect, selectedNode }: NeuralMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    if (svgRef.current?.parentElement) observer.observe(svgRef.current.parentElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let start: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      setPulsePhase((ts - start) / 1000);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const toSvg = useCallback((pct: number, dim: number) => (pct / 100) * dim, []);

  const getNodePos = useCallback((node: Node) => ({
    x: toSvg(node.x, dimensions.width),
    y: toSvg(node.y, dimensions.height),
  }), [dimensions, toSvg]);

  const isHighlighted = useCallback((node: Node) => {
    if (!selectedNode && !hoveredNode) return true;
    const active = selectedNode?.id ?? hoveredNode;
    if (node.id === active) return true;
    const activeNode = NODES.find((n) => n.id === active);
    return activeNode?.connections.includes(node.id) ?? false;
  }, [selectedNode, hoveredNode]);

  return (
    <div className="relative w-full h-full">
      {/* Background grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00d4ff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute left-0 right-0 h-px scan-line"
          style={{ background: "linear-gradient(90deg, transparent, #00d4ff44, transparent)" }}
        />
      </div>

      {mounted && <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </radialGradient>
          <filter id="blur-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {NODES.flatMap((node) =>
          node.connections
            .filter((cId) => cId > node.id)
            .map((cId) => {
              const target = NODES.find((n) => n.id === cId);
              if (!target) return null;
              const from = getNodePos(node);
              const to = getNodePos(target);
              const active = selectedNode?.id ?? hoveredNode;
              const isActive = active
                ? (node.id === active || target.id === active ||
                   NODES.find(n => n.id === active)?.connections.includes(node.id) &&
                   NODES.find(n => n.id === active)?.connections.includes(target.id))
                : true;
              const pulse = Math.sin(pulsePhase * 1.2 + node.x * 0.05) * 0.4 + 0.6;

              return (
                <g key={`${node.id}-${cId}`}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke="#00d4ff"
                    strokeWidth={isActive ? 1.5 : 0.5}
                    strokeOpacity={isActive ? pulse * 0.5 : 0.1}
                    strokeDasharray={isActive ? "none" : "4 4"}
                  />
                  {isActive && (
                    <line
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke="#00d4ff"
                      strokeWidth={3}
                      strokeOpacity={pulse * 0.15}
                      filter="url(#blur-glow)"
                    />
                  )}
                </g>
              );
            })
        )}

        {/* Nodes */}
        {NODES.map((node) => {
          const pos = getNodePos(node);
          const r = getNodeRadius(node);
          const color = CATEGORY_COLORS[node.category];
          const highlighted = isHighlighted(node);
          const isSelected = selectedNode?.id === node.id;
          const isHovered = hoveredNode === node.id;
          const pulse = Math.sin(pulsePhase * (node.category === "core" ? 1.5 : 1.0) + node.x * 0.1) * 0.15 + 0.85;
          const rAnimated = r * (isSelected || isHovered ? 1.15 : pulse);

          return (
            <g
              key={node.id}
              style={{ cursor: "pointer" }}
              onClick={() => onNodeSelect(isSelected ? null : node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Outer glow ring */}
              {(isSelected || isHovered) && (
                <circle
                  cx={pos.x} cy={pos.y} r={rAnimated + 12}
                  fill="none"
                  stroke={color}
                  strokeWidth={1}
                  strokeOpacity={0.4}
                  strokeDasharray="3 3"
                />
              )}

              {/* Background pulse ring */}
              <circle
                cx={pos.x} cy={pos.y}
                r={rAnimated + (isSelected ? 18 : 8)}
                fill={color}
                fillOpacity={highlighted ? 0.06 : 0.02}
              />

              {/* Main node */}
              <circle
                cx={pos.x} cy={pos.y} r={rAnimated}
                fill={`${color}22`}
                stroke={color}
                strokeWidth={isSelected ? 2.5 : 1.5}
                strokeOpacity={highlighted ? 1 : 0.3}
              />

              {/* Inner fill */}
              <circle
                cx={pos.x} cy={pos.y} r={rAnimated * 0.55}
                fill={color}
                fillOpacity={highlighted ? (isSelected ? 0.6 : 0.3) : 0.1}
              />

              {/* Value arc */}
              <circle
                cx={pos.x} cy={pos.y} r={rAnimated - 4}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeOpacity={highlighted ? 0.6 : 0.15}
                strokeDasharray={`${(node.value / 100) * (2 * Math.PI * (rAnimated - 4))} 1000`}
                transform={`rotate(-90 ${pos.x} ${pos.y})`}
              />

              {/* Label */}
              {(highlighted || isHovered || isSelected) && (
                <>
                  <text
                    x={pos.x} y={pos.y + rAnimated + 16}
                    textAnchor="middle"
                    fill={color}
                    fontSize={node.category === "core" ? 11 : 10}
                    fontFamily="var(--font-geist-mono)"
                    opacity={0.9}
                  >
                    {node.label}
                  </text>
                  <text
                    x={pos.x} y={pos.y + rAnimated + 27}
                    textAnchor="middle"
                    fill={color}
                    fontSize={9}
                    fontFamily="var(--font-geist-mono)"
                    opacity={0.6}
                  >
                    {node.value}%
                  </text>
                </>
              )}

              {/* Core center dot */}
              {node.category === "core" && (
                <circle cx={pos.x} cy={pos.y} r={6} fill={color} fillOpacity={0.9} />
              )}
            </g>
          );
        })}
      </svg>}

      {/* Selected node info overlay */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 glass rounded-xl px-4 py-2 text-xs font-mono"
            style={{ borderColor: CATEGORY_COLORS[selectedNode.category] + "40" }}
          >
            <span style={{ color: CATEGORY_COLORS[selectedNode.category] }}>
              {selectedNode.label}
            </span>
            <span className="text-white/40 mx-2">|</span>
            <span className="text-white/70">{selectedNode.value}% efficiency</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
