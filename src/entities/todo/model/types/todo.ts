
export interface Todo {
  id: string; 
  text: string; 
  completed: boolean; 
  createdAt: Date; 
}

export type Filter = "all" | "completed" | "active";
export type SortOrder = "newFirst" | "oldFirst";
