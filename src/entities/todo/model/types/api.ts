import type { Todo } from "./todo";

/**
 * Тип задачи в ответе сервера. Отличается от клиентского тем, что id — число, а дата — строка.
 */
export interface ServerTodo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

/**
 * Ответ /todos с пагинацией в формате сервера.
 */
export interface PaginatedTodosResponse {
  data: ServerTodo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Пагинированный набор задач после приведения к клиентским типам.
 */
export interface PaginatedTodos {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
