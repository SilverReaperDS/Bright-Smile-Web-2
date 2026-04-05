// src/components/ErrorMessage.js
import React from 'react';
import '../../styles/Shared/main.css';

export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div
      role="alert"
      className="error-message"
      style={{
        padding: 12,
        border: '1px solid #f2a6a6',
        background: '#fff6f6',
        borderRadius: 6,
      }}
    >
      <strong style={{ color: '#b00020' }}>{title}</strong>
      {message && <div style={{ marginTop: 6, color: '#6b0000' }}>{message}</div>}
      {onRetry && (
        <div style={{ marginTop: 10 }}>
          <button className="btn primary" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}