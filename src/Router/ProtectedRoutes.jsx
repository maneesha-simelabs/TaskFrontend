import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";

function ProtectedRoutes({ children }) {
  const { authReady } = useContext(AuthContext);
  const isLoggedIn =
    Boolean(localStorage.getItem("accessToken")) ||
    Boolean(localStorage.getItem("isLoggedIn"));
  // if (!authReady) {
  //     return <div>Loading...</div>;
  //   }

  //   return user ? <Outlet /> : <Navigate to="/login" replace />;
  if (!isLoggedIn || !authReady) {
    toast.error("Please Login First !!", { toastId: "login-success" });
    return <Navigate to="/" replace></Navigate>;
  }
  return children;
}

export default ProtectedRoutes;
