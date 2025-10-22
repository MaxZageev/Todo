import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/providers/store";
import { todosSelectors } from "@/entities/todo/model/adapter";

const selectTodosState = (state: RootState) => state.todos;

export const selectIsLoading = (state: RootState): boolean => selectTodosState(state).isLoading;
export const selectError = (state: RootState): string | null => selectTodosState(state).error;

export const selectTodosServerView = createSelector(
  [selectTodosState, (state: RootState) => todosSelectors.selectAll(state)],
  (todosState, items) => ({
    items,
    total: todosState.total,
    totalPages: todosState.totalPages,
    page: todosState.page,
    limit: todosState.pageSize
  })
);
