import React from "react";
import { useTranslation } from "react-i18next";

import { Box, TextField, IconButton, Button, useTheme, useMediaQuery } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import type { AddTodoProps } from "@/entities/todo/model/types/components";
import { useAddTodoForm } from "@/features/todo/add-todo/model/useAddTodoForm";
import { formSx, getTextFieldSx, submitButtonSx } from "./AddTodo.styles";

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
    <Box component="form" onSubmit={handleSubmit} sx={formSx}>
      <TextField
        fullWidth
        sx={getTextFieldSx(isMobile)}
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
          sx={submitButtonSx}
          disabled={!trimmed}
        >
          {t("submit")}
        </Button>
      )}
    </Box>
  );
};

export default AddTodo;
