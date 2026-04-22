import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiGet, apiPost, apiPut, apiDelete, formatDate, statoBadgeClass } from "../api";
import type { Page } from "../App";

interface Props { navigate: (p: Page) => void; }

interface Consegna {
  ConsegnaID: number;
  ClienteID: number;
  Nominativo: string;
  DataRitiro: string;
  DataConsegna: string | null;
  Stato: string;
  ChiaveConsegna: string;
}

interface Cliente { ClienteID: number; Nominativo: string; }

const STATI = ["da ritirare", "in deposito", "in consegna", "consegnato", "in giacenza"];

export default function Consegne({ navigate }: Props) {
  const [list, setList] = useState<Consegna[]>([]);
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [filtroStato, setFiltroStato] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "new" | "edit">(null);
  const [editing, setEditing] = useState<Consegna | null>(null);
  const [form, setForm] = useState({ clienteId: "", dataRitiro: "", dataConsegna: "", stato: "da ritirare" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setLoading(true);
      let path = "/consegne?";
      if (filtroStato) path += `stato=${encodeURIComponent(filtroStato)}&`;
      if (filtroCliente) path += `clienteId=${filtroCliente}&`;
      const [cons, clis] = await Promise.all([apiGet(path), apiGet("/clienti")]);
      setList(cons);
      setClienti(clis);
    } catch { } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [filtroStato, filtroCliente]);

  function openNew() {
    setForm({ clienteId: "", dataRitiro: "", dataConsegna: "", stato: "da ritirare" });
    setEditing(null); setError(""); setModal("new");
  }

  function openEdit(c: Consegna) {
    setForm({
      clienteId: String(c.ClienteID),
      dataRitiro: c.DataRitiro?.split("T")[0] || "",
      dataConsegna: c.DataConsegna?.split("T")[0] || "",
      stato: c.Stato,
    });
    setEditing(c); setError(""); setModal("edit");
  }

  async function handleSave() {
    if (!form.clienteId || !form.dataRitiro) { setError("Cliente e data ritiro sono obbligatori"); return; }
    setSaving(true); setError("");
    try {
      const body = {
        clienteId: Number(form.clienteId),
        dataRitiro: form.dataRitiro,
        dataConsegna: form.dataConsegna || null,
        stato: form.stato,
      };
      if (modal === "new") await apiPost("/consegne", body);
      else await apiPut(`/consegne/${editing!.ConsegnaID}`, body);
      setModal(null);
      load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(c: Consegna) {
    if (!confirm(`Eliminare la consegna #${c.ConsegnaID}?`)) return;
    try { await apiDelete(`/consegne/${c.ConsegnaID}`); load(); }
    catch (e: any) { alert(e.message); }
  }

  return (
    <div className="layout">
      <Sidebar current="consegne" navigate={navigate} />
      <main className="main-content">
        <div className="page-header">
          <h2>Consegne</h2>
          <p>Gestisci e monitora tutte le spedizioni</p>
        </div>
        <div className="page-body">
          <div className="toolbar">
            <select
              className="form-input"
              style={{ width: "auto", minWidth: 170 }}
              value={filtroStato}
              onChange={e => setFiltroStato(e.target.value)}
            >
              <option value="">Tutti gli stati</option>
              {STATI.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              className="form-input"
              style={{ width: "auto", minWidth: 180 }}
              value={filtroCliente}
              onChange={e => setFiltroCliente(e.target.value)}
            >
              <option value="">Tutti i clienti</option>
              {clienti.map(c => <option key={c.ClienteID} value={c.ClienteID}>{c.Nominativo}</option>)}
            </select>
            {(filtroStato || filtroCliente) && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setFiltroStato(""); setFiltroCliente(""); }}>
                Rimuovi filtri
              </button>
            )}
            <div style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={openNew}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nuova consegna
            </button>
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loading ? (
              <div className="loading"><div className="spinner" /> Caricamento...</div>
            ) : list.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
                  <rect x="9" y="11" width="14" height="10" rx="2"/>
                </svg>
                <p>Nessuna consegna trovata</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Chiave</th>
                      <th>Data ritiro</th>
                      <th>Data consegna</th>
                      <th>Stato</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(c => (
                      <tr key={c.ConsegnaID}>
                        <td style={{ color: "var(--text3)", fontSize: 13, fontFamily: "monospace" }}>#{c.ConsegnaID}</td>
                        <td style={{ fontWeight: 600 }}>{c.Nominativo}</td>
                        <td>
                          <span style={{ fontFamily: "monospace", fontSize: 13, color: "var(--accent)", background: "var(--accent-dim)", padding: "2px 8px", borderRadius: 4 }}>
                            {c.ChiaveConsegna}
                          </span>
                        </td>
                        <td style={{ fontSize: 13 }}>{formatDate(c.DataRitiro)}</td>
                        <td style={{ fontSize: 13, color: "var(--text2)" }}>{formatDate(c.DataConsegna)}</td>
                        <td><span className={`badge ${statoBadgeClass(c.Stato)}`}>{c.Stato}</span></td>
                        <td>
                          <div className="table-actions">
                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                              Modifica
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              </svg>
                              Elimina
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{modal === "new" ? "Nuova consegna" : "Modifica consegna"}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label className="form-label">Cliente *</label>
              <select className="form-input" value={form.clienteId} onChange={e => setForm(f => ({ ...f, clienteId: e.target.value }))}>
                <option value="">Seleziona cliente</option>
                {clienti.map(c => <option key={c.ClienteID} value={c.ClienteID}>{c.Nominativo}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Data Ritiro *</label>
                <input type="date" className="form-input" value={form.dataRitiro} onChange={e => setForm(f => ({ ...f, dataRitiro: e.target.value }))} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Data Consegna</label>
                <input type="date" className="form-input" value={form.dataConsegna} onChange={e => setForm(f => ({ ...f, dataConsegna: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Stato *</label>
              <select className="form-input" value={form.stato} onChange={e => setForm(f => ({ ...f, stato: e.target.value }))}>
                {STATI.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Annulla</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Salvataggio..." : "Salva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}