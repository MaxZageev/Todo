/**
 * Поле добавления новой задачи. Валидация и состояние находятся в хуке
 * useAddTodoForm, здесь только отображение и доступность для клавиатуры.
 */
import React from "react";
import { useTranslation } from "react-i18next";

import { Box, TextField, IconButton, Button, useTheme, useMediaQuery } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import type { AddTodoProps } from "@/entities/todo/model/types/components";
import { useAddTodoForm } from "@/features/todo/add-todo/model/useAddTodoForm";

const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "features.add-todo" });
  const { text, error, submit, handleChange } = useAddTodoForm(onAdd);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const trimmed = text.trim();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "stretch" },
        gap: { xs: 0, sm: 1 }
      }}
    >
      <TextField
        fullWidth
        sx={{
          flex: 1,
          minWidth: { xs: "100%", sm: 320 },
          "& .MuiOutlinedInput-root": {
            height: { xs: 50, sm: 56 },
            borderRadius: { xs: 1.75, sm: 1.25 }
          },
          "& .MuiOutlinedInput-input": {
            py: 0,
            ...(isMobile ? { pr: { xs: 5.5, sm: 6 } } : {})
          }
        }}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        label={t("label")}
        placeholder={t("placeholder")}
        variant="outlined"
        error={!!error}
        helperText={error ?? " "}
        InputProps={
          isMobile
            ? {
                endAdornment: (
                  <IconButton
                    color="primary"
                    aria-label={t("aria")}
                    type="submit"
                    edge="end"
                    disabled={!trimmed}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    <AddBoxIcon />
                  </IconButton>
                )
              }
            : undefined
        }
      />

      {!isMobile && (
        <Button
          variant="contained"
          type="submit"
          endIcon={<AddBoxIcon />}
          sx={{
            ml: { xs: 0, sm: 1 },
            alignSelf: "stretch",
            minWidth: 132,
            height: 56,
            borderRadius: { xs: 1.75, sm: 1.25 }
          }}
          disabled={!trimmed}
        >
          {t("submit")}
        </Button>
      )}
    </Box>
  );
};

export default AddTodo;
