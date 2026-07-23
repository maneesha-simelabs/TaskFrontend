import React from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/rootLayout";
import Dashboard from "./components/Dashboard";
import Users from "./pages/Users";
import ProtectedRoutes from "./Router/ProtectedRoutes";
import Tasks from "./pages/Tasks";

function AppRouter() {
  return (
    <div>
      {/* <ErrorBoundary> */}
      {/* <Suspense fallback={routeFallback}> */}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="login" element={<Login></Login>} />
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="/users"
            element={<ProtectedRoutes>{<Users />}</ProtectedRoutes>}
          />
          <Route
            path="/tasks"
            element={<ProtectedRoutes>{<Tasks />}</ProtectedRoutes>}
          />
          {/* <Route
              path="tasks"
              element={
                <ProtectedRoutes>
                {
                <Tasks />
                }
                 </ProtectedRoutes>
              }
            /> */}
          {/* <Route
              path="paginated"
              element={
                <ProtectedRoutes>
                  <Paginated />
                </ProtectedRoutes>
              }
            />
            <Route
              path="effects"
              element={
                <ProtectedRoutes>
                  <EffectComparison />
                </ProtectedRoutes>
              }
            />
            <Route path="tasks/:id" element={} /> */}
          {/* <Route path="*" element={<ErrorScreen statusCode={404} />} /> */}
        </Route>

        {/* user?.data?.user?.role = */}
      </Routes>
      {/* </Suspense> */}
      {/* </ErrorBoundary> */}

      {/* <ToastContainer position="top-right" autoClose={3000}></ToastContainer> */}
    </div>
  );
}

export default AppRouter;
