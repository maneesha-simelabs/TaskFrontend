import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";
import { getRawTokenFromStorage } from "../utils/token";

function ProtectedRoutes({ children }) {
  const { authReady } = useContext(AuthContext);
  const isLoggedIn = Boolean(getRawTokenFromStorage());

  if (!authReady) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  if (!isLoggedIn) {
    toast.error("Please Login First !!", { toastId: "login-success" });
    return <Navigate to="/login" replace></Navigate>;
  }

  return children;
}

export default ProtectedRoutes;
