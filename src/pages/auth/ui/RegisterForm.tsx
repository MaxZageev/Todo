import { FormEvent, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { Alert, Button, Stack, TextField, Typography } from "@mui/material";

import ThemeToggleButton from "@/shared/ui/ThemeToggleButton";
import { useAppDispatch, useAppSelector } from "@/app/providers/storeHooks";
import { clearAuthError, registerUser } from "@/entities/auth/model/authSlice";
import useAppConfig from "@/shared/config/app-config/lib/useAppConfig";
import EMAIL_PATTERN  from "@/pages/auth/constants";
import * as S from "./RegisterForm.styled";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => ({
    status: state.auth.status,
    error: state.auth.error
  }));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const appConfig = useAppConfig();
  const baseURL = appConfig?.TODO_API_URL ?? "";
  const isSubmitting = status === "loading";

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const validate = () => {
    if (!EMAIL_PATTERN.test(email)) {
      setFormError("Введите корректный email");
      return false;
    }
    if (password.length < 6) {
      setFormError("Пароль должен содержать не менее 6 символов");
      return false;
    }
    if (age.trim()) {
      const numericAge = Number(age);
      if (Number.isNaN(numericAge) || numericAge <= 0) {
        setFormError("Возраст должен быть положительным числом");
        return false;
      }
    }
    if (!baseURL) {
      setFormError("Адрес API не настроен");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    dispatch(
      registerUser({
        baseURL,
        email,
        password,
        age: age.trim() ? Number(age) : undefined
      })
    );
  };

  return (
    <S.PageContainer>
      <S.FormWrapper onSubmit={handleSubmit}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" fontWeight={700}>
            Регистрация
          </Typography>
          <ThemeToggleButton size="small" />
        </Stack>

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          disabled={isSubmitting}
        />
        <TextField
          label="Пароль"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="new-password"
          disabled={isSubmitting}
          inputProps={{ minLength: 6 }}
        />
        <TextField
          label="Возраст"
          type="number"
          value={age}
          onChange={(event) => setAge(event.target.value)}
          autoComplete="age"
          disabled={isSubmitting}
          inputProps={{ min: 1 }}
        />

        {(formError || error) && <Alert severity="error">{formError ?? error}</Alert>}

        <Button type="submit" variant="contained" disabled={isSubmitting} size="large">
          {isSubmitting ? "Регистрируем..." : "Создать аккаунт"}
        </Button>

        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Уже есть аккаунт?
          </Typography>
          <Button component={NavLink} to="/login" variant="contained" size="small">
            Войти
          </Button>
        </Stack>
      </S.FormWrapper>
    </S.PageContainer>
  );
};

export default RegisterForm;
