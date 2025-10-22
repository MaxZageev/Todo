/**
 * Карточка отдельной задачи: поддерживает смену статуса, редактирование текста,
 * удаление и разворачивание длинного содержимого.
 */
import React from "react";
import { useTranslation } from "react-i18next";

import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemText,
  TextField,
  Box,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import type { TodoItemProps } from "@/entities/todo/model/types/components";
import { useTodoItem } from "@/features/todo/todo-list/model/useTodoItem";

// Максимальная высота превью, после которой показывается ссылка «Развернуть»
const MAX_PREVIEW_HEIGHT = 25;

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  text,
  completed,
  createdAt,
  onToggle,
  onDelete,
  onEdit
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "features.todo-item" });
  // Хук управляет режимами редактирования, расхлопыванием и черновиком текста
  const {
    editing,
    draft,
    expanded,
    setDraft,
    startEdit,
    cancelEdit,
    save,
    toggleExpanded,
    handleKeyDown
  } = useTodoItem(text, (next) => onEdit(id, next));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // На мобильном по нажатию на текст сразу переключаемся в режим редактирования
  const handlePrimaryClick = () => {
    if (!editing && isMobile) {
      startEdit();
    }
  };

  const actionBoxSx = {
    mt: { xs: 0.25, sm: 0 },
    alignSelf: { xs: "flex-start", sm: "flex-start" },
    ml: { xs: "auto", sm: 0 },
    ...(isMobile && !editing ? { display: "none" } : {})
  } as const;

  /**
   * Вспомогательная функция рендерит набор кнопок для текущего режима.
   */
  const renderActions = () => {
    if (editing) {
      return (
        <>
          <Tooltip title={t("actions.save")}>
            <IconButton edge="end" onClick={save}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("actions.delete")}>
            <IconButton edge="end" onClick={() => onDelete(id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("actions.cancel")}>
            <IconButton edge="end" onClick={cancelEdit}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </>
      );
    }

    if (isMobile) {
      return null;
    }

    return (
      <Tooltip title={t("actions.edit")}>
        <IconButton edge="end" onClick={startEdit}>
          <EditIcon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        bgcolor: "background.paper",
        borderRadius: { xs: 0.75, sm: 1 },
        mb: { xs: 0.75, sm: 1 },
        border: (muiTheme) => `1px solid ${muiTheme.palette.divider}`,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: { xs: "wrap", sm: "nowrap" },
        columnGap: { xs: 0.75, sm: 0 },
        rowGap: { xs: 0.5, sm: 0 }
      }}
    >
      {/* Чекбокс переключает статус выполнения */}
      <Checkbox
        checked={completed}
        onChange={() => onToggle(id)}
        sx={{ mt: { xs: 0, sm: 0.5 }, alignSelf: "flex-start" }}
        inputProps={{ "aria-label": completed ? t("checkbox.incomplete") : t("checkbox.complete") }}
      />

      <Box sx={{ flex: 1, mr: { xs: 0, sm: 1 }, width: "100%" }}>
        {!editing ? (
          <>
            {/* Основной текст задачи. На мобильных тап запускает редактирование */}
            <ListItemText
              primary={
                <Typography
                  component="span"
                  onClick={handlePrimaryClick}
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxHeight: expanded ? "none" : MAX_PREVIEW_HEIGHT,
                    overflow: "hidden",
                    textDecoration: completed ? "line-through" : "none",
                    opacity: completed ? 0.7 : 1,
                    display: "block",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    cursor: !editing && isMobile ? "text" : "default"
                  }}
                >
                  {text}
                </Typography>
              }
              secondary={new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short"
              }).format(createdAt)}
            />

            {/* Ссылка «Развернуть/Свернуть» появляется только у длинных текстов */}
            {text.length > 120 && (
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer", mt: 0.5 }}
                onClick={toggleExpanded}
              >
                {expanded ? t("expand.hide") : t("expand.show")}
              </Typography>
            )}
          </>
        ) : (
          // Поле редактирования текста задачи
          <TextField
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            size="small"
            autoFocus
            multiline
          />
        )}
      </Box>

      <Box display="flex" gap={0.5} alignItems="flex-start" sx={actionBoxSx}>
        {renderActions()}
      </Box>
    </ListItem>
  );
};

export default TodoItem;
