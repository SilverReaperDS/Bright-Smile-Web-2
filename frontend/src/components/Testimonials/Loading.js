// src/components/Loading.js
import React from 'react';
import '../../styles/Shared/main.css';

export default function Loading({ label = 'Loading…' }) {
  return (
    <div role="status" aria-live="polite" className="loading">
      <svg width="36" height="36" viewBox="0 0 50 50" aria-hidden>
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="#0db1ad"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <span className="muted" style={{ marginLeft: 12 }}>{label}</span>
    </div>
  );
}