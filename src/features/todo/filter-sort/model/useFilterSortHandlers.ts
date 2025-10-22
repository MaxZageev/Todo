import type { SelectChangeEvent } from "@mui/material";
import type { Filter, SortOrder } from "@/entities/todo/model/types/todo";

/**
 * Хук `useFilterSortHandlers` собирает обработчики для селектов фильтра и кнопки сортировки.
 * Разгружает компонент `FilterSort`, чтобы там оставался только JSX.
 */
export default function useFilterSortHandlers(
  onChangeFilter: (f: Filter) => void,
  sort: SortOrder,
  onChangeSort: (s: SortOrder) => void
) {
  // Обновляем фильтр на основе выбранного значения выпадающего списка
  const handleFilter = (event: SelectChangeEvent) => onChangeFilter(event.target.value as Filter);

  // Переключаем порядок сортировки между новыми и старыми задачами
  const toggleSort = () => onChangeSort(sort === "newFirst" ? "oldFirst" : "newFirst");

  return { handleFilter, toggleSort };
}

export { useFilterSortHandlers };
