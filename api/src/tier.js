export function calculateTier(m) {
    // Score out of 100
    let score = 0;
  
    if (m.logging_enabled) score += 20;
    if (m.sla_defined) score += 20;
    if (m.security_review_status === "Approved") score += 25;
    if (m.explainability_available) score += 15;
  
    // Risk adjustments
    if (m.risk_level === "Low") score += 10;
    if (m.risk_level === "High") score -= 10;
  
    // PII is stricter: require stronger controls, otherwise penalize
    if (m.pii_access && (!m.logging_enabled || m.security_review_status !== "Approved")) {
      score -= 25;
    }
  
    // Tier mapping
    if (score < 30) return 0;       // Experimental
    if (score < 50) return 1;       // POC
    if (score < 70) return 2;       // Controlled
    if (score < 85) return 3;       // Production Ready
    return 4;                       // Enterprise Critical
  }
  
  export function tierName(tier) {
    return ["Experimental", "POC", "Controlled", "Production Ready", "Enterprise Critical"][tier] ?? "Unknown";
  }
  