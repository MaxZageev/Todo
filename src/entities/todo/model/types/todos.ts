import type { EntityState } from "@reduxjs/toolkit";

import type { Todo } from "./todo";

export interface TodosState extends EntityState<Todo, string> {
  isLoading: boolean;
  error: string | null;
  pageSize: number;
  total: number;
  totalPages: number;
  page: number;
}
