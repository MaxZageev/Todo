export type AuthUser = {
  id: number;
  email: string;
  age?: number;
  createdAt?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
};

export type AuthCredentials = AuthTokens & {
  user: AuthUser;
};

type LoadingState = "idle" | "loading" | "failed" | "succeeded";

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  status: LoadingState;
  profileStatus: LoadingState;
  changePasswordStatus: LoadingState;
  error: string | null;
  profileError: string | null;
  changePasswordError: string | null;
  tokenExpiresAt: number | null;
  refreshTokenExpiresAt: number | null;
}

export type ThunkConfig = {
  state: {
    auth: AuthState;
  };
  rejectValue: string;
};

export type RegisterArgs = {
  baseURL: string;
  email: string;
  password: string;
  age?: number;
};

export type LoginArgs = {
  baseURL: string;
  email: string;
  password: string;
};

export type FetchProfileArgs = {
  baseURL: string;
};

export type ChangePasswordArgs = {
  baseURL: string;
  oldPassword: string;
  newPassword: string;
};

export type RefreshArgs = {
  baseURL: string;
};
