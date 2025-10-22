import type { Todo } from "./todo";

export interface ServerTodo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface PaginatedTodosResponse {
  data: ServerTodo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedTodos {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
