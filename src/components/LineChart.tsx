"use client";

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
  const height = 240;
  const padding = 28;
  const minY = Math.min(...points.map((point) => point.yValue));
  const maxY = Math.max(...points.map((point) => point.yValue));
  const yRange = Math.max(1, maxY - minY);

  const coords = points.map((point, index) => {
    const x = padding + (index / Math.max(1, points.length - 1)) * (width - padding * 2);
    const y = height - padding - ((point.yValue - minY) / yRange) * (height - padding * 2);
    return { ...point, x, y };
  });

  const path = coords.map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <section className="card">
      <h3>{title}</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img" aria-label={title}>
        <rect x={0} y={0} width={width} height={height} fill="#ffffff" />
        <path d={path} fill="none" stroke="#0e7490" strokeWidth="3" />
      </svg>
      <p className="tiny">Start: {points[0].xLabel} | End: {points[points.length - 1].xLabel}</p>
    </section>
  );
}
