-- Enable pending appointments for manual bank-transfer confirmation flow.
-- Run once on PostgreSQL before deploying the backend changes.

BEGIN;

DO $$
DECLARE
  status_check_name TEXT;
BEGIN
  SELECT c.conname
    INTO status_check_name
  FROM pg_constraint c
  JOIN pg_class t ON t.oid = c.conrelid
  JOIN pg_namespace n ON n.oid = t.relnamespace
  WHERE n.nspname = current_schema()
    AND t.relname = 'appointments'
    AND c.contype = 'c'
    AND pg_get_constraintdef(c.oid) ILIKE '%status%'
  ORDER BY c.oid
  LIMIT 1;

  IF status_check_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE appointments DROP CONSTRAINT %I', status_check_name);
  END IF;
END $$;

ALTER TABLE appointments
  ADD CONSTRAINT appointments_status_check
  CHECK (status IN ('pending', 'confirmed', 'cancelled'));

COMMIT;

-- Optional verification:
-- SELECT conname, pg_get_constraintdef(oid)
-- FROM pg_constraint
-- WHERE conrelid = 'appointments'::regclass;
