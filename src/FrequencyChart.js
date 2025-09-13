import React from 'react';

export default function FrequencyChart({ freqEntries, chartWidth, chartHeight, chartPadding, maxFreq, barTooltip, setBarTooltip }) {
  return (
    <svg width={chartWidth} height={chartHeight} style={{display: 'block', margin: '0 auto', width: '100%', maxWidth: '100%'}}>
      {/* X axis */}
      <line x1={chartPadding} y1={chartHeight-chartPadding} x2={chartWidth-chartPadding} y2={chartHeight-chartPadding} stroke="#2563eb" strokeWidth={2} />
      {/* Y axis */}
      <line x1={chartPadding} y1={chartPadding} x2={chartPadding} y2={chartHeight-chartPadding} stroke="#2563eb" strokeWidth={2} />
      {/* Y axis ticks/labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const y = chartHeight-chartPadding - p*(chartHeight-2*chartPadding-20);
        const val = Math.round(maxFreq*p);
        return (
          <g key={i}>
            <line x1={chartPadding-12} y1={y} x2={chartPadding} y2={y} stroke="#94a3b8" />
            <text x={chartPadding-18} y={y+5} textAnchor="end" fontSize="12" fill="#374151">{val}</text>
          </g>
        );
      })}
      {/* Bars */}
      {freqEntries.map((entry, i) => {
        const barWidth = Math.max(12, (chartWidth - 2*chartPadding) / (freqEntries.length || 1) - 8);
        const x = chartPadding + i*(barWidth+8);
        // Minimum bar height for visibility
        const rawBarHeight = (entry.freq / maxFreq) * (chartHeight-2*chartPadding-20);
        const barHeight = Math.max(rawBarHeight, entry.freq > 0 ? 4 : 0);
        return (
          <g key={entry.cnt}>
            <rect
              x={x}
              y={chartHeight-chartPadding-barHeight}
              width={barWidth}
              height={barHeight}
              fill="#60a5fa"
              rx={6}
              style={{cursor: 'pointer'}}
              onMouseEnter={e => setBarTooltip({
                visible: true,
                x: x + barWidth/2,
                y: chartHeight-chartPadding-barHeight-10,
                n: entry.cnt,
                cnt: entry.freq
              })}
              onMouseLeave={() => setBarTooltip({...barTooltip, visible: false})}
            />
            <text
              x={x + barWidth/2}
              y={chartHeight-chartPadding+24}
              textAnchor="middle"
              fontSize="13"
              fill="#2563eb"
              fontWeight={500}
            >
              {entry.cnt}
            </text>
          </g>
        );
      })}
      {/* Axis labels */}
      <text x={chartWidth/2} y={chartHeight-8} textAnchor="middle" fontSize="15" fill="#2563eb" fontWeight={600}># solutions</text>
      <text x={chartPadding-40} y={chartHeight/2} textAnchor="middle" fontSize="15" fill="#2563eb" fontWeight={600} transform={`rotate(-90 ${chartPadding-40},${chartHeight/2})`}>Frequency</text>
    </svg>
  );
}