import type { Filter, SortOrder } from "@/entities/todo/model/types/todo";

export interface TodoManageUiState {
  filter: Filter;
  sort: SortOrder;
  page: number;
  limit: number;
}
