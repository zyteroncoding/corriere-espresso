import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiGet, formatDate, statoBadgeClass } from "../api";
import type { Page } from "../App";

interface Props { navigate: (p: Page) => void; }

export default function Dashboard({ navigate }: Props) {
  const [stats, setStats] = useState({ clienti: 0, consegne: 0, inConsegna: 0, consegnate: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [clienti, consegne] = await Promise.all([
          apiGet("/clienti"),
          apiGet("/consegne"),
        ]);
        setStats({
          clienti: clienti.length,
          consegne: consegne.length,
          inConsegna: consegne.filter((c: any) => c.Stato === "in consegna").length,
          consegnate: consegne.filter((c: any) => c.Stato === "consegnato").length,
        });
        setRecent(consegne.slice(0, 6));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="layout">
      <Sidebar current="dashboard" navigate={navigate} />
      <main className="main-content">
        <div className="page-header">
          <h2>Dashboard</h2>
          <p>Panoramica del sistema</p>
        </div>
        <div className="page-body">
          {loading ? (
            <div className="loading"><div className="spinner" /> Caricamento...</div>
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card orange">
                  <div className="stat-value">{stats.clienti}</div>
                  <div className="stat-label">Clienti totali</div>
                </div>
                <div className="stat-card blue">
                  <div className="stat-value">{stats.consegne}</div>
                  <div className="stat-label">Consegne totali</div>
                </div>
                <div className="stat-card yellow">
                  <div className="stat-value">{stats.inConsegna}</div>
                  <div className="stat-label">In consegna</div>
                </div>
                <div className="stat-card green">
                  <div className="stat-value">{stats.consegnate}</div>
                  <div className="stat-label">Consegnate</div>
                </div>
              </div>

              <div className="card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Ultime consegne</h3>
                  <button className="btn btn-outline btn-sm" onClick={() => navigate("consegne")}>
                    Vedi tutte →
                  </button>
                </div>
                {recent.length === 0 ? (
                  <div className="empty-state"><p>Nessuna consegna ancora</p></div>
                ) : (
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Cliente</th>
                          <th>Chiave</th>
                          <th>Data Ritiro</th>
                          <th>Stato</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map((c: any) => (
                          <tr key={c.ConsegnaID}>
                            <td style={{ fontFamily: "var(--font-mono)", color: "var(--text3)", fontSize: 13 }}>
                              #{c.ConsegnaID}
                            </td>
                            <td>{c.Nominativo}</td>
                            <td>
                              <span style={{ fontFamily: "monospace", fontSize: 13, color: "var(--accent)" }}>
                                {c.ChiaveConsegna}
                              </span>
                            </td>
                            <td>{formatDate(c.DataRitiro)}</td>
                            <td>
                              <span className={`badge ${statoBadgeClass(c.Stato)}`}>
                                {c.Stato}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}