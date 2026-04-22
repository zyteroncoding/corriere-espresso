import { useState, useEffect, createContext, useContext } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clienti from "./pages/Clienti";
import Consegne from "./pages/Consegne";
import Utenti from "./pages/Utenti";
import Tracking from "./pages/Tracking";
 
export type Page = "home" | "login" | "dashboard" | "clienti" | "consegne" | "utenti" | "tracking";
 
interface AuthUser {
  token: string;
  admin: boolean;
}
 
interface AuthContextType {
  user: AuthUser | null;
  login: (token: string, admin: boolean) => void;
  logout: () => void;
}
 
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});
 
export const useAuth = () => useContext(AuthContext);
 
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [user, setUser] = useState<AuthUser | null>(null);
 
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const admin = sessionStorage.getItem("admin");
    if (token) setUser({ token, admin: admin === "true" });
  }, []);
 
  const login = (token: string, admin: boolean) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("admin", String(admin));
    setUser({ token, admin });
    setPage("dashboard");
  };
 
  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setPage("home");
  };
 
  const navigate = (p: Page) => setPage(p);
 
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {page === "home" && <Home navigate={navigate} />}
      {page === "login" && <Login navigate={navigate} />}
      {page === "tracking" && <Tracking navigate={navigate} />}
      {page === "dashboard" && user && <Dashboard navigate={navigate} />}
      {page === "clienti" && user && <Clienti navigate={navigate} />}
      {page === "consegne" && user && <Consegne navigate={navigate} />}
      {page === "utenti" && user && user.admin && <Utenti navigate={navigate} />}
      {/* Redirect to home if not authenticated */}
      {(page === "dashboard" || page === "clienti" || page === "consegne" || page === "utenti") && !user && <Home navigate={navigate} />}
    </AuthContext.Provider>
  );
}