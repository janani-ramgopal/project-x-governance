CREATE TABLE IF NOT EXISTS models (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  owner_team TEXT NOT NULL,
  vendor TEXT NOT NULL,
  model_type TEXT NOT NULL,             -- LLM | ML | RULE
  environment TEXT NOT NULL,            -- Sandbox | Production
  pii_access BOOLEAN NOT NULL DEFAULT FALSE,

  logging_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  sla_defined BOOLEAN NOT NULL DEFAULT FALSE,
  security_review_status TEXT NOT NULL DEFAULT 'Pending',  -- Pending | Approved | Rejected
  risk_level TEXT NOT NULL DEFAULT 'Medium',               -- Low | Medium | High
  explainability_available BOOLEAN NOT NULL DEFAULT FALSE,

  tier INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Active', -- Draft | Active | Deprecated

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY,
  action TEXT NOT NULL,
  model_id UUID,
  actor TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
