import { styled, alpha } from "@mui/material/styles";
import { Box } from "@mui/material";

export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2)
}));

export const FormWrapper = styled("form")(({ theme }) => ({
  width: "100%",
  maxWidth: 420,
  backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.82 : 0.94),
  border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.24 : 0.18)}`,
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(1.5),
  boxShadow: theme.shadows[8],
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
  padding: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4)
  }
}));
