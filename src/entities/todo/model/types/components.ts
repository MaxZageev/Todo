import type { Todo, Filter, SortOrder } from "./todo";

/**
 * Пропсы для переключателя темы.
 */
export interface ThemeSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Пропсы панели фильтров и сортировки.
 */
export interface FilterSortProps {
  filter: Filter;
  sort: SortOrder;
  onChangeFilter: (f: Filter) => void;
  onChangeSort: (s: SortOrder) => void;
}

/**
 * Пропсы карточки отдельной задачи.
 */
export interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, nextText: string) => void;
}

/**
 * Пропсы формы добавления задачи.
 */
export interface AddTodoProps {
  onAdd: (text: string) => void;
}

/**
 * Пропсы списка задач.
 */
export interface TodoListProps {
  items: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, nextText: string) => void;
}

/**
 * Пропсы панели пагинации.
 */
export interface PaginationControlsProps {
  page: number;
  total: number;
  totalPages: number;
  limit: number;
  limitOptions: number[];
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
}
