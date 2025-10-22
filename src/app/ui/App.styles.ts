import type { SxProps, Theme } from "@mui/material";

export const unauthenticatedLayoutSx: SxProps<Theme> = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  py: 6,
  px: 2
};

export const authenticatedLayoutSx: SxProps<Theme> = {
  minHeight: "100vh",
  py: 0
};

export const errorFallbackContainerSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100%"
};

