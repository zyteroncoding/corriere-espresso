import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";
import type { Page } from "../App";

interface Props { navigate: (p: Page) => void; }

interface Cliente {
  ClienteID: number;
  Nominativo: string;
  Via: string;
  Comune: string;
  Provincia: string;
  Telefono: string;
  Email: string;
  Note: string;
}

const empty = (): Omit<Cliente, "ClienteID"> => ({
  Nominativo: "", Via: "", Comune: "", Provincia: "", Telefono: "", Email: "", Note: "",
});

export default function Clienti({ navigate }: Props) {
  const [list, setList] = useState<Cliente[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "new" | "edit">(null);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form, setForm] = useState(empty());
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const data = await apiGet("/clienti");
      setList(data);
    } catch { } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm(empty()); setEditing(null); setError(""); setModal("new");
  }

  function openEdit(c: Cliente) {
    setForm({ Nominativo: c.Nominativo, Via: c.Via, Comune: c.Comune, Provincia: c.Provincia, Telefono: c.Telefono, Email: c.Email, Note: c.Note });
    setEditing(c); setError(""); setModal("edit");
  }

  async function handleSave() {
    if (!form.Nominativo || !form.Via) { setError("Nominativo e Via sono obbligatori"); return; }
    setSaving(true); setError("");
    try {
      const body = {
        nominativo: form.Nominativo, via: form.Via, comune: form.Comune,
        provincia: form.Provincia, telefono: form.Telefono, email: form.Email, note: form.Note,
      };
      if (modal === "new") await apiPost("/clienti", body);
      else await apiPut(`/clienti/${editing!.ClienteID}`, body);
      setModal(null);
      load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(c: Cliente) {
    if (!confirm(`Eliminare il cliente "${c.Nominativo}"?`)) return;
    try {
      await apiDelete(`/clienti/${c.ClienteID}`);
      load();
    } catch (e: any) { alert(e.message); }
  }

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  const filtered = list.filter(c =>
    c.Nominativo.toLowerCase().includes(search.toLowerCase()) ||
    c.Comune?.toLowerCase().includes(search.toLowerCase()) ||
    c.Email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="layout">
      <Sidebar current="clienti" navigate={navigate} />
      <main className="main-content">
        <div className="page-header">
          <h2>Clienti</h2>
          <p>Gestisci l'anagrafica clienti</p>
        </div>
        <div className="page-body">
          <div className="toolbar">
            <div className="toolbar-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="form-input"
                placeholder="Cerca per nome, comune, email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={openNew}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nuovo cliente
            </button>
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loading ? (
              <div className="loading"><div className="spinner" /> Caricamento...</div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
                <p>{search ? "Nessun cliente trovato" : "Nessun cliente ancora"}</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nominativo</th>
                      <th>Indirizzo</th>
                      <th>Telefono</th>
                      <th>Email</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c => (
                      <tr key={c.ClienteID}>
                        <td style={{ color: "var(--text3)", fontSize: 13, fontFamily: "monospace" }}>#{c.ClienteID}</td>
                        <td style={{ fontWeight: 600 }}>{c.Nominativo}</td>
                        <td style={{ color: "var(--text2)", fontSize: 13 }}>
                          {c.Via}{c.Comune ? `, ${c.Comune}` : ""}{c.Provincia ? ` (${c.Provincia})` : ""}
                        </td>
                        <td style={{ color: "var(--text2)", fontSize: 13 }}>{c.Telefono || "—"}</td>
                        <td style={{ color: "var(--text2)", fontSize: 13 }}>{c.Email || "—"}</td>
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
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6"/><path d="M14 11v6"/>
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
              <h3>{modal === "new" ? "Nuovo cliente" : "Modifica cliente"}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label className="form-label">Nominativo *</label>
              <input className="form-input" value={form.Nominativo} onChange={set("Nominativo")} placeholder="Mario Rossi" />
            </div>
            <div className="form-group">
              <label className="form-label">Via *</label>
              <input className="form-input" value={form.Via} onChange={set("Via")} placeholder="Via Roma 1" />
            </div>
            <div className="form-row">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Comune</label>
                <input className="form-input" value={form.Comune} onChange={set("Comune")} placeholder="Verona" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Provincia</label>
                <input className="form-input" value={form.Provincia} onChange={set("Provincia")} placeholder="VR" maxLength={2} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Telefono</label>
                <input className="form-input" value={form.Telefono} onChange={set("Telefono")} placeholder="045..." />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.Email} onChange={set("Email")} placeholder="mario@email.it" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Note</label>
              <textarea className="form-input" value={form.Note} onChange={set("Note") as any} rows={2} placeholder="Note aggiuntive..." style={{ resize: "vertical" }} />
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