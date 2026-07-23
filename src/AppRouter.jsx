import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RootLayout from "./layouts/RootLayout";
import Dashboard from "./components/Dashboard";
import Users from "./pages/Users";
import ProtectedRoutes from "./Router/ProtectedRoutes";
import Tasks from "./pages/Tasks";

function AppRouter() {
  return (
    <div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="users"
            element={<ProtectedRoutes>{<Users />}</ProtectedRoutes>}
          />
          <Route
            path="tasks"
            element={<ProtectedRoutes>{<Tasks />}</ProtectedRoutes>}
          />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

export default AppRouter;
