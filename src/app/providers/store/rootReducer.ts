import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/entities/auth/model/authSlice";
import todosReducer from "@/entities/todo/model/slices/todosSlice";
import { todoManageUiReducer } from "@/features/todo";

export const rootReducer = combineReducers({
  auth: authReducer,
  todos: todosReducer,
  todoManageUi: todoManageUiReducer
});

export default rootReducer;
