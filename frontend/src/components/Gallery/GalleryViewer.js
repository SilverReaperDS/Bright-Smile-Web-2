import React from 'react';
import './gallery.css';

function CaseCard({ c }) {
  const hasAfter = Boolean(c.afterImage);

  return (
    <article className="gallery-case">
      <div className={`gallery-case-pair ${hasAfter ? 'gallery-case-pair--two' : 'gallery-case-pair--one'}`}>
        <div className="gallery-case-panel">
          <span className="gallery-case-label">Before</span>
          <div className="gallery-case-image-wrap">
            <img src={c.beforeImage} alt={`${c.title || 'Case'} — before`} />
          </div>
        </div>
        {hasAfter && (
          <div className="gallery-case-panel">
            <span className="gallery-case-label">After</span>
            <div className="gallery-case-image-wrap">
              <img src={c.afterImage} alt={`${c.title || 'Case'} — after`} />
            </div>
          </div>
        )}
      </div>
      {(c.title || c.description || c.category) && (
        <div className="gallery-case-meta">
          {c.title && <h3 className="gallery-case-title">{c.title}</h3>}
          {c.category && <span className="gallery-case-category">{c.category}</span>}
          {c.description && <p className="gallery-case-desc">{c.description}</p>}
        </div>
      )}
    </article>
  );
}

export default function GalleryViewer({ cases = [] }) {
  if (!cases.length) return null;
  return (
    <section className="gallery-section">
      <h2>Smile Transformations</h2>
      <p className="gallery-section-lead">Before and after photos are shown side by side for each smile transformation.</p>
      <div className="gallery-cases">
        {cases.map((c) => (
          <CaseCard key={c.id} c={c} />
        ))}
      </div>
    </section>
  );
}
