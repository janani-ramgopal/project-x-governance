export default async function Page() {
    const base = process.env.NEXT_PUBLIC_API_BASE;
    const res = await fetch(`${base}/models`, { cache: "no-store" });
    const models = await res.json();
  
    return (
      <main style={{ padding: 24, fontFamily: "Arial" }}>
        <h1>AI Governance MVP</h1>
        <p>Model Registry + Tiering + Validation</p>
  
        
  
        <table style={{ width: "80%" }} className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Vendor</th>
              <th>Type</th>
              <th>Env</th>
              <th>PII</th>
              <th>Risk</th>
              <th>Tier</th>
              <th>Security</th>
            </tr>
          </thead>
          <tbody>
            {models.map(m => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.owner_team}</td>
                <td>{m.vendor}</td>
                <td>{m.model_type}</td>
                <td>{m.environment}</td>
                <td>{m.pii_access ? "Yes" : "No"}</td>
                <td>{m.risk_level}</td>
                <td>{m.tier}</td>
                <td>{m.security_review_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", gap: 12, marginBottom: 16,marginTop:25 }}>
          <a className="btn btn-primary" href="/models/new">Register New Model</a>
          <a className="btn btn-primary" href="/validate">Validate for Project X</a>
        </div>
      </main>
    );
  }
  