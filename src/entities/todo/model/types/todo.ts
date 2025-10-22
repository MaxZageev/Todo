/**
 * Базовый тип задачи, используемый в клиентском приложении.
 */
export interface Todo {
  id: string; // строковый идентификатор, удобный для key в React
  text: string; // описание задачи
  completed: boolean; // признак выполнения
  createdAt: Date; // время создания
}

export type Filter = "all" | "completed" | "active";
export type SortOrder = "newFirst" | "oldFirst";
