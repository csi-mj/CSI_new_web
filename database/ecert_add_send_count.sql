-- E-certificate feature upgrades (additive, idempotent — safe to re-run)
-- 1. Track how many times each recipient's certificate has been emailed:
ALTER TABLE ecert_recipients ADD COLUMN IF NOT EXISTS send_count INTEGER NOT NULL DEFAULT 0;

-- 2. Official letterhead wrapper for e-certificate emails (CSI header + contact
--    footer pulled from platform_settings), configurable per template:
ALTER TABLE ecert_templates ADD COLUMN IF NOT EXISTS use_letterhead BOOLEAN NOT NULL DEFAULT TRUE;