-- Run if you already applied schema.sql before assigned_staff_id existed:
-- psql "$DATABASE_URL" -f database/migrations/001_appointments_assigned_staff.sql

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS assigned_staff_id UUID REFERENCES users (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_appointments_assigned_staff ON appointments (assigned_staff_id);
