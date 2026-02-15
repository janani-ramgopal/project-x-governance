"use client";

import { useEffect, useState } from "react";

export default function Validate() {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const [models, setModels] = useState([]);
  const [modelId, setModelId] = useState("");
  const [decision, setDecision] = useState(null);

  useEffect(() => {
    fetch(`${base}/models`, { cache: "no-store" })
      .then(r => r.json())
      .then(ms => {
        setModels(ms);
        if (ms[0]?.id) setModelId(ms[0].id);
      });
  }, [base]);

  async function run() {
    setDecision(null);
    const res = await fetch(`${base}/governance/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-actor": "project-x" },
      body: JSON.stringify({ model_id: modelId, required_tier: 3, target_env: "Production" }),
    });
    const data = await res.json();
    setDecision(data);
  }

  return (
    <main style={{ padding: 24, fontFamily: "Arial", maxWidth: 900 }}>
      <h1>Validate for Project X</h1>
      <a href="/">← Back</a>

      <div style={{ display:"flex", gap:12, alignItems:"center", marginTop: 16 }}>
        <select value={modelId} onChange={e => setModelId(e.target.value)} style={{ padding: 8, minWidth: 420 }}>
          {models.map(m => (
            <option key={m.id} value={m.id}>
              {m.name} (Tier {m.tier}, {m.security_review_status})
            </option>
          ))}
        </select>
        <button onClick={run} style={{ padding: 10 }} className="btn btn-primary">Validate</button>
      </div>

      {decision && (
        <div style={{ marginTop: 16 }}>
          <h3>Decision: {decision.allowed ? "✅ ALLOW" : "❌ DENY"}</h3>
          {decision.reasons?.length > 0 && (
            <>
              <b>Reasons</b>
              <ul>{decision.reasons.map((r,i) => <li key={i}>{r}</li>)}</ul>
            </>
          )}
          {decision.warnings?.length > 0 && (
            <>
              <b>Warnings</b>
              <ul>{decision.warnings.map((w,i) => <li key={i}>{w}</li>)}</ul>
            </>
          )}
          <pre style={{ background:"#f5f5f5", padding:12 }}>
{JSON.stringify(decision, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
