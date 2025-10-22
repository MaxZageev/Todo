import type { Filter, SortOrder } from "../types/todo";

/**
 * Значения по умолчанию для фильтров, сортировки и пагинации модуля задач.
 */
export const DEFAULT_FILTER: Filter = "all";
export const DEFAULT_SORT: SortOrder = "newFirst";
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 5;
export const LIMIT_OPTIONS: number[] = [5, 10, 20];

export * from "./filterSort";
