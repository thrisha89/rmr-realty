import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, setAccessToken } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const tryRestoreSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("no session");
      const data = await res.json();
      setAccessToken(data.accessToken);
      const me = await api.me();
      setUser(me.user);
    } catch {
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    tryRestoreSession();
  }, [tryRestoreSession]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    // Registration no longer returns a session — the account is created as
    // Pending and must be approved by an admin before the user can log in.
    const data = await api.register(payload);
    return data;
  };

  const logout = async () => {
    await api.logout();
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
