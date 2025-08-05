import React, {createContext, useContext, useState, useEffect} from "react";
import * as api from "./api";

// CONTEXT for Auth/user
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Persist login
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }
    // Validate and load profile
    api.getProfile(token).then((u) => {
      setUser(u);
      setAuthToken(token);
      setLoading(false);
    }).catch(() => {
      setUser(null);
      setAuthToken(null);
      setLoading(false);
      localStorage.removeItem("authToken");
    });
  }, []);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    const res = await api.login(email, password);
    setAuthToken(res.access_token);
    localStorage.setItem("authToken", res.access_token);
    const profile = await api.getProfile(res.access_token);
    setUser(profile);
    return profile;
  };

  // PUBLIC_INTERFACE
  const register = async (userData) => {
    return api.register(userData);
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
  };

  // PUBLIC_INTERFACE
  const refreshProfile = async () => {
    if (!authToken) return;
    const profile = await api.getProfile(authToken);
    setUser(profile);
  };

  const value = {
    user,
    authToken,
    login,
    logout,
    register,
    refreshProfile,
    loading,
    setAuthToken,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
