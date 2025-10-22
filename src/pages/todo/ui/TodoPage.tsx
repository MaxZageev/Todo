
import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { Divider, Tooltip } from "@mui/material";

import AddTodo from "@/features/todo/add-todo/ui/AddTodo";
import TodoList from "@/features/todo/todo-list/ui/TodoList";
import FilterSort from "@/features/todo/filter-sort/ui/FilterSort";
import PaginationControls from "@/features/todo/pagination/ui/PaginationControls";
import { useAppSelector } from "@/app/providers/storeHooks";
import { LIMIT_OPTIONS } from "@/entities/todo/model/constants";
import { useTodos } from "@/features/todo/manage";
import * as S from "./TodoPage.styled";

const TodoPage: React.FC = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "todo-page" });
  const {
    todos,
    total,
    totalPages,
    page,
    limit,
    filter,
    sort,
    isLoading,
    error,
    addTodo,
    toggleTodo,
    removeTodo,
    editTodo,
    setPage,
    setLimit,
    setFilter,
    setSort
  } = useTodos();
  const user = useAppSelector((state) => state.auth.user);
  const fallbackAccountLabel = t("account-chip", { defaultValue: "Profile" });
  const accountLabel = user?.email ?? fallbackAccountLabel;
  const accountInitial = (user?.email ?? fallbackAccountLabel).charAt(0).toUpperCase();
  const accountTooltip = t("account-tooltip", { defaultValue: "Open profile" });


  return (
    <S.PageContainer maxWidth="sm">
      <S.ContentPaper elevation={3}>
        <S.Header>
          <S.Title variant="h5">
            {t("title")}
          </S.Title>
          <Tooltip title={accountTooltip} placement="top">
            <S.AccountChip
              component={NavLink}
              to="/profile"
              clickable
              variant="outlined"
              size="medium"
              label={accountLabel}
              avatar={
                <S.AccountAvatar>
                  {accountInitial}
                </S.AccountAvatar>
              }
            />
          </Tooltip>
        </S.Header>

        {isLoading && <S.LoadingBar />}

        <S.Controls>
          <AddTodo onAdd={addTodo} />
          <FilterSort
            filter={filter}
            sort={sort}
            onChangeFilter={setFilter}
            onChangeSort={setSort}
          />
          <Divider />
        </S.Controls>

        {error && (
          <S.ErrorMessage severity="error">
            {error}
          </S.ErrorMessage>
        )}

        <S.TodoListWrapper>
          <TodoList items={todos} onToggle={toggleTodo} onDelete={removeTodo} onEdit={editTodo} />
        </S.TodoListWrapper>

        <S.PaginationWrapper>
          <PaginationControls
            page={page}
            total={total}
            totalPages={totalPages}
            limit={limit}
            limitOptions={LIMIT_OPTIONS}
            onChangePage={setPage}
            onChangeLimit={setLimit}
          />
        </S.PaginationWrapper>
      </S.ContentPaper>
    </S.PageContainer>
  );
};

export default TodoPage;
