import { createContext, useState, useEffect } from "react";
import { userLogin, myProfile, refreshAccessToken } from "../services/axios";
import { getRawTokenFromStorage, isTokenExpired } from "../utils/token";

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
      setAuthReady(true);
      return;
    }

    if (isTokenExpired(token)) {
      const refreshedToken = await refreshAccessToken();

      if (!refreshedToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        setAuthReady(true);
        return;
      }
    }

    try {
      const result = await myProfile();
      const payload = result?.data ?? result;
      const userData = payload?.user ?? payload;
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);

      if (error.response?.status === 401) {
        const refreshedToken = await refreshAccessToken();

        if (refreshedToken) {
          try {
            const result = await myProfile();
            const payload = result?.data ?? result;
            const userData = payload?.user ?? payload;
            setUser(userData);
            setAuthReady(true);
            return;
          } catch (retryError) {
            console.error("Retry failed:", retryError);
          }
        }
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
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

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      if (userData) {
        localStorage.setItem("taskmanagement_user", JSON.stringify(userData));
      }

      setUser(userData ?? null);
      return payload;
    } catch (e) {
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("taskmanagement_user");
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
