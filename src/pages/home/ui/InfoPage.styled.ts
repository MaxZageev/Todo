import { styled, alpha } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";

export const PageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  minHeight: "auto",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    minHeight: "100vh",
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  }
}));

export const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 800,
  width: "100%",
  backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.82 : 0.92),
  borderRadius: theme.spacing(2),
  backdropFilter: "blur(10px)",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
    borderRadius: theme.spacing(3)
  }
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1.75rem",
  [theme.breakpoints.up("sm")]: {
    fontSize: "2.125rem"
  }
}));

export const SectionDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2)
}));

export const SectionRow = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(2)
}));

export const ConfigPreview = styled("pre")(({ theme }) => ({
  marginTop: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.12 : 0.04),
  overflowX: "auto",
  fontSize: "0.8rem",
  maxWidth: "100%",
  [theme.breakpoints.up("sm")]: {
    fontSize: "0.9rem"
  }
}));

export const StatusChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1)
}));

export const ApiSourceText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  [theme.breakpoints.up("sm")]: {
    marginTop: 0
  }
}));

export const ContactAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText
}));

export const ContactIcon = styled(TelegramIcon)(() => ({}));

export const ActionButton = styled(Button)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto"
  }
}));

export const ThemeControl = styled(FormControlLabel)(({ theme }) => ({
  marginLeft: 0,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1)
  }
}));
