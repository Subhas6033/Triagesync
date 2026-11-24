import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../../context/authState";
import { loginUser, registerUser } from "../auth.api";
import { SESSION_KEYS } from "../../../utils/constants";
import { unwrapData } from "../../../utils/formatters";

function readSession() {
  try {
    return {
      token: localStorage.getItem(SESSION_KEYS.token),
      user: JSON.parse(localStorage.getItem(SESSION_KEYS.user)),
    };
  } catch {
    return { token: null, user: null };
  }
}
export function useAuthSession() {
  const [session, setSession] = useState(readSession);
  const client = useQueryClient();
  useEffect(() => {
    function syncSession(event) {
      if (event.key && !Object.values(SESSION_KEYS).includes(event.key)) return;
      client.clear();
      setSession(readSession());
    }
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, [client]);
  async function login(credentials) {
    const result = unwrapData(await loginUser(credentials));
    const token = result?.token ?? result?.accessToken;
    if (!token || !result.user)
      throw new Error("Login response did not contain a token and user.");
    localStorage.setItem(SESSION_KEYS.token, token);
    localStorage.setItem(SESSION_KEYS.user, JSON.stringify(result.user));
    client.clear();
    setSession({ token, user: result.user });
    return result.user;
  }
  function logout() {
    localStorage.removeItem(SESSION_KEYS.token);
    localStorage.removeItem(SESSION_KEYS.user);
    client.clear();
    setSession({ token: null, user: null });
  }
  return {
    ...session,
    isAuthenticated: Boolean(session.token && session.user),
    isAdmin: session.user?.role === "ADMIN",
    login,
    logout,
    register: registerUser,
  };
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
