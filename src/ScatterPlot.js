import React from 'react';

export default function ScatterPlot({ graphData, nStart, nEnd, width, height, padding, maxCnt, xTicks, yTicks, tooltip, setTooltip }) {
  return (
    <svg width={width} height={height} style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8, width: '100%', maxWidth: '100%' }}>
      {/* Axes */}
      <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#2563eb" strokeWidth={2} />
      <line x1={padding} y1={padding} x2={padding} y2={height-padding} stroke="#2563eb" strokeWidth={2} />
      {/* X axis ticks and labels */}
      {xTicks.map((tick, i) => {
        const x = padding + ((width - 2*padding) * (tick - nStart)) / (nEnd - nStart || 1);
        return (
          <g key={i}>
            <line x1={x} y1={height-padding} x2={x} y2={height-padding+12} stroke="#94a3b8" />
            <text x={x} y={height-padding+32} textAnchor="middle" fontSize="13" fill="#374151">{tick}</text>
          </g>
        );
      })}
      {/* Y axis ticks and labels */}
      {yTicks.map((tick, i) => {
        const y = height - padding - ((height - 2*padding) * tick) / maxCnt;
        return (
          <g key={i}>
            <line x1={padding-12} y1={y} x2={padding} y2={y} stroke="#94a3b8" />
            <text x={padding-18} y={y+5} textAnchor="end" fontSize="13" fill="#374151">{tick}</text>
          </g>
        );
      })}
      {/* Points */}
      {graphData.map((d, i) => {
        const x = padding + ((width - 2*padding) * (d.n - nStart)) / (nEnd - nStart || 1);
        const y = height - padding - ((height - 2*padding) * d.cnt) / maxCnt;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={5}
            fill="#2563eb"
            style={{cursor: 'pointer', transition: 'fill 0.2s'}}
            onMouseEnter={e => setTooltip({ visible: true, x, y, n: d.n, cnt: d.cnt })}
            onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
          />
        );
      })}
      {/* Axis labels */}
      <text x={width/2} y={height-16} textAnchor="middle" fontSize="16" fill="#2563eb" fontWeight={600}>n</text>
      <text x={padding-30} y={height/2} textAnchor="middle" fontSize="16" fill="#2563eb" fontWeight={600} transform={`rotate(-90 ${padding-30},${height/2})`}># solutions</text>
    </svg>
  );
}