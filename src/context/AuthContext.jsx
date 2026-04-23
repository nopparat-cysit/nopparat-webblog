import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const STORAGE_TOKEN = "access_token";
const STORAGE_REFRESH = "sb_refresh_token";
const STORAGE_USER = "auth_user";
const STORAGE_ONLINE = "online";
const STORAGE_ROLE = "userRole";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const isAuthenticated = !!token;

  const login = (newToken, userData, refreshToken) => {
    setToken(newToken);
    setUser(userData ?? null);
    sessionStorage.setItem(STORAGE_TOKEN, newToken);
    sessionStorage.setItem(STORAGE_ONLINE, "true");
    if (refreshToken) sessionStorage.setItem(STORAGE_REFRESH, refreshToken);
    if (userData) {
      sessionStorage.setItem(STORAGE_USER, JSON.stringify(userData));
      sessionStorage.setItem(STORAGE_ROLE, userData.role ?? "user");
    }
  };

  const logout = async () => {
    try {
      if (supabase) await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    setToken(null);
    setUser(null);
    sessionStorage.removeItem(STORAGE_TOKEN);
    sessionStorage.removeItem(STORAGE_REFRESH);
    sessionStorage.removeItem(STORAGE_USER);
    sessionStorage.removeItem(STORAGE_ONLINE);
    sessionStorage.removeItem(STORAGE_ROLE);
  };

  const updateUser = (partial) => {
    setUser((prev) => {
      const base = prev && typeof prev === "object" ? prev : {};
      const next = { ...base, ...partial };
      sessionStorage.setItem(STORAGE_USER, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const restore = async () => {
      const storedToken = sessionStorage.getItem(STORAGE_TOKEN);
      const storedRefresh = sessionStorage.getItem(STORAGE_REFRESH);
      const storedUser = sessionStorage.getItem(STORAGE_USER);
      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            setUser(null);
          }
        }
        if (supabase && storedRefresh) {
          await supabase.auth.setSession({
            access_token: storedToken,
            refresh_token: storedRefresh,
          });
        }
      }
    };
    restore();
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
