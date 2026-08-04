import { lazy, Suspense } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./Router/ProtectedRoutes";
import ErrorBoundary from "./errorHandlers/ErrorBoundary";

const HomePage = lazy(() => import("./pages/Home"));
const RootLayoutPage = lazy(() => import("./layouts/RootLayout"));
const DashboardPage = lazy(() => import("./components/Dashboard"));
const UsersPage = lazy(() => import("./pages/Users"));
const TasksPage = lazy(() => import("./pages/Tasks"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPassword"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPassword"));
const LoginPage = lazy(() => import("./pages/Login"));

function AppRouter() {
  const routeFallback = <div>Loading page structure...</div>;
  return (
    <div>
      <ErrorBoundary>
        <Suspense fallback={routeFallback}>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RootLayoutPage />}>
              <Route index element={<LoginPage />} />
              <Route
                path="users"
                element={<ProtectedRoutes>{<UsersPage />}</ProtectedRoutes>}
              />
              <Route
                path="tasks"
                element={<ProtectedRoutes>{<TasksPage />}</ProtectedRoutes>}
              />
            </Route>
            <Route
              path="/forgotPassword"
              element={<ForgotPasswordPage></ForgotPasswordPage>}
            ></Route>
            <Route
              path="/reset-password"
              element={<ResetPasswordPage></ResetPasswordPage>}
            ></Route>
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default AppRouter;
