import React from 'react';

export default function ResultDisplay({ count, duration }) {
  return (
    <div style={{
      display: 'flex',
      gap: 32,
      alignItems: 'center',
      marginBottom: 32,
      flexWrap: 'wrap'
    }}>
      <div style={{
        background: '#f1f5f9',
        borderRadius: 8,
        padding: '16px 24px',
        minWidth: 180,
        textAlign: 'center',
        fontSize: 18,
        color: '#2563eb',
        fontWeight: 500
      }}>
        Count of solutions: <span style={{color: '#0ea5e9'}}>{count}</span>
      </div>
      <div style={{
        background: '#f1f5f9',
        borderRadius: 8,
        padding: '16px 24px',
        minWidth: 180,
        textAlign: 'center',
        fontSize: 18,
        color: '#2563eb',
        fontWeight: 500
      }}>
        Calculation time: <span style={{color: '#0ea5e9'}}>{duration.toFixed(2)} ms</span>
      </div>
    </div>
  );
}