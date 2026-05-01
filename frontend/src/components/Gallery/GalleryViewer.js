import React from 'react';
import './gallery.css';

function CaseCard({ c }) {
  const hasAfter = Boolean(c.afterImage);

  return (
    <article className="gallery-case" tabIndex={0}>
      <div className={`gallery-case-pair ${hasAfter ? 'gallery-case-pair--two' : 'gallery-case-pair--one'}`}>
        <div className="gallery-case-panel">
          <div className="gallery-case-image-wrap">
            <span className="gallery-case-label">Before</span>
            <img src={c.beforeImage} alt={`${c.title || 'Case'} — before`} loading="lazy" />
          </div>
        </div>
        {hasAfter && (
          <div className="gallery-case-panel">
            <div className="gallery-case-image-wrap">
              <span className="gallery-case-label">After</span>
              <img src={c.afterImage} alt={`${c.title || 'Case'} — after`} loading="lazy" />
            </div>
          </div>
        )}
      </div>
      {(c.title || c.description || c.category) && (
        <div className="gallery-case-meta">
          {c.category && <span className="gallery-case-category">{c.category}</span>}
          {c.title && <h3 className="gallery-case-title">{c.title}</h3>}
          {c.description && <p className="gallery-case-desc">{c.description}</p>}
        </div>
      )}
    </article>
  );
}

export default function GalleryViewer({ cases = [] }) {
  if (!cases.length) return null;
  return (
    <section className="gallery-section" aria-label="Smile transformations gallery">
      <div className="gallery-cases">
        {cases.map((c) => (
          <CaseCard key={c.id} c={c} />
        ))}
      </div>
    </section>
  );
}
