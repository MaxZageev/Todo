import React from "react";
import { useTranslation } from "react-i18next";

import { List, Typography } from "@mui/material";
import TodoItem from "./TodoItem";
import type { TodoListProps } from "@/entities/todo/model/types/components";
import { emptyStateSx, listSx } from "./TodoList.styles";

/**
 * Список задач. Если элементы отсутствуют, выводит подсказку для пользователя.
 */
const TodoList: React.FC<TodoListProps> = ({ items, onToggle, onDelete, onEdit }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "features.todo-list" });

  if (!items.length) {
    return (
      <Typography sx={emptyStateSx}>
        {t("empty")}
      </Typography>
    );
  }

  return (
    <List sx={listSx}>
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
