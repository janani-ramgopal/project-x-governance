import { tierName } from "./tier.js";

export function validateModelForUse(model, { requiredTier = 3, targetEnv = "Production" } = {}) {
  const reasons = [];
  const warnings = [];

  if (!model) {
    return { allowed: false, reasons: ["Model not found / not registered"], warnings: [] };
  }

  if (model.status !== "Active") reasons.push(`Model status is ${model.status}`);

  // Environment check (simple MVP)
  if (targetEnv === "Production" && model.environment !== "Production") {
    reasons.push("Model is not deployed/declared for Production environment");
  }

  // Tier gate
  if (model.tier < requiredTier) {
    reasons.push(`Tier ${model.tier} (${tierName(model.tier)}) is below required Tier ${requiredTier}`);
  }

  // Minimum governance for production
  if (targetEnv === "Production") {
    if (!model.logging_enabled) reasons.push("Logging must be enabled for Production");
    if (!model.sla_defined) reasons.push("SLA must be defined for Production");
    if (model.security_review_status !== "Approved") reasons.push("Security review must be Approved for Production");
  }

  // PII stricter
  if (model.pii_access && model.security_review_status !== "Approved") {
    reasons.push("PII access requires Approved security review");
  }

  // Some helpful warnings (not blockers)
  if (model.model_type === "LLM" && !model.explainability_available) {
    warnings.push("LLM without explainability guidance (consider evals, citations, guardrails)");
  }

  return { allowed: reasons.length === 0, reasons, warnings };
}
