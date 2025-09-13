import React from 'react';

export default function FnForm({ form, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} style={{display: 'flex', gap: 24, alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        <label htmlFor="n" style={{fontWeight: 500, color: '#374151'}}>n</label>
        <input
          id="n"
          name="n"
          value={form.n}
          onChange={onChange}
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
        <label htmlFor="a" style={{fontWeight: 500, color: '#374151'}}>a</label>
        <input
          id="a"
          name="a"
          value={form.a}
          onChange={onChange}
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
        <label htmlFor="b" style={{fontWeight: 500, color: '#374151'}}>b</label>
        <input
          id="b"
          name="b"
          value={form.b}
          onChange={onChange}
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
        type="submit"
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
        Search
      </button>
    </form>
  );
}