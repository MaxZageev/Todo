import type { AuthCredentials, AuthState } from "./types";

const STORAGE_KEY = "auth.credentials";

type StoredAuthPayload = AuthCredentials;

type StoredAuth = StoredAuthPayload | null;

const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const hasSnapshotRequiredFields = (state: AuthState): boolean =>
  Boolean(
    state.user &&
    state.token &&
    state.refreshToken &&
    state.tokenExpiresAt &&
    state.refreshTokenExpiresAt
  );

export const loadStoredAuth = (): StoredAuth => {
  if (!isBrowser) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as StoredAuthPayload;
  } catch {
    return null;
  }
};

export const saveStoredAuth = (payload: StoredAuthPayload) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const clearStoredAuth = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};

export const snapshotAuthState = (state: AuthState): StoredAuthPayload | null => {
  if (!hasSnapshotRequiredFields(state)) {
    return null;
  }

  return {
    user: state.user,
    accessToken: state.token,
    refreshToken: state.refreshToken,
    accessTokenExpiresAt: state.tokenExpiresAt,
    refreshTokenExpiresAt: state.refreshTokenExpiresAt
  };
};

export const persistAuthState = (state: AuthState) => {
  const snapshot = snapshotAuthState(state);
  if (!snapshot) {
    return;
  }

  saveStoredAuth(snapshot);
};
