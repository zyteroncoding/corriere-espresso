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
  {/* React */}
  <div className="home-status-item">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="2.5" fill="#61DAFB"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)"/>
    </svg>
    <div className="lbl">React</div>
  </div>

  <div style={{ color: "var(--border2)" }}>|</div>

  {/* Express */}
  <div className="home-status-item">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7.5C3 7.5 4.5 7 6 7C9 7 9 9 12 9C15 9 15 7 18 7C19.5 7 21 7.5 21 7.5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M3 12C3 12 4.5 11.5 6 11.5C9 11.5 9 13.5 12 13.5C15 13.5 15 11.5 18 11.5C19.5 11.5 21 12 21 12" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M3 16.5C3 16.5 4.5 16 6 16C9 16 9 18 12 18C15 18 15 16 18 16C19.5 16 21 16.5 21 16.5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
    <div className="lbl">Express</div>
  </div>

  <div style={{ color: "var(--border2)" }}>|</div>

  {/* TypeScript */}
  <div className="home-status-item">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#3178C6"/>
      <path d="M13.5 11H15.5V17H17V11H19V9.5H13.5V11Z" fill="white"/>
      <path d="M12 13C12 13 11 12.5 9.5 12.5C8 12.5 7.5 13.2 7.5 14C7.5 15.5 10.5 15.5 10.5 16.8C10.5 17.6 9.5 18 8.5 17.8C7.5 17.6 7 17 7 17V18.5C7 18.5 7.8 19 9 19C10.5 19 12.5 18.5 12.5 16.5C12.5 14.5 9.5 14.5 9.5 13.5C9.5 13 10 12.8 10.5 12.8C11.2 12.8 12 13.2 12 13.2V13Z" fill="white"/>
    </svg>
    <div className="lbl">TypeScript</div>
  </div>

  <div style={{ color: "var(--border2)" }}>|</div>

  {/* MySQL */}
  <div className="home-status-item">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="6" rx="8" ry="3" fill="#00758F"/>
      <path d="M4 6v4c0 1.66 3.58 3 8 3s8-1.34 8-3V6" fill="#00758F" opacity="0.85"/>
      <path d="M4 10v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" fill="#00758F" opacity="0.7"/>
      <path d="M4 14v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" fill="#00758F" opacity="0.55"/>
    </svg>
    <div className="lbl">MySQL</div>
  </div>
</div>
    </div>
  );
}