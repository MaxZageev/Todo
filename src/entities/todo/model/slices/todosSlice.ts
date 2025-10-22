/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createTodoApi,
  deleteTodoApi,
  fetchTodosApi,
  toggleTodoApi,
  updateTodoApi
} from "@/entities/todo/api/todos";
import { DEFAULT_PAGE } from "@/entities/todo/model/constants";
import { todosAdapter, todosAdapterInitialState } from "@/entities/todo/model/adapter";
import type { Filter, SortOrder, Todo } from "@/entities/todo/model/types/todo";
import type { PaginatedTodos } from "@/entities/todo/model/types/api";
import type { AuthState } from "@/entities/auth/model/types";
import { ensureAuthSession, handleAuthError } from "@/entities/auth/model/sessionGuard";

const ERROR_FALLBACKS = {
  fetch: "FETCH_FAILED",
  create: "CREATE_FAILED",
  update: "UPDATE_FAILED",
  remove: "REMOVE_FAILED",
  toggle: "TOGGLE_FAILED"
} as const;

type FetchArgs = {
  baseURL: string;
  page: number;
  limit: number;
  filter: Filter;
  sort: SortOrder;
};

type TodosThunkConfig = {
  state: {
    auth: AuthState;
  };
  rejectValue: string;
};

export const fetchTodos = createAsyncThunk<PaginatedTodos, FetchArgs, TodosThunkConfig>(
  "todos/fetchTodos",
  async ({ baseURL, page, limit, filter, sort }, thunkAPI) => {
    if (!baseURL) {
      return thunkAPI.rejectWithValue("Missing API URL");
    }

    const { auth } = thunkAPI.getState();
    const authMessage = await ensureAuthSession(baseURL, auth, thunkAPI.dispatch);
    if (authMessage) {
      return thunkAPI.rejectWithValue(authMessage);
    }

    try {
      return await fetchTodosApi(baseURL, { page, limit, filter, sort });
    } catch (error) {
      const message = await handleAuthError(error, ERROR_FALLBACKS.fetch, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addTodo = createAsyncThunk<
  Todo,
  { baseURL: string; text: string },
  TodosThunkConfig
>("todos/addTodo", async ({ baseURL, text }, thunkAPI) => {
  if (!baseURL) {
    return thunkAPI.rejectWithValue("Missing API URL");
  }

  const { auth } = thunkAPI.getState();
  const authMessage = await ensureAuthSession(baseURL, auth, thunkAPI.dispatch);
  if (authMessage) {
    return thunkAPI.rejectWithValue(authMessage);
  }

  try {
    const todo = await createTodoApi(baseURL, text);
    return todo;
  } catch (error) {
    const message = await handleAuthError(error, ERROR_FALLBACKS.create, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(message);
  }
});

export const editTodo = createAsyncThunk<
  Todo,
  { baseURL: string; id: string; text: string },
  TodosThunkConfig
>("todos/editTodo", async ({ baseURL, id, text }, thunkAPI) => {
  if (!baseURL) {
    return thunkAPI.rejectWithValue("Missing API URL");
  }

  const { auth } = thunkAPI.getState();
  const authMessage = await ensureAuthSession(baseURL, auth, thunkAPI.dispatch);
  if (authMessage) {
    return thunkAPI.rejectWithValue(authMessage);
  }

  try {
    const todo = await updateTodoApi(baseURL, id, { text });
    return todo;
  } catch (error) {
    const message = await handleAuthError(error, ERROR_FALLBACKS.update, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(message);
  }
});

export const removeTodo = createAsyncThunk<
  string,
  { baseURL: string; id: string },
  TodosThunkConfig
>("todos/removeTodo", async ({ baseURL, id }, thunkAPI) => {
  if (!baseURL) {
    return thunkAPI.rejectWithValue("Missing API URL");
  }

  const { auth } = thunkAPI.getState();
  const authMessage = await ensureAuthSession(baseURL, auth, thunkAPI.dispatch);
  if (authMessage) {
    return thunkAPI.rejectWithValue(authMessage);
  }

  try {
    await deleteTodoApi(baseURL, id);
    return id;
  } catch (error) {
    const message = await handleAuthError(error, ERROR_FALLBACKS.remove, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(message);
  }
});

export const toggleTodo = createAsyncThunk<
  Todo,
  { baseURL: string; id: string },
  TodosThunkConfig
>("todos/toggleTodo", async ({ baseURL, id }, thunkAPI) => {
  if (!baseURL) {
    return thunkAPI.rejectWithValue("Missing API URL");
  }

  const { auth } = thunkAPI.getState();
  const authMessage = await ensureAuthSession(baseURL, auth, thunkAPI.dispatch);
  if (authMessage) {
    return thunkAPI.rejectWithValue(authMessage);
  }

  try {
    const todo = await toggleTodoApi(baseURL, id);
    return todo;
  } catch (error) {
    const message = await handleAuthError(error, ERROR_FALLBACKS.toggle, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(message);
  }
});

const todosSlice = createSlice({
  name: "todos",
  initialState: todosAdapterInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.pageSize = Math.max(DEFAULT_PAGE, action.payload.limit);
        state.total = action.payload.total;
        state.totalPages = Math.max(DEFAULT_PAGE, action.payload.totalPages);
        state.page = Math.max(DEFAULT_PAGE, action.payload.page);
        todosAdapter.setAll(state, action.payload.data);
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error?.message ?? ERROR_FALLBACKS.fetch;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        todosAdapter.addOne(state, action.payload);
        state.error = null;
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message ?? ERROR_FALLBACKS.create;
      })
      .addCase(editTodo.fulfilled, (state, action) => {
        todosAdapter.upsertOne(state, action.payload);
        state.error = null;
      })
      .addCase(editTodo.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message ?? ERROR_FALLBACKS.update;
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        todosAdapter.removeOne(state, action.payload);
        state.error = null;
      })
      .addCase(removeTodo.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message ?? ERROR_FALLBACKS.remove;
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        todosAdapter.upsertOne(state, action.payload);
        state.error = null;
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message ?? ERROR_FALLBACKS.toggle;
      });
  }
});

export default todosSlice.reducer;
