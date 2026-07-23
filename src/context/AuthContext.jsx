import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

const normalizeUser = (payload) => {
  if (!payload) return null;
  if (payload.user) return normalizeUser(payload.user);
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    return normalizeUser(payload.data);
  }

  const user = { ...payload };
  const fullName = [user.firstname, user.lastname].filter(Boolean).join(" ").trim();
  user.name = user.name || fullName || user.email || "User";
  user.role = user.role || (user.isAdmin ? "admin" : "member");
  return user;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("uc_token");
    if (!token) {
      setUser(null);
      setChecking(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(normalizeUser(data));
    } catch {
      localStorage.removeItem("uc_token");
      setUser(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("uc_token", data.token);
    const nextUser = normalizeUser(data.user || data.data || data);
    setUser(nextUser);
    return nextUser;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("uc_token", data.token);
    const nextUser = normalizeUser(data.user || data.data || data);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem("uc_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, checking, login, register, logout, refresh, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
