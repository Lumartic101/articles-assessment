import { createContext, useContext, useMemo, useState } from "react";
import { loginRequest } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  });

  async function login({ email, password }) {
    const res = await loginRequest({ email, password });
    const t = res.token || res.access_token || res.bearer;
    if (!t) throw new Error("Geen token ontvangen van API.");
    setToken(t);
    localStorage.setItem("auth_token", t);

    if (res.user) {
      setUser(res.user);
      localStorage.setItem("auth_user", JSON.stringify(res.user));
    }
    return true;
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }

  const value = useMemo(
    () => ({ token, user, isAuthed: !!token, login, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
