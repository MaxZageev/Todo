import { apiFetch } from "@/shared/api/httpClient";
import type { Filter, SortOrder, Todo } from "@/entities/todo/model/types/todo";
import type {
  PaginatedTodos,
  PaginatedTodosResponse,
  ServerTodo
} from "@/entities/todo/model/types/api";

const resolveUrl = (baseURL: string, path: string) => new URL(path, baseURL);

const mapTodoFromServer = (todo: ServerTodo): Todo => ({
  id: todo.id.toString(),
  text: todo.text,
  completed: todo.completed,
  createdAt: new Date(todo.createdAt)
});

const mapPaginatedResponse = (payload: PaginatedTodosResponse): PaginatedTodos => ({
  ...payload,
  data: payload.data.map(mapTodoFromServer)
});

type FetchTodosParams = {
  page: number;
  limit: number;
  filter: Filter;
  sort: SortOrder;
};

const appendSearchParams = (url: URL, params: Record<string, string | number | boolean>) => {
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
};

export const fetchTodosApi = async (baseURL: string, params: FetchTodosParams): Promise<PaginatedTodos> => {
  const url = resolveUrl(baseURL, "/todos");
  appendSearchParams(url, params);
  const data = await apiFetch<PaginatedTodosResponse>(url.toString());
  return mapPaginatedResponse(data);
};

export const createTodoApi = async (baseURL: string, text: string): Promise<Todo> => {
  const data = await apiFetch<ServerTodo>(resolveUrl(baseURL, "/todos").toString(), {
    method: "POST",
    body: JSON.stringify({ text })
  });
  return mapTodoFromServer(data);
};

export const updateTodoApi = async (
  baseURL: string,
  id: string,
  payload: Partial<Pick<Todo, "text" | "completed">>
): Promise<Todo> => {
  const data = await apiFetch<ServerTodo>(resolveUrl(baseURL, `/todos/${id}`).toString(), {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  return mapTodoFromServer(data);
};

export const deleteTodoApi = async (baseURL: string, id: string): Promise<void> => {
  await apiFetch(resolveUrl(baseURL, `/todos/${id}`).toString(), {
    method: "DELETE",
    parse: "none"
  });
};

export const toggleTodoApi = async (baseURL: string, id: string): Promise<Todo> => {
  const data = await apiFetch<ServerTodo>(resolveUrl(baseURL, `/todos/${id}/toggle`).toString(), {
    method: "PATCH"
  });
  return mapTodoFromServer(data);
};
