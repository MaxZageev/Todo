import type { Middleware } from "@reduxjs/toolkit";

import { setAccessToken } from "@/shared/api/httpClient";

export const authMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const result = next(action);
  const state = storeApi.getState() as { auth?: { token: string | null } };
  setAccessToken(state.auth?.token ?? null);
  return result;
};

export default authMiddleware;
