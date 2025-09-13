import React from 'react';

export default function ProgressBar({ progress, graphDuration }) {
  return (
    <div style={{margin: '10px 0'}}>
      {progress > 0 && progress < 100 && (
        <>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            background: '#e0e7ff',
            height: '18px',
            borderRadius: '9px',
            overflow: 'hidden',
            marginBottom: '6px',
            boxShadow: '0 1px 4px rgba(37,99,235,0.08)'
          }}>
            <div style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
              height: '100%'
            }}></div>
          </div>
          <div style={{fontWeight: 500, color: '#2563eb'}}>Progress: {progress}%</div>
          <div style={{fontWeight: 500, color: '#2563eb'}}>Time elapsed: {graphDuration.toFixed(2)} ms</div>
        </>
      )}
      {progress === 100 && (
        <div style={{fontWeight: 500, color: '#2563eb'}}>Plot completed in {graphDuration.toFixed(2)} ms</div>
      )}
    </div>
  );
}