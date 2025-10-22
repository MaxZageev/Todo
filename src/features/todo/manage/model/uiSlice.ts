import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DEFAULT_FILTER, DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SORT } from "@/entities/todo/model/constants";
import type { TodoManageUiState } from "./types/ui";

const initialState: TodoManageUiState = {
  filter: DEFAULT_FILTER,
  sort: DEFAULT_SORT,
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT
};

const todoManageUiSlice = createSlice({
  name: "todoManage/ui",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TodoManageUiState["filter"]>) => {
      state.filter = action.payload;
      state.page = DEFAULT_PAGE;
    },
    setSort: (state, action: PayloadAction<TodoManageUiState["sort"]>) => {
      state.sort = action.payload;
      state.page = DEFAULT_PAGE;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = Math.max(DEFAULT_PAGE, action.payload);
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = Math.max(DEFAULT_PAGE, action.payload);
      state.page = DEFAULT_PAGE;
    }
  }
});

export const { setFilter, setSort, setPage, setLimit } = todoManageUiSlice.actions;

export default todoManageUiSlice.reducer;

