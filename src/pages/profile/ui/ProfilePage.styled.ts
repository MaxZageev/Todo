import { styled, alpha } from "@mui/material/styles";
import { Box, Button, Paper, Stack } from "@mui/material";

export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2)
}));

export const Content = styled(Stack)(() => ({
  width: "100%",
  maxWidth: 560
}));

export const SectionPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.88 : 1),
  padding: theme.spacing(2.5),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3)
  }
}));

export const LogoutButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  minWidth: "100%",
  [theme.breakpoints.up("sm")]: {
    minWidth: 220
  }
}));
