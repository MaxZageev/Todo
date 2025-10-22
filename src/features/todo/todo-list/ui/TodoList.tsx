import React from "react";
import { useTranslation } from "react-i18next";

import { List, Typography } from "@mui/material";
import TodoItem from "./TodoItem";
import type { TodoListProps } from "@/entities/todo/model/types/components";

/**
 * Список задач. Если элементы отсутствуют, выводит подсказку для пользователя.
 */
const TodoList: React.FC<TodoListProps> = ({ items, onToggle, onDelete, onEdit }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "features.todo-list" });

  if (!items.length) {
    return (
      <Typography sx={{ opacity: 0.7, mt: { xs: 1, sm: 2 }, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
        {t("empty")}
      </Typography>
    );
  }

  return (
    <List sx={{ mt: { xs: 0.5, sm: 1 } }}>
      {items.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          text={todo.text}
          completed={todo.completed}
          createdAt={todo.createdAt}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </List>
  );
};

export default TodoList;
