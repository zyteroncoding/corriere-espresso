import { useState } from "react";
import { apiPublicGet, formatDate, statoBadgeClass } from "../api";
import type { Page } from "../App";

interface Props { navigate: (p: Page) => void; }

const STATI_ORDINE = ["da ritirare", "in deposito", "in consegna", "consegnato"];

export default function Tracking({ navigate }: Props) {
  const [chiave, setChiave] = useState("");
  const [data, setData] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!chiave || !data) { setError("Inserisci chiave e data di ritiro"); return; }
    setError(""); setResult(null); setLoading(true);
    try {
      const res = await apiPublicGet(`/tracking?chiaveConsegna=${encodeURIComponent(chiave.toUpperCase())}&dataRitiro=${data}`);
      setResult(res);
    } catch (e: any) {
      setError("Consegna non trovata. Controlla i dati inseriti.");
    } finally { setLoading(false); }
  }

  function getStepStatus(step: string) {
    if (!result) return "";
    const idx = STATI_ORDINE.indexOf(result.Stato);
    const stepIdx = STATI_ORDINE.indexOf(step);
    if (result.Stato === "in giacenza") return step === "in deposito" ? "done" : "";
    if (stepIdx < idx) return "done";
    if (stepIdx === idx) return "active";
    return "";
  }

  const stepLabels: Record<string, string> = {
    "da ritirare": "Da ritirare",
    "in deposito": "In deposito",
    "in consegna": "In consegna",
    "consegnato": "Consegnato",
  };

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("home")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Home
        </button>
        <h1>Tracking Consegna</h1>
      </div>

      <div className="tracking-body">
        <div className="tracking-card">
          <h2>Dove è il mio pacco?</h2>
          <p>Inserisci la chiave di consegna e la data di ritiro per verificare lo stato della spedizione.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Chiave consegna</label>
            <input
              className="form-input"
              value={chiave}
              onChange={e => setChiave(e.target.value.toUpperCase())}
              placeholder="es. A1B2C3D4"
              maxLength={8}
              style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: "0.1em", textTransform: "uppercase" }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data di ritiro</label>
            <input
              type="date"
              className="form-input"
              value={data}
              onChange={e => setData(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Ricerca...</> : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Traccia consegna
              </>
            )}
          </button>

          {result && (
            <div className="tracking-result">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "var(--text3)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                  Stato attuale
                </div>
                <span className={`badge ${statoBadgeClass(result.Stato)}`} style={{ fontSize: 13, padding: "5px 14px" }}>
                  {result.Stato}
                </span>
                {result.Stato === "in giacenza" && (
                  <div style={{ marginTop: 8, fontSize: 13, color: "var(--yellow)" }}>
                    ⚠️ Il pacco è in giacenza. Contatta il corriere per accordarsi sulla riconsegna.
                  </div>
                )}
              </div>

              {result.Stato !== "in giacenza" && (
                <div className="tracking-steps" style={{ marginBottom: 16 }}>
                  {STATI_ORDINE.map(s => (
                    <div key={s} className={`tracking-step ${getStepStatus(s)}`}>
                      <div className="tracking-step-dot">
                        {getStepStatus(s) === "done" ? "✓" : ""}
                      </div>
                      <div className="tracking-step-label">{stepLabels[s]}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="tracking-result-row">
                <span>Data ritiro</span>
                <span>{formatDate(result.DataRitiro)}</span>
              </div>
              <div className="tracking-result-row">
                <span>Data consegna</span>
                <span>{formatDate(result.DataConsegna)}</span>
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("login")}>
              Sei un operatore? Accedi →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}