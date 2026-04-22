import { useAuth } from "../App";
import type { Page } from "../App";

interface Props {
  current: Page;
  navigate: (p: Page) => void;
}

export default function Sidebar({ current, navigate }: Props) {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Corriere<br />Espresso</h1>
        <span>Gestionale v1.0</span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Navigazione</span>

        <button
          className={`nav-btn ${current === "dashboard" ? "active" : ""}`}
          onClick={() => navigate("dashboard")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Dashboard
        </button>

        <button
          className={`nav-btn ${current === "clienti" ? "active" : ""}`}
          onClick={() => navigate("clienti")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"/>
          </svg>
          Clienti
        </button>

        <button
          className={`nav-btn ${current === "consegne" ? "active" : ""}`}
          onClick={() => navigate("consegne")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
            <rect x="9" y="11" width="14" height="10" rx="2"/>
            <path d="M9 17h14M13 11v10"/>
          </svg>
          Consegne
        </button>

        {user?.admin && (
          <button
            className={`nav-btn ${current === "utenti" ? "active" : ""}`}
            onClick={() => navigate("utenti")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Utenti
          </button>
        )}

        <span className="nav-section-label" style={{ marginTop: 8 }}>Pubblico</span>

        <button
          className={`nav-btn ${current === "tracking" ? "active" : ""}`}
          onClick={() => navigate("tracking")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          Tracking
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.admin ? "A" : "O"}
          </div>
          <div className="sidebar-user-info">
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {user?.admin ? "Amministratore" : "Operatore"}
            </div>
            <div className="role">{user?.admin ? "admin" : "operatore"}</div>
          </div>
        </div>
        <button className="nav-btn" onClick={logout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Esci
        </button>
      </div>
    </aside>
  );
}