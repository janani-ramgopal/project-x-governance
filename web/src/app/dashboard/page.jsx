function countBy(arr, keyFn) {
    return arr.reduce((acc, x) => {
      const k = keyFn(x);
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
  }
  
  function pct(n, d) {
    if (!d) return "0%";
    return `${Math.round((n / d) * 100)}%`;
  }
  
  export default async function Dashboard() {
    const base = process.env.NEXT_PUBLIC_API_BASE;
    const res = await fetch(`${base}/models`, { cache: "no-store" });
    const models = await res.json();
  
    const total = models.length;
    const prod = models.filter(m => m.environment === "Production").length;
    const pii = models.filter(m => m.pii_access).length;
    const highRisk = models.filter(m => m.risk_level === "High").length;
    const pendingSec = models.filter(m => m.security_review_status === "Pending").length;
  
    const tierCounts = countBy(models, m => `Tier ${m.tier}`);
    const tiers = ["Tier 0", "Tier 1", "Tier 2", "Tier 3", "Tier 4"].map(t => ({
      tier: t,
      count: tierCounts[t] || 0
    }));
    const maxTierCount = Math.max(...tiers.map(t => t.count), 1);
  
    // “Likely to be denied in Production” flags (simple heuristics)
    const flagged = models.filter(m =>
      m.environment === "Production" &&
      (m.security_review_status !== "Approved" || !m.logging_enabled || !m.sla_defined || (m.pii_access && m.security_review_status !== "Approved"))
    );
  
    return (
      <main className="container">
        <div className="header">
          <div>
            <h1 className="h1">Governance Dashboard</h1>
            <div className="sub">Portfolio view of AI models registered under the Governance Layer.</div>
          </div>
          <div className="toolbar">
            <a className="btn" href="/">Home</a>
            <a className="btn btn-primary" href="/models/new">Register model</a>
            <a className="btn" href="/validate">Validate for Project X</a>
          </div>
        </div>
  
        {/* KPI Cards */}
        <section className="grid">
          <div className="card card-pad">
            <div className="badge" style={{ marginBottom: 10 }}>KPIs</div>
            <div className="kv"><div className="k">Total models</div><div className="v">{total}</div></div>
            <div className="kv"><div className="k">Production-declared</div><div className="v">{prod} <span style={{ color: "var(--muted)", fontWeight: 700 }}>({pct(prod, total)})</span></div></div>
            <div className="kv"><div className="k">PII models</div><div className="v">{pii} <span style={{ color: "var(--muted)", fontWeight: 700 }}>({pct(pii, total)})</span></div></div>
            <div className="kv"><div className="k">High risk</div><div className="v">{highRisk}</div></div>
            <div className="kv"><div className="k">Pending security review</div><div className="v">{pendingSec}</div></div>
          </div>
  
          {/* Tier distribution */}
          <div className="card card-pad">
            <div className="badge" style={{ marginBottom: 10 }}>Tier Distribution</div>
            <div style={{ display: "grid", gap: 10 }}>
              {tiers.map(t => (
                <div key={t.tier} style={{ display: "grid", gridTemplateColumns: "80px 1fr 50px", gap: 10, alignItems: "center" }}>
                  <div style={{ color: "var(--muted)", fontWeight: 800, fontSize: 12 }}>{t.tier}</div>
                  <div style={{ height: 10, borderRadius: 999, background: "rgba(100,116,139,.15)", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${(t.count / maxTierCount) * 100}%`,
                        height: "100%",
                        background: "rgba(37,99,235,.75)",
                        borderRadius: 999
                      }}
                    />
                  </div>
                  <div style={{ fontWeight: 900 }}>{t.count}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, color: "var(--muted)", fontSize: 13 }}>
              Goal: increase Tier 3+ coverage for production use cases.
            </div>
          </div>
        </section>
  
        {/* Flagged list */}
        <section className="card card-pad" style={{ marginTop: 14 }}>
          <div className="badge" style={{ marginBottom: 10 }}>Models likely to fail Production validation</div>
          {flagged.length === 0 ? (
            <div style={{ color: "var(--muted)" }}>No flagged models 🎉</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th><th>Owner</th><th>Tier</th><th>PII</th><th>Security</th><th>Logging</th><th>SLA</th>
                </tr>
              </thead>
              <tbody>
                {flagged.slice(0, 10).map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 800 }}>{m.name}</td>
                    <td>{m.owner_team}</td>
                    <td><span className="badge">Tier {m.tier}</span></td>
                    <td>{m.pii_access ? "Yes" : "No"}</td>
                    <td>{m.security_review_status}</td>
                    <td>{m.logging_enabled ? "✅" : "❌"}</td>
                    <td>{m.sla_defined ? "✅" : "❌"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {flagged.length > 10 && (
            <div style={{ marginTop: 10, color: "var(--muted)" }}>
              Showing first 10 of {flagged.length}.
            </div>
          )}
        </section>
      </main>
    );
  }
  