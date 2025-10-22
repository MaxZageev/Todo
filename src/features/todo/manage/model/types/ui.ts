import type { Filter, SortOrder } from "@/entities/todo/model/types/todo";

/**
 * UX-facing state owned by the todo-manage feature.
 */
export interface TodoManageUiState {
  filter: Filter;
  sort: SortOrder;
  page: number;
  limit: number;
}
