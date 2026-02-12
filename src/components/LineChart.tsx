"use client";

import { formatCurrency } from "@/lib/calc";

type Point = {
  xLabel: string;
  yValue: number;
};

type Props = {
  points: Point[];
  title: string;
};

export function LineChart({ points, title }: Props) {
  if (points.length === 0) {
    return null;
  }

  const width = 760;
  const height = 280;
  const paddingLeft = 60;
  const paddingRight = 28;
  const paddingTop = 24;
  const paddingBottom = 36;
  const minY = Math.min(...points.map((point) => point.yValue));
  const maxY = Math.max(...points.map((point) => point.yValue));
  const yRange = Math.max(1, maxY - minY);

  const coords = points.map((point, index) => {
    const x = paddingLeft + (index / Math.max(1, points.length - 1)) * (width - paddingLeft - paddingRight);
    const y = height - paddingBottom - ((point.yValue - minY) / yRange) * (height - paddingTop - paddingBottom);
    return { ...point, x, y };
  });

  const linePath = coords.map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  // Area fill path (close to bottom)
  const areaPath = linePath + ` L ${coords[coords.length - 1].x} ${height - paddingBottom} L ${coords[0].x} ${height - paddingBottom} Z`;

  // Generate ~5 horizontal gridlines
  const gridLines: { y: number; label: string }[] = [];
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const val = minY + (yRange / steps) * i;
    const y = height - paddingBottom - ((val - minY) / yRange) * (height - paddingTop - paddingBottom);
    // Abbreviate large numbers
    let label: string;
    if (val >= 1000000) {
      label = `$${(val / 1000000).toFixed(1)}M`;
    } else if (val >= 1000) {
      label = `$${(val / 1000).toFixed(0)}K`;
    } else {
      label = `$${val.toFixed(0)}`;
    }
    gridLines.push({ y, label });
  }

  // X-axis labels (show ~6 evenly spaced)
  const xLabelCount = Math.min(6, points.length);
  const xLabels: { x: number; label: string }[] = [];
  for (let i = 0; i < xLabelCount; i++) {
    const idx = Math.round((i / (xLabelCount - 1)) * (points.length - 1));
    xLabels.push({ x: coords[idx].x, label: points[idx].xLabel });
  }

  return (
    <section className="card" style={{ marginTop: "1rem" }}>
      <h3>{title}</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img" aria-label={title}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x={0} y={0} width={width} height={height} fill="#ffffff" />

        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 6}
              y={line.y + 4}
              textAnchor="end"
              fill="#94a3b8"
              fontSize="10"
              fontFamily="system-ui, sans-serif"
            >
              {line.label}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />

        {/* End point dot */}
        <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="4" fill="#1e40af" />

        {/* X-axis labels */}
        {xLabels.map((lbl, i) => (
          <text
            key={i}
            x={lbl.x}
            y={height - 8}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="10"
            fontFamily="system-ui, sans-serif"
          >
            {lbl.label}
          </text>
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
        <span className="tiny">Start: {points[0].xLabel}</span>
        <span className="tiny">End: {points[points.length - 1].xLabel} &mdash; {formatCurrency(points[points.length - 1].yValue)}</span>
      </div>
    </section>
  );
}
