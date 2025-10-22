
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  changePasswordRequest,
  fetchProfileRequest,
  loginRequest,
  refreshTokenRequest,
  registerRequest
} from "@/shared/api/authApi";
import { ApiError } from "@/shared/api/httpClient";
import type {
  AuthCredentials,
  AuthState,
  AuthTokens,
  AuthUser,
  RefreshArgs,
  ThunkConfig,
  FetchProfileArgs,
  RegisterArgs,
  LoginArgs,
  ChangePasswordArgs
} from "./types";
import { clearStoredAuth, loadStoredAuth, persistAuthState } from "./tokenStorage";
import { applyCredentials, applyTokens } from "./session";

const stored = loadStoredAuth();

const initialState: AuthState = {
  user: stored?.user ?? null,
  token: stored?.accessToken ?? null,
  refreshToken: stored?.refreshToken ?? null,
  status: "idle",
  profileStatus: "idle",
  changePasswordStatus: "idle",
  error: null,
  profileError: null,
  changePasswordError: null,
  tokenExpiresAt: stored?.accessTokenExpiresAt ?? null,
  refreshTokenExpiresAt: stored?.refreshTokenExpiresAt ?? null
};

const isAccessTokenExpired = (state: AuthState) => {
  if (!state.token || !state.tokenExpiresAt) {
    return true;
  }
  return state.tokenExpiresAt <= Date.now();
};

const isRefreshTokenExpired = (state: AuthState) => {
  if (!state.refreshToken || !state.refreshTokenExpiresAt) {
    return true;
  }
  return state.refreshTokenExpiresAt <= Date.now();
};

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

const STATUS_KEY = {
  auth: "status",
  profile: "profileStatus",
  changePassword: "changePasswordStatus"
} as const;

const ERROR_KEY = {
  auth: "error",
  profile: "profileError",
  changePassword: "changePasswordError"
} as const;

type StatusScope = keyof typeof STATUS_KEY;

const setPending = (state: AuthState, scope: StatusScope) => {
  state[STATUS_KEY[scope]] = "loading";
  state[ERROR_KEY[scope]] = null;
};

const setSucceeded = (state: AuthState, scope: StatusScope) => {
  state[STATUS_KEY[scope]] = "succeeded";
  state[ERROR_KEY[scope]] = null;
};

const setFailed = (state: AuthState, scope: StatusScope, message: string) => {
  state[STATUS_KEY[scope]] = "failed";
  state[ERROR_KEY[scope]] = message;
};

const resetScopeError = (state: AuthState, scope: StatusScope) => {
  if (state[STATUS_KEY[scope]] === "failed") {
    state[STATUS_KEY[scope]] = "idle";
  }
  state[ERROR_KEY[scope]] = null;
};

export const refreshSession = createAsyncThunk<AuthTokens, RefreshArgs, ThunkConfig>(
  "auth/refreshSession",
  async ({ baseURL }, { getState, rejectWithValue }) => {
    const state = getState().auth;
    if (!state.refreshToken) {
      return rejectWithValue("Missing refresh token");
    }

    if (isRefreshTokenExpired(state)) {
      return rejectWithValue("Refresh token expired");
    }

    try {
      return await refreshTokenRequest(baseURL, state.refreshToken);
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Failed to refresh session"));
    }
  }
);

export const registerUser = createAsyncThunk<AuthCredentials, RegisterArgs, ThunkConfig>(
  "auth/registerUser",
  async ({ baseURL, email, password, age }, { rejectWithValue }) => {
    try {
      return await registerRequest(baseURL, { email, password, age });
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Registration failed"));
    }
  }
);

export const loginUser = createAsyncThunk<AuthCredentials, LoginArgs, ThunkConfig>(
  "auth/loginUser",
  async ({ baseURL, email, password }, { rejectWithValue }) => {
    try {
      return await loginRequest(baseURL, { email, password });
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, "Login failed"));
    }
  }
);

export const logoutUser = createAction("auth/logoutUser");

export const fetchUserProfile = createAsyncThunk<AuthUser, FetchProfileArgs, ThunkConfig>(
  "auth/fetchUserProfile",
  async ({ baseURL }, { getState, rejectWithValue, dispatch }) => {
    const state = getState().auth;
    if (!state.token) {
      return rejectWithValue("Not authenticated");
    }

    if (isAccessTokenExpired(state)) {
      const refreshResult = await dispatch(refreshSession({ baseURL }));
      if (refreshSession.rejected.match(refreshResult)) {
        return rejectWithValue("Session expired");
      }
    }

    try {
      return await fetchProfileRequest(baseURL);
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        await dispatch(logoutUser());
        return rejectWithValue("Session expired");
      }
      return rejectWithValue(extractErrorMessage(error, "Failed to load profile"));
    }
  }
);

export const changePassword = createAsyncThunk<void, ChangePasswordArgs, ThunkConfig>(
  "auth/changePassword",
  async ({ baseURL, oldPassword, newPassword }, { getState, rejectWithValue, dispatch }) => {
    const state = getState().auth;
    if (!state.token) {
      return rejectWithValue("Not authenticated");
    }

    if (isAccessTokenExpired(state)) {
      const refreshResult = await dispatch(refreshSession({ baseURL }));
      if (refreshSession.rejected.match(refreshResult)) {
        return rejectWithValue("Session expired");
      }
    }

    try {
      await changePasswordRequest(baseURL, { oldPassword, newPassword });
      return undefined;
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        await dispatch(logoutUser());
        return rejectWithValue("Session expired");
      }
      return rejectWithValue(extractErrorMessage(error, "Failed to change password"));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      resetScopeError(state, "auth");
    },
    clearProfileError: (state) => {
      resetScopeError(state, "profile");
    },
    clearChangePasswordError: (state) => {
      resetScopeError(state, "changePassword");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        setPending(state, "auth");
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        setSucceeded(state, "auth");
        applyCredentials(state, action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        setFailed(state, "auth", action.payload ?? action.error.message ?? "Registration failed");
      })
      .addCase(loginUser.pending, (state) => {
        setPending(state, "auth");
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        setSucceeded(state, "auth");
        applyCredentials(state, action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        setFailed(state, "auth", action.payload ?? action.error.message ?? "Login failed");
      })
      .addCase(fetchUserProfile.pending, (state) => {
        setPending(state, "profile");
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        setSucceeded(state, "profile");
        state.user = action.payload;
        persistAuthState(state);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        setFailed(state, "profile", action.payload ?? action.error.message ?? "Failed to load profile");
      })
      .addCase(changePassword.pending, (state) => {
        setPending(state, "changePassword");
      })
      .addCase(changePassword.fulfilled, (state) => {
        setSucceeded(state, "changePassword");
      })
      .addCase(changePassword.rejected, (state, action) => {
        setFailed(state, "changePassword", action.payload ?? action.error.message ?? "Failed to change password");
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        applyTokens(state, action.payload);
      })
      .addCase(logoutUser, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        (Object.keys(STATUS_KEY) as StatusScope[]).forEach((scope) => {
          state[STATUS_KEY[scope]] = "idle";
          state[ERROR_KEY[scope]] = null;
        });
        state.tokenExpiresAt = null;
        state.refreshTokenExpiresAt = null;
        clearStoredAuth();
      });
  }
});

export const { clearAuthError, clearProfileError, clearChangePasswordError } = authSlice.actions;

export default authSlice.reducer;
