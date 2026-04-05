// src/components/GalleryViewer.js
import React from 'react';
import './gallery.css';

export default function GalleryViewer({ items }) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <section className="gallery-section">
      <h2>Smile Transformations</h2>
      <div className="gallery-rows">
        {rows.map((pair, index) => (
          <div key={index} className="gallery-row">
            {pair.map((item, i) => (
              <div key={i} className="gallery-item">
                <img src={item.image} alt={item.caption || `Smile ${index * 2 + i + 1}`} />
                {item.caption && <p className="caption">{item.caption}</p>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}