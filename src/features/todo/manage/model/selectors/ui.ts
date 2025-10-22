import type { RootState } from "@/app/providers/store";
import { selectTodosServerView } from "@/entities/todo/model/selectors/todos";
import type { TodoManageUiState } from "../types/ui";

const selectTodoManageUiState = (state: RootState): TodoManageUiState => state.todoManageUi;

export const selectFilter = (state: RootState) => selectTodoManageUiState(state).filter;
export const selectSort = (state: RootState) => selectTodoManageUiState(state).sort;
export const selectLimit = (state: RootState) => selectTodoManageUiState(state).limit;
export const selectRawPage = (state: RootState) => selectTodoManageUiState(state).page;

export const selectTodosView = selectTodosServerView;
