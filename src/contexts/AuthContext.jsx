import { createContext, useState, useEffect } from "react";
import { userLogin, myProfile, refreshAccessToken } from "../services/axios";
import {
  clearStoredAuthValues,
  getRawTokenFromStorage,
  getRefreshTokenFromStorage,
  isTokenExpired,
  setStoredAuthValue,
} from "../utils/token";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  async function initializeAuth() {
    const token = getRawTokenFromStorage();

    if (!token) {
      setUser(null);
      setAuthReady(true);
      return;
    }

    try {
      if (isTokenExpired(token)) {
        const refreshedToken = await refreshAccessToken();

        if (!refreshedToken) {
          clearStoredAuthValues();
          setUser(null);
          setAuthReady(true);
          return;
        }
      }

      const result = await myProfile();
      const payload = result?.data ?? result;
      const userData = payload?.user ?? payload;
      setUser(userData ?? null);
    } catch (error) {
      console.error("Failed to fetch profile:", error);

      if (error.response?.status === 401) {
        const refreshedToken = await refreshAccessToken();

        if (refreshedToken) {
          try {
            const result = await myProfile();
            const payload = result?.data ?? result;
            const userData = payload?.user ?? payload;
            setUser(userData ?? null);
            setAuthReady(true);
            return;
          } catch (retryError) {
            console.error("Retry failed:", retryError);
          }
        }
      }

      clearStoredAuthValues();
      setUser(null);
    } finally {
      setAuthReady(true);
    }
  }

  const generateRefreshToken = async () => {
    return await refreshAccessToken();
  };

  const login = async (credentials) => {
    try {
      const response = await userLogin(credentials);
      const payload = response?.data ?? response;
      const accessToken = payload?.accessToken || payload?.token;
      const refreshToken = payload?.refreshToken || payload?.user?.refreshToken;
      const userData = payload?.user ?? payload;
      const rememberMe = Boolean(credentials?.rememberMe);

      if (accessToken) {
        setStoredAuthValue("accessToken", accessToken, rememberMe);
      }

      if (refreshToken) {
        setStoredAuthValue("refreshToken", refreshToken, rememberMe);
      }

      if (userData) {
        if (rememberMe) {
          localStorage.setItem("taskmanagement_user", JSON.stringify(userData));
          sessionStorage.removeItem("taskmanagement_user");
        } else {
          sessionStorage.setItem(
            "taskmanagement_user",
            JSON.stringify(userData),
          );
          localStorage.removeItem("taskmanagement_user");
        }
      }

      localStorage.setItem("rememberMe", rememberMe ? "true" : "false");

      setUser(userData ?? null);
      return payload;
    } catch (e) {
      throw e;
    }
  };

  const logout = () => {
    clearStoredAuthValues();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        login,
        logout,
        isTokenExpired,
        generateRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
