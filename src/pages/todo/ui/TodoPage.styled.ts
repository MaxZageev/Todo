import { styled } from "@mui/material/styles";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Container,
  LinearProgress,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import type { ChipProps } from "@mui/material";

type AccountChipProps = ChipProps<"div", { to?: string }>;

export const PageContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "auto",
  minHeight: "100dvh",
  boxSizing: "border-box",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  overflow: "visible",
  [theme.breakpoints.up("sm")]: {
    height: "100vh",
    minHeight: "100vh",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    overflow: "hidden"
  }
}));

export const ContentPaper = styled(Paper)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  transition: "all 0.4s ease-in-out",
  height: "auto",
  padding: theme.spacing(1.75),
  gap: theme.spacing(1.25),
  borderRadius: theme.spacing(1.25),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
    gap: theme.spacing(2.5),
    borderRadius: theme.spacing(1.75),
    height: "100%"
  }
}));

export const Header = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.5rem",
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.75rem"
  }
}));

export const AccountChip = styled(Chip)<AccountChipProps>(({ theme }) => ({
  fontWeight: 500,
  marginLeft: 0,
  [theme.breakpoints.up("sm")]: {
    marginLeft: "auto"
  }
}));

export const AccountAvatar = styled(Avatar)(({ theme }) => ({
  width: 28,
  height: 28,
  fontSize: "0.85rem",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText
}));

export const LoadingBar = styled(LinearProgress)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.up("sm")]: {
    marginBottom: theme.spacing(2)
  }
}));

export const Controls = styled(Stack)(({ theme }) => ({
  flexShrink: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  [theme.breakpoints.up("sm")]: {
    gap: theme.spacing(2)
  }
}));

export const ErrorMessage = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(0.6),
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(2)
  }
}));

export const TodoListWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  marginTop: theme.spacing(0.6),
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(2)
  }
}));

export const PaginationWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0.6),
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(2)
  }
}));
