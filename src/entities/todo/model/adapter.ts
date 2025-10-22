import { createEntityAdapter } from "@reduxjs/toolkit";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/entities/todo/model/constants";
import type { Todo } from "@/entities/todo/model/types/todo";
import type { TodosState } from "@/entities/todo/model/types/todos";

type TodosExtraState = {
  isLoading: boolean;
  error: string | null;
  pageSize: number;
  total: number;
  totalPages: number;
  page: number;
};

export const todosAdapter = createEntityAdapter<Todo>();

const extraInitialState: TodosExtraState = {
  isLoading: false,
  error: null,
  pageSize: DEFAULT_LIMIT,
  total: 0,
  totalPages: DEFAULT_PAGE,
  page: DEFAULT_PAGE
};

export const todosAdapterInitialState = todosAdapter.getInitialState(extraInitialState);

type TodosAdapterRootState = {
  todos: TodosState;
};

export const todosSelectors = todosAdapter.getSelectors<TodosAdapterRootState>((state) => state.todos);
