import type { SxProps, Theme } from "@mui/material";

export const containerSx: SxProps<Theme> = {
  width: "100%",
  flexWrap: { xs: "wrap", sm: "nowrap" },
  rowGap: { xs: 0.75, sm: 0 }
};

export const filterControlSx: SxProps<Theme> = {
  flex: { xs: 1, sm: "0 0 auto" },
  minWidth: { xs: 0, sm: 160 }
};

export const sortButtonSx: SxProps<Theme> = {
  minWidth: { xs: 40, sm: 190 },
  height: { xs: 36, sm: 40 },
  px: { xs: 0, sm: 2 },
  borderRadius: { xs: 12, sm: 1.25 },
  textTransform: "none",
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "var(--text)",
  justifyContent: { xs: "center", sm: "space-between" },
  "& .MuiButton-endIcon": {
    ml: { xs: 0, sm: 1 }
  }
};

export const sortButtonLabelSx: SxProps<Theme> = {
  display: { xs: "none", sm: "inline" }
};

export const themeToggleLabelSx: SxProps<Theme> = {
  m: { xs: 0.5, sm: 0 },
  alignSelf: "flex-end",
  flexShrink: 0,
  paddingLeft: { xs: 0, sm: 1.25 }
};

