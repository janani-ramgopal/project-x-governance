import express from "express";
import cors from "cors";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { pool } from "./db.js";
import { calculateTier } from "./tier.js";
import { validateModelForUse } from "./validation.js";

const app = express();
app.use(cors());
app.use(express.json());

const ModelSchema = z.object({
  name: z.string().min(2),
  owner_team: z.string().min(2),
  vendor: z.string().min(2),
  model_type: z.enum(["LLM", "ML", "RULE"]),
  environment: z.enum(["Sandbox", "Production"]),
  pii_access: z.boolean().default(false),
  logging_enabled: z.boolean().default(false),
  sla_defined: z.boolean().default(false),
  security_review_status: z.enum(["Pending", "Approved", "Rejected"]).default("Pending"),
  risk_level: z.enum(["Low", "Medium", "High"]).default("Medium"),
  explainability_available: z.boolean().default(false),
  status: z.enum(["Draft", "Active", "Deprecated"]).default("Active")
});

async function audit(action, actor, model_id = null, details = {}) {
  await pool.query(
    `INSERT INTO audit_log (id, action, model_id, actor, details) VALUES ($1,$2,$3,$4,$5)`,
    [uuid(), action, model_id, actor, details]
  );
}

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/models", async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM models ORDER BY created_at DESC`);
  res.json(rows);
});

app.get("/models/:id", async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM models WHERE id=$1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

app.post("/models/register", async (req, res) => {
  const parsed = ModelSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const id = uuid();
  const model = parsed.data;
  const tier = calculateTier(model);

  await pool.query(
    `INSERT INTO models (
      id, name, owner_team, vendor, model_type, environment, pii_access,
      logging_enabled, sla_defined, security_review_status, risk_level, explainability_available,
      tier, status
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,
      $8,$9,$10,$11,$12,
      $13,$14
    )`,
    [
      id, model.name, model.owner_team, model.vendor, model.model_type, model.environment, model.pii_access,
      model.logging_enabled, model.sla_defined, model.security_review_status, model.risk_level, model.explainability_available,
      tier, model.status
    ]
  );

  await audit("MODEL_REGISTERED", req.header("x-actor") ?? "unknown", id, { tier });

  res.status(201).json({ id, tier });
});

app.post("/governance/validate", async (req, res) => {
  const schema = z.object({
    model_id: z.string().uuid(),
    required_tier: z.number().int().min(0).max(4).default(3),
    target_env: z.enum(["Sandbox", "Production"]).default("Production")
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { model_id, required_tier, target_env } = parsed.data;
  const { rows } = await pool.query(`SELECT * FROM models WHERE id=$1`, [model_id]);
  const model = rows[0];

  const decision = validateModelForUse(model, { requiredTier: required_tier, targetEnv: target_env });

  await audit("MODEL_VALIDATED", req.header("x-actor") ?? "project-x", model_id, {
    required_tier, target_env, decision
  });

  res.json({ model_id, ...decision, snapshot: model ? { tier: model.tier, risk_level: model.risk_level, pii_access: model.pii_access } : null });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Governance API running on :${port}`));
