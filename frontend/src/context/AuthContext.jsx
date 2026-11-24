import { createContext, useContext, useState } from "react";

import { loginUser, registerUser } from "../features/auth/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("triagesync_token"),
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("triagesync_user"));
    } catch {
      return null;
    }
  });

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    // Supports common { data: { token, user } } API responses.
    const result = response.data ?? response;
    const accessToken = result.token ?? result.accessToken;
    const loggedInUser = result.user;

    if (!accessToken || !loggedInUser) {
      throw new Error("Login response did not contain a token and user.");
    }

    localStorage.setItem("triagesync_token", accessToken);
    localStorage.setItem("triagesync_user", JSON.stringify(loggedInUser));

    setToken(accessToken);
    setUser(loggedInUser);

    return loggedInUser;
  };

  const register = async (userData) => {
    return registerUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("triagesync_token");
    localStorage.removeItem("triagesync_user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isAdmin: user?.role === "ADMIN",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
