import type { Page } from "../App";

interface Props { navigate: (p: Page) => void; }

export default function Home({ navigate }: Props) {
  return (
    <div className="home-page">
      <div className="home-grid-bg" />

      <nav className="home-nav">
        <div className="home-nav-logo">
          Corriere <span>Espresso</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("tracking")}>
            Tracking consegna
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("login")}>
            Accedi
          </button>
        </div>
      </nav>

      <div className="home-hero">
        <div className="home-eyebrow">Sistema di gestione logistica</div>
        <h1>
          Ogni consegna,<br /><em>sotto controllo</em>
        </h1>
        <p>
          Gestisci clienti, consegne e operatori da un'unica piattaforma.
          Tieni traccia di ogni spedizione in tempo reale.
        </p>
        <div className="home-actions">
          <button className="btn btn-primary" onClick={() => navigate("login")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Accedi al gestionale
          </button>
          <button className="btn btn-outline" onClick={() => navigate("tracking")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
            Traccia la tua consegna
          </button>
        </div>
      </div>

      <div className="home-status-bar">
        <div className="home-status-item">
          <div className="val">REST</div>
          <div className="lbl">API Backend</div>
        </div>
        <div style={{ color: "var(--border2)" }}>|</div>
        <div className="home-status-item">
          <div className="val">JWT</div>
          <div className="lbl">Autenticazione</div>
        </div>
        <div style={{ color: "var(--border2)" }}>|</div>
        <div className="home-status-item">
          <div className="val">5</div>
          <div className="lbl">Stati consegna</div>
        </div>
        <div style={{ color: "var(--border2)" }}>|</div>
        <div className="home-status-item">
          <div className="val">SPA</div>
          <div className="lbl">Single Page App</div>
        </div>
      </div>
    </div>
  );
}