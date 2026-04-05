// src/components/ServiceCard.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ title, description, thumbnail, link }) {
  return (
    <Link to={link} className="card-link">
      <article className="card service-card">
        {thumbnail && <img src={thumbnail} alt={title} className="card-img" />}
        <div className="card-body">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </article>
    </Link>
  );
}