-- Optional manual migration (also applied automatically on backend startup via ensureSchema)
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
UPDATE users SET phone = '' WHERE phone IS NULL;

ALTER TABLE messages ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
