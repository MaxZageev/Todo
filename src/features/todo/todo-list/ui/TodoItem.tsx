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
import {
  checkboxSx,
  contentContainerSx,
  expandToggleSx,
  getActionBoxSx,
  getPrimaryTextSx,
  listItemSx
} from "./TodoItem.styles";

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

  const handlePrimaryClick = () => {
    if (!editing && isMobile) {
      startEdit();
    }
  };

  const actionBoxSx = getActionBoxSx({ isMobile, editing });

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
      sx={listItemSx}
    >
      <Checkbox
        checked={completed}
        onChange={() => onToggle(id)}
        sx={checkboxSx}
        inputProps={{ "aria-label": completed ? t("checkbox.incomplete") : t("checkbox.complete") }}
      />

      <Box sx={contentContainerSx}>
        {!editing ? (
          <>
            <ListItemText
              primary={
                <Typography
                  component="span"
                  onClick={handlePrimaryClick}
                  sx={getPrimaryTextSx({
                    expanded,
                    completed,
                    editing,
                    isMobile,
                    maxPreviewHeight: MAX_PREVIEW_HEIGHT
                  })}
                >
                  {text}
                </Typography>
              }
              secondary={new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short"
              }).format(createdAt)}
            />

            {text.length > 120 && (
              <Typography
                variant="body2"
                color="primary"
                sx={expandToggleSx}
                onClick={toggleExpanded}
              >
                {expanded ? t("expand.hide") : t("expand.show")}
              </Typography>
            )}
          </>
        ) : (
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
