import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_TOKEN = "access_token";
const STORAGE_USER = "auth_user";
const STORAGE_ONLINE = "online";
const STORAGE_ROLE = "userRole";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const isAuthenticated = !!token;

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData ?? null);
    sessionStorage.setItem(STORAGE_TOKEN, newToken);
    sessionStorage.setItem(STORAGE_ONLINE, "true");
    if (userData) {
      sessionStorage.setItem(STORAGE_USER, JSON.stringify(userData));
      sessionStorage.setItem(STORAGE_ROLE, userData.role ?? "user");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem(STORAGE_TOKEN);
    sessionStorage.removeItem(STORAGE_USER);
    sessionStorage.removeItem(STORAGE_ONLINE);
    sessionStorage.removeItem(STORAGE_ROLE);
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem(STORAGE_TOKEN);
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
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
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
