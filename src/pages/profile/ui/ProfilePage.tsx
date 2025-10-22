import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Alert, Button, Divider, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch, useAppSelector } from "@/app/providers/storeHooks";
import {
  changePassword,
  clearChangePasswordError,
  clearProfileError,
  fetchUserProfile,
  logoutUser
} from "@/entities/auth/model/authSlice";
import useAppConfig from "@/shared/config/app-config/lib/useAppConfig";
import ThemeToggleButton from "@/shared/ui/ThemeToggleButton";
import * as S from "./ProfilePage.styled";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, profileStatus, profileError, changePasswordStatus, changePasswordError } = useAppSelector((state) => ({
    user: state.auth.user,
    profileStatus: state.auth.profileStatus,
    profileError: state.auth.profileError,
    changePasswordStatus: state.auth.changePasswordStatus,
    changePasswordError: state.auth.changePasswordError
  }));
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const appConfig = useAppConfig();
  const baseURL = appConfig?.TODO_API_URL ?? "";
  const isProfileLoading = profileStatus === "loading";
  const isChangingPassword = changePasswordStatus === "loading";

  useEffect(() => {
    dispatch(clearProfileError());
    dispatch(clearChangePasswordError());
  }, [dispatch]);

  useEffect(() => {
    if (!user && baseURL) {
      dispatch(fetchUserProfile({ baseURL }));
    }
  }, [baseURL, dispatch, user]);

  useEffect(() => {
    if (changePasswordStatus === "succeeded") {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("Пароль успешно изменён");
    }
  }, [changePasswordStatus]);

  const formattedCreatedAt = useMemo(() => {
    if (!user?.createdAt) {
      return "—";
    }
    const date = new Date(user.createdAt);
    if (Number.isNaN(date.getTime())) {
      return user.createdAt;
    }
    return date.toLocaleString();
  }, [user]);

  const validate = () => {
    if (!oldPassword.trim()) {
      setFormError("Введите текущий пароль");
      return false;
    }
    if (newPassword.length < 6) {
      setFormError("Новый пароль должен содержать не менее 6 символов");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setFormError("Пароли не совпадают");
      return false;
    }
    if (!baseURL) {
      setFormError("Адрес API не настроен");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleChangePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    setSuccessMessage(null);
    dispatch(changePassword({ baseURL, oldPassword, newPassword }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  const handleGoToInfo = () => {
    navigate("/info", { replace: false });
  };

  return (
    <S.PageContainer>
      <S.Content spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Профиль</Typography>
          <ThemeToggleButton />
        </Stack>

        <S.SectionPaper elevation={2}>
          <Stack spacing={2}>
            <Typography variant="h6">Данные пользователя</Typography>
            {isProfileLoading && <LinearProgress />}
            {profileError && <Alert severity="error">{profileError}</Alert>}
            {user && (
              <Stack spacing={1}>
                <Typography>Электронная почта: {user.email}</Typography>
                <Typography>Возраст: {user.age ?? "—"}</Typography>
                <Typography>Создан: {formattedCreatedAt}</Typography>
              </Stack>
            )}
          </Stack>
        </S.SectionPaper>

        <S.SectionPaper elevation={2}>
          <Stack component="form" spacing={2} onSubmit={handleChangePassword}>
            <Typography variant="h6">Смена пароля</Typography>
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {(formError || changePasswordError) && (
              <Alert severity="error">{formError ?? changePasswordError}</Alert>
            )}
            <TextField
              label="Текущий пароль"
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              required
              disabled={isChangingPassword}
              autoComplete="current-password"
            />
            <Divider />
            <TextField
              label="Новый пароль"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              disabled={isChangingPassword}
              autoComplete="new-password"
              inputProps={{ minLength: 6 }}
            />
            <TextField
              label="Подтвердите пароль"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              disabled={isChangingPassword}
              autoComplete="new-password"
              inputProps={{ minLength: 6 }}
            />
            <Button type="submit" variant="contained" disabled={isChangingPassword}>
              {isChangingPassword ? "Обновляем..." : "Обновить пароль"}
            </Button>
          </Stack>
        </S.SectionPaper>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1.5, sm: 2 }}
          justifyContent="space-between"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoToInfo}
            startIcon={<InfoIcon />}
          >
            Общая информация
          </Button>
          <S.LogoutButton
            variant="contained"
            color="error"
            onClick={handleLogout}
            size="large"
            startIcon={<LogoutIcon />}
          >
            Выйти
          </S.LogoutButton>
        </Stack>
      </S.Content>
    </S.PageContainer>
  );
};

export default ProfilePage;
