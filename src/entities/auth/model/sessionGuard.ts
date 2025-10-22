import { ApiError } from "@/shared/api/httpClient";
import { logoutUser, refreshSession } from "./authSlice";
import type { AuthState } from "./types";

const isTokenExpired = (expiresAt: number | null) => !expiresAt || expiresAt <= Date.now();

type DispatchFn = (action: unknown) => unknown;

export const ensureAuthSession = async (
  baseURL: string,
  auth: AuthState,
  dispatch: DispatchFn
): Promise<string | null> => {
  if (!auth.token) {
    await dispatch(logoutUser());
    return "Not authenticated";
  }

  if (isTokenExpired(auth.refreshTokenExpiresAt)) {
    await dispatch(logoutUser());
    return "Session expired";
  }

  if (isTokenExpired(auth.tokenExpiresAt)) {
    const result = await dispatch(refreshSession({ baseURL }));
    if (refreshSession.rejected.match(result)) {
      await dispatch(logoutUser());
      return "Session expired";
    }
  }

  return null;
};

export const handleAuthError = async (
  error: unknown,
  fallback: string,
  dispatch: DispatchFn
): Promise<string> => {
  if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
    await dispatch(logoutUser());
    return "Session expired";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
