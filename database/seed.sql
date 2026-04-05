-- Optional reference data (mirrors frontend/public/data/*.json)
-- Run after schema.sql

INSERT INTO services (title, description, thumbnail, link_path, sort_order) VALUES
  ('Dental Implants', 'Permanent tooth replacement.', '/assets/services/implant-thumb.jpg', '/implants', 1),
  ('Invisalign', 'Clear aligners for straightening teeth.', '/assets/services/invisalign-thumb.jpg', '/invisalign', 2),
  ('Dental Cosmetics', 'Enhance your smile with whitening, and more.', '/assets/services/cosmetic-thumb.jpg', '/cosmetic', 3);

-- team_members has no unique constraint; skip duplicates manually or truncate before seed.
INSERT INTO team_members (name, role, photo, student_id) VALUES
  ('Saed Aghbar', 'Backend Developer', '/assets/team/saed.jpg', '12429711'),
  ('Ayoub Aghbar', 'Full Stack Developer', '/assets/team/ayoub.jpg', '12428124'),
  ('Eyas Marshoud', 'Backend Developer', '/assets/team/eyas.jpg', '12428791'),
  ('Nsralla Dabeek', 'Backend Developer', '/assets/team/nsralla.jpg', '12428610'),
  ('Khaled Saqir', 'Backend Developer', '/assets/team/khaled.jpg', '12326115');

INSERT INTO gallery_items (title, description, image_url, category) VALUES
  ('Smile 1 – Before', NULL, '/assets/gallery/before1.jpg', 'before-after'),
  ('Smile 1 – After', NULL, '/assets/gallery/after1.jpg', 'before-after'),
  ('Smile 2 – Before', NULL, '/assets/gallery/before2.jpg', 'before-after'),
  ('Smile 2 – After', NULL, '/assets/gallery/before2.jpg', 'before-after'),
  ('Smile 3 – Before', NULL, '/assets/gallery/implant-before1.jpg', 'implants'),
  ('Smile 3 – After', NULL, '/assets/gallery/implant-after1.jpg', 'implants');

INSERT INTO testimonials (author_name, text, rating, status) VALUES
  ('Maya R.', 'Excellent care and friendly staff.', 5, 'approved'),
  ('Omar S.', 'My implants changed my life.', 5, 'approved'),
  ('Ahmad J.', 'The best dental clinic I''ve ever visited.', 5, 'approved'),
  ('Fuad F.', 'Highly recommend to anyone needing dental implants.', 4, 'approved'),
  ('Saeed A.', 'I am very satisfied with my dental implants.', 3, 'approved'),
  ('Laila K.', 'Great service and friendly atmosphere.', 4, 'approved');

-- Demo appointments (no patient user — admin dashboard still useful)
INSERT INTO appointments (appointment_date, status, notes) VALUES
  (date_trunc('day', now()) + interval '10 hours', 'pending', 'Consultation — demo'),
  (date_trunc('day', now()) + interval '1 day' + interval '14 hours', 'confirmed', 'Follow-up — demo'),
  (date_trunc('day', now()) + interval '3 days' + interval '9 hours', 'pending', 'Cleaning — demo');
