import { apiFetch, ApiError } from "./httpClient";
import type { AuthCredentials, AuthTokens, AuthUser } from "@/entities/auth/model/types";

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  accessTokenExpiresIn?: number;
  refreshTokenExpiresIn?: number;
};

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn?: number;
  refreshTokenExpiresIn?: number;
};

export type RegisterPayload = {
  email: string;
  password: string;
  age?: number;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

const resolveUrl = (baseURL: string, path: string) => new URL(path, baseURL).toString();

const buildCredentials = (payload: AuthResponse): AuthCredentials => {
  const accessExpiresIn = payload.accessTokenExpiresIn ? payload.accessTokenExpiresIn * 1000 : ACCESS_TOKEN_TTL_MS;
  const refreshExpiresIn = payload.refreshTokenExpiresIn ? payload.refreshTokenExpiresIn * 1000 : REFRESH_TOKEN_TTL_MS;

  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    user: payload.user,
    accessTokenExpiresAt: Date.now() + accessExpiresIn,
    refreshTokenExpiresAt: Date.now() + refreshExpiresIn
  };
};

const buildTokens = (payload: RefreshResponse): AuthTokens => {
  const accessExpiresIn = payload.accessTokenExpiresIn ? payload.accessTokenExpiresIn * 1000 : ACCESS_TOKEN_TTL_MS;
  const refreshExpiresIn = payload.refreshTokenExpiresIn ? payload.refreshTokenExpiresIn * 1000 : REFRESH_TOKEN_TTL_MS;

  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    accessTokenExpiresAt: Date.now() + accessExpiresIn,
    refreshTokenExpiresAt: Date.now() + refreshExpiresIn
  };
};

export const registerRequest = async (
  baseURL: string,
  payload: RegisterPayload
): Promise<AuthCredentials> => {
  try {
    const data = await apiFetch<AuthResponse>(resolveUrl(baseURL, "/auth/register"), {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return buildCredentials(data);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Registration failed");
  }
};

export const loginRequest = async (
  baseURL: string,
  payload: LoginPayload
): Promise<AuthCredentials> => {
  try {
    const data = await apiFetch<AuthResponse>(resolveUrl(baseURL, "/auth/login"), {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return buildCredentials(data);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Login failed");
  }
};

export const fetchProfileRequest = async (
  baseURL: string
): Promise<AuthUser> => {
  try {
    return await apiFetch<AuthUser>(resolveUrl(baseURL, "/auth/me"));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Profile request failed");
  }
};

export const changePasswordRequest = async (
  baseURL: string,
  payload: ChangePasswordPayload
): Promise<void> => {
  try {
    await apiFetch(resolveUrl(baseURL, "/auth/change-password"), {
      method: "POST",
      body: JSON.stringify(payload),
      parse: "none"
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Change password failed");
  }
};

export const refreshTokenRequest = async (
  baseURL: string,
  refreshToken: string
): Promise<AuthTokens> => {
  try {
    const data = await apiFetch<RefreshResponse>(resolveUrl(baseURL, "/auth/refresh"), {
      method: "POST",
      body: JSON.stringify({ refreshToken })
    });
    return buildTokens(data);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Token refresh failed");
  }
};
