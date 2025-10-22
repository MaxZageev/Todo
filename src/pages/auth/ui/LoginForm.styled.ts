import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "var(--background)",
  color: "var(--text)",
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2)
}));

export const FormWrapper = styled("form")(({ theme }) => ({
  width: "100%",
  maxWidth: 420,
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(1.5),
  boxShadow: "0 18px 40px -25px rgba(0, 0, 0, 0.55)",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
  padding: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4)
  }
}));
