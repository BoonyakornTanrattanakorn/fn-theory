import React from 'react';

export default function RangeSelector({ nStart, nEnd, setNStart, setNEnd, onPlot }) {
  return (
    <div style={{display: 'flex', gap: 24, alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        <label htmlFor="nStart" style={{fontWeight: 500, color: '#374151'}}>n start</label>
        <input
          id="nStart"
          type="number"
          value={nStart}
          onChange={e => setNStart(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            fontSize: 16,
            width: 100,
            background: '#f1f5f9'
          }}
        />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        <label htmlFor="nEnd" style={{fontWeight: 500, color: '#374151'}}>n end</label>
        <input
          id="nEnd"
          type="number"
          value={nEnd}
          onChange={e => setNEnd(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            fontSize: 16,
            width: 100,
            background: '#f1f5f9'
          }}
        />
      </div>
      <button
        onClick={onPlot}
        style={{
          padding: '10px 28px',
          background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(37,99,235,0.08)'
        }}
      >
        Plot
      </button>
    </div>
  );
}