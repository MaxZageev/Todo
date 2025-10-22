import type { AuthCredentials, AuthState, AuthTokens } from "./types";
import { persistAuthState, saveStoredAuth } from "./tokenStorage";

export const applyCredentials = (state: AuthState, credentials: AuthCredentials) => {
  Object.assign(state, {
    user: credentials.user,
    token: credentials.accessToken,
    refreshToken: credentials.refreshToken,
    tokenExpiresAt: credentials.accessTokenExpiresAt,
    refreshTokenExpiresAt: credentials.refreshTokenExpiresAt
  });
  saveStoredAuth(credentials);
};

export const applyTokens = (state: AuthState, tokens: AuthTokens) => {
  Object.assign(state, {
    token: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    tokenExpiresAt: tokens.accessTokenExpiresAt,
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt
  });
  persistAuthState(state);
};
