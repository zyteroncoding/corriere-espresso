import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";
import type { Page } from "../App";

interface Props { navigate: (p: Page) => void; }
interface Utente { UtenteID: number; Email: string; Admin: boolean | number; }

export default function Utenti({ navigate }: Props) {
  const [list, setList] = useState<Utente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "new" | "edit">(null);
  const [editing, setEditing] = useState<Utente | null>(null);
  const [form, setForm] = useState({ email: "", password: "", admin: false });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    try { setLoading(true); setList(await apiGet("/utenti")); }
    catch { } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm({ email: "", password: "", admin: false }); setEditing(null); setError(""); setModal("new");
  }

  function openEdit(u: Utente) {
    setForm({ email: u.Email, password: "", admin: u.Admin === true || u.Admin === 1 });
    setEditing(u); setError(""); setModal("edit");
  }

  async function handleSave() {
    if (!form.email) { setError("Email obbligatoria"); return; }
    if (modal === "new" && !form.password) { setError("Password obbligatoria"); return; }
    setSaving(true); setError("");
    try {
      const body: any = { email: form.email, admin: form.admin };
      if (form.password) body.password = form.password;
      if (modal === "new") await apiPost("/utenti", body);
      else await apiPut(`/utenti/${editing!.UtenteID}`, body);
      setModal(null); load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(u: Utente) {
    if (!confirm(`Eliminare l'utente "${u.Email}"?`)) return;
    try { await apiDelete(`/utenti/${u.UtenteID}`); load(); }
    catch (e: any) { alert(e.message); }
  }

  return (
    <div className="layout">
      <Sidebar current="utenti" navigate={navigate} />
      <main className="main-content">
        <div className="page-header">
          <h2>Utenti</h2>
          <p>Gestione accessi — solo amministratori</p>
        </div>
        <div className="page-body">
          <div className="toolbar">
            <div style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={openNew}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nuovo utente
            </button>
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loading ? (
              <div className="loading"><div className="spinner" /> Caricamento...</div>
            ) : list.length === 0 ? (
              <div className="empty-state"><p>Nessun utente</p></div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Ruolo</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(u => (
                      <tr key={u.UtenteID}>
                        <td style={{ color: "var(--text3)", fontSize: 13, fontFamily: "monospace" }}>#{u.UtenteID}</td>
                        <td style={{ fontWeight: 600 }}>{u.Email}</td>
                        <td>
                          {(u.Admin === true || u.Admin === 1)
                            ? <span className="badge badge-orange">Amministratore</span>
                            : <span className="badge badge-gray">Operatore</span>}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                              Modifica
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u)}>
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
              <h3>{modal === "new" ? "Nuovo utente" : "Modifica utente"}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="operatore@corriere.it" />
            </div>
            <div className="form-group">
              <label className="form-label">Password {modal === "edit" ? "(lascia vuoto per non cambiarla)" : "*"}</label>
              <input type="password" className="form-input" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.admin}
                  onChange={e => setForm(f => ({ ...f, admin: e.target.checked }))}
                  style={{ width: 16, height: 16, accentColor: "var(--accent)", cursor: "pointer" }}
                />
                <span style={{ fontSize: 14, fontWeight: 500 }}>Amministratore</span>
              </label>
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