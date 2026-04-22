const BASE = "https://corriere-espresso-production.up.railway.app";

function getToken() {
  return sessionStorage.getItem("token") || "";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function apiGet(path: string) {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error((await res.json()).errore || "Errore");
  return res.json();
}

export async function apiPost(path: string, body: object) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).errore || "Errore");
  return res.json();
}

export async function apiPut(path: string, body: object) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).errore || "Errore");
  return res.json();
}

export async function apiDelete(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error((await res.json()).errore || "Errore");
  return res.json();
}

export async function apiPublicGet(path: string) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error((await res.json()).errore || "Errore");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).errore || "Credenziali non valide");
  return res.json();
}

export function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("it-IT", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

export function statoBadgeClass(stato: string) {
  switch (stato) {
    case "consegnato": return "badge-green";
    case "in consegna": return "badge-blue";
    case "in deposito": return "badge-yellow";
    case "da ritirare": return "badge-orange";
    case "in giacenza": return "badge-red";
    default: return "badge-gray";
  }
}