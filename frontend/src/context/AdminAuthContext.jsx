import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, setAdminAccessToken } from "../lib/api.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const tryRestoreSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/admin/refresh", { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("no session");
      const data = await res.json();
      setAdminAccessToken(data.accessToken);
      // We don't have a /admin/me endpoint; dashboard call doubles as a session check.
      await api.adminDashboard();
      setAdmin({ authenticated: true });
    } catch {
      setAdminAccessToken(null);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    tryRestoreSession();
  }, [tryRestoreSession]);

  const login = async (username, password) => {
    const data = await api.adminLogin({ username, password });
    setAdminAccessToken(data.accessToken);
    setAdmin(data.admin);
    return data.admin;
  };

  const logout = async () => {
    await api.adminLogout();
    setAdminAccessToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
