import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppSelector } from "@/app/providers/storeHooks";

const ProtectedRoute = () => {
  const token = useAppSelector((state) => state.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/register" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

