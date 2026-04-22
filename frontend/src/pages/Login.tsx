import { useState } from "react";
import { login } from "../api";
import { useAuth } from "../App";
import type { Page } from "../App";

interface Props { navigate: (p: Page) => void; }

export default function Login({ navigate }: Props) {
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) { setError("Inserisci email e password"); return; }
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      authLogin(data.token, data.admin === true || data.admin === 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-card">
          <div className="login-logo">
            <h2>Corriere Espresso</h2>
            <p>Accedi al gestionale</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="blablabla@corriere.it"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Accesso...</> : "Accedi"}
          </button>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("tracking")}>
              Traccia una consegna →
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("home")}>
            ← Torna alla home
          </button>
        </div>
      </div>
    </div>
  );
}