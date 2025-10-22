import { useEffect } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { useAppDispatch, useAppSelector } from "@/app/providers/storeHooks";
import ProtectedRoute from "@/features/auth/protected-route/ui/ProtectedRoute";
import LoginForm from "@/pages/auth/ui/LoginForm";
import InfoPage from "@/pages/home/ui/InfoPage";
import NotFoundPage from "@/pages/not-found/ui/NotFoundPage";
import ProfilePage from "@/pages/profile/ui/ProfilePage";
import RegisterForm from "@/pages/auth/ui/RegisterForm";
import TodoPage from "@/pages/todo/ui/TodoPage";
import useAppConfig from "@/shared/config/app-config/lib/useAppConfig";
import ErrorFallback from "@/shared/ui/ErrorFallback";
import { fetchUserProfile } from "@/entities/auth/model/authSlice";

const AppLayout = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  if (!isAuthenticated) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          px: 2
        }}
      >
        <Container maxWidth="sm">
          <Outlet />
        </Container>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        py: 0
      }}
    >
      <Container maxWidth="lg">
        <Outlet />
      </Container>
    </Box>
  );
};

const App = () => {
  const location = useLocation();
  const { t } = useTranslation(undefined, { keyPrefix: "example-app" });
  const dispatch = useAppDispatch();
  const appConfig = useAppConfig();
  const { token, user, profileStatus } = useAppSelector((state) => ({
    token: state.auth.token,
    user: state.auth.user,
    profileStatus: state.auth.profileStatus
  }));
  const isAuthenticated = Boolean(token);
  const baseURL = appConfig?.TODO_API_URL ?? "";

  useEffect(() => {
    if (isAuthenticated && baseURL && !user && profileStatus === "idle") {
      dispatch(fetchUserProfile({ baseURL }));
    }
  }, [isAuthenticated, baseURL, user, profileStatus, dispatch]);

  const renderAppError = ({ error }: FallbackProps) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%"
      }}
    >
      <ErrorFallback error={error} title={t("unknown-error-title", "Unknown error")} />
    </Box>
  );

  return (
    <ErrorBoundary resetKeys={[location.key]} fallbackRender={renderAppError}>
      <Routes>
        <Route element={<AppLayout isAuthenticated={isAuthenticated} />}>
          <Route element={<ProtectedRoute />}>
            <Route index element={<TodoPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="todo" element={<TodoPage />} />
          </Route>
          <Route path="info" element={<InfoPage />} />
          <Route path="login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />} />
          <Route path="register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterForm />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
