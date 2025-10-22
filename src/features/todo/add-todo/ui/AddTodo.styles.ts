import type { SxProps, Theme } from "@mui/material";

export const formSx: SxProps<Theme> = {
  width: "100%",
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "stretch", sm: "stretch" },
  gap: { xs: 0, sm: 1 }
};

export const getTextFieldSx = (isMobile: boolean): SxProps<Theme> => ({
  flex: 1,
  minWidth: { xs: "100%", sm: 320 },
  "& .MuiOutlinedInput-root": {
    height: { xs: 50, sm: 56 },
    borderRadius: { xs: 1.75, sm: 1.25 }
  },
  "& .MuiOutlinedInput-input": {
    py: 0,
    ...(isMobile ? { pr: { xs: 5.5, sm: 6 } } : {})
  }
});

export const submitButtonSx: SxProps<Theme> = {
  ml: { xs: 0, sm: 1 },
  alignSelf: "stretch",
  minWidth: 132,
  height: 56,
  borderRadius: { xs: 1.75, sm: 1.25 }
};

