"use client";

import { useState } from "react";

export default function NewModel() {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const [form, setForm] = useState({
    name: "Fraud Detection v1",
    owner_team: "Risk Analytics",
    vendor: "Azure OpenAI",
    model_type: "LLM",
    environment: "Production",
    pii_access: true,
    logging_enabled: false,
    sla_defined: false,
    security_review_status: "Pending",
    risk_level: "High",
    explainability_available: false,
    status: "Active"
  });
  const [result, setResult] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setResult(null);
    const res = await fetch(`/api/models/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-actor": "interview-demo" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult({ ok: res.ok, data });
  }

  function update(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  return (
    <main style={{ padding: 24, fontFamily: "Arial", maxWidth: 720 }}>
      <h1>Register Model</h1>
      <a href="/">← Back</a>

      <form onSubmit={submit} style={{ display: "grid", gap: 10, marginTop: 16 }}>
        {["name","owner_team","vendor"].map(k => (
          <label key={k}>
            {k}
            <input value={form[k]} onChange={e => update(k, e.target.value)} style={{ width:"100%", padding:8 }} />
          </label>
        ))}

        <label>Model Type
          <select value={form.model_type} onChange={e => update("model_type", e.target.value)} style={{ width:"100%", padding:8 }}>
            <option>LLM</option><option>ML</option><option>RULE</option>
          </select>
        </label>

        <label>Environment
          <select value={form.environment} onChange={e => update("environment", e.target.value)} style={{ width:"100%", padding:8 }}>
            <option>Sandbox</option><option>Production</option>
          </select>
        </label>

        {[
          ["pii_access","PII Access"],
          ["logging_enabled","Logging Enabled"],
          ["sla_defined","SLA Defined"],
          ["explainability_available","Explainability Available"]
        ].map(([k,label]) => (
          <label key={k} style={{ display:"flex", gap:10, alignItems:"center" }}>
            <input type="checkbox" checked={form[k]} onChange={e => update(k, e.target.checked)} />
            {label}
          </label>
        ))}

        <label>Security Review Status
          <select value={form.security_review_status} onChange={e => update("security_review_status", e.target.value)} style={{ width:"100%", padding:8 }}>
            <option>Pending</option><option>Approved</option><option>Rejected</option>
          </select>
        </label>

        <label>Risk Level
          <select value={form.risk_level} onChange={e => update("risk_level", e.target.value)} style={{ width:"100%", padding:8 }}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </label>

        <button className="btn btn-primary" type="submit" style={{ padding: 10 }}>Register</button>
      </form>

      {result && (
        <pre style={{ marginTop: 16, background:"#f5f5f5", padding:12 }}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
