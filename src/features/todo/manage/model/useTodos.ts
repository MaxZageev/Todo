import { useCallback, useEffect, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "@/app/providers/storeHooks";
import { DEFAULT_PAGE } from "@/entities/todo/model/constants";
import { selectError, selectIsLoading } from "@/entities/todo/model/selectors/todos";
import {
  addTodo,
  editTodo,
  fetchTodos,
  removeTodo,
  toggleTodo
} from "@/entities/todo/model/slices/todosSlice";
import type { Filter, SortOrder } from "@/entities/todo/model/types/todo";
import useAppConfig from "@/shared/config/app-config/lib/useAppConfig";
import { selectFilter, selectLimit, selectRawPage, selectSort, selectTodosView } from "./selectors/ui";
import { setFilter as setFilterAction, setLimit, setPage as setPageAction, setSort as setSortAction } from "./uiSlice";

const useBaseUrl = () => {
  const appConfig = useAppConfig();
  return useMemo(() => appConfig?.TODO_API_URL ?? "", [appConfig]);
};

const useTodosData = () => {
  const todosView = useAppSelector(selectTodosView);
  const filter = useAppSelector(selectFilter);
  const sort = useAppSelector(selectSort);
  const limit = useAppSelector(selectLimit);
  const rawPage = useAppSelector(selectRawPage);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    todosView,
    filter,
    sort,
    limit,
    page: todosView.page,
    rawPage,
    isLoading,
    error
  };
};

const useTodoSync = ({
  baseURL,
  rawPage,
  limit,
  filter,
  sort
}: {
  baseURL: string;
  rawPage: number;
  limit: number;
  filter: Filter;
  sort: SortOrder;
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!baseURL) {
      return;
    }

    dispatch(
      fetchTodos({
        baseURL,
        page: rawPage,
        limit,
        filter,
        sort
      })
    );
  }, [baseURL, dispatch, filter, limit, rawPage, sort]);
};

export default function useTodos() {
  const dispatch = useAppDispatch();
  const baseURL = useBaseUrl();
  const { todosView, filter, sort, limit, page, rawPage, isLoading, error } = useTodosData();

  useTodoSync({
    baseURL,
    rawPage,
    limit,
    filter,
    sort
  });

  const addTodoCommand = useCallback((text: string) => {
    if (!text || !baseURL) {
      return;
    }

    dispatch(addTodo({ baseURL, text }));
    dispatch(setPageAction(DEFAULT_PAGE));
  }, [baseURL, dispatch]);

  const toggleTodoCommand = useCallback((id: string) => {
    if (!baseURL) {
      return;
    }

    dispatch(toggleTodo({ baseURL, id }));
  }, [baseURL, dispatch]);

  const removeTodoCommand = useCallback((id: string) => {
    if (!baseURL) {
      return;
    }

    dispatch(removeTodo({ baseURL, id }));
  }, [baseURL, dispatch]);

  const editTodoCommand = useCallback((id: string, nextText: string) => {
    const trimmed = nextText.trim();
    if (!trimmed || !baseURL) {
      return;
    }

    dispatch(editTodo({ baseURL, id, text: trimmed }));
  }, [baseURL, dispatch]);

  const setPage = useCallback((value: number) => {
    dispatch(setPageAction(value));
  }, [dispatch]);

  const setLimitValue = useCallback((value: number) => {
    dispatch(setLimit(value));
  }, [dispatch]);

  const setFilterValue = useCallback((value: Filter) => {
    dispatch(setFilterAction(value));
  }, [dispatch]);

  const setSortValue = useCallback((value: SortOrder) => {
    dispatch(setSortAction(value));
  }, [dispatch]);

  return {
    todos: todosView.items,
    total: todosView.total,
    totalPages: todosView.totalPages,
    page,
    limit,
    filter,
    sort,
    isLoading,
    error,
    addTodo: addTodoCommand,
    toggleTodo: toggleTodoCommand,
    removeTodo: removeTodoCommand,
    editTodo: editTodoCommand,
    setPage,
    setLimit: setLimitValue,
    setFilter: setFilterValue,
    setSort: setSortValue
  };
}
