import type { SxProps, Theme } from "@mui/material";

export const listItemSx: SxProps<Theme> = {
  bgcolor: "background.paper",
  borderRadius: { xs: 0.75, sm: 1 },
  mb: { xs: 0.75, sm: 1 },
  border: (theme) => `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  flexWrap: { xs: "wrap", sm: "nowrap" },
  columnGap: { xs: 0.75, sm: 0 },
  rowGap: { xs: 0.5, sm: 0 }
};

export const checkboxSx: SxProps<Theme> = {
  mt: { xs: 0, sm: 0.5 },
  alignSelf: "flex-start"
};

export const contentContainerSx: SxProps<Theme> = {
  flex: 1,
  mr: { xs: 0, sm: 1 },
  width: "100%"
};

type PrimaryTextParams = {
  expanded: boolean;
  completed: boolean;
  editing: boolean;
  isMobile: boolean;
  maxPreviewHeight: number;
};

export const getPrimaryTextSx = ({
  expanded,
  completed,
  editing,
  isMobile,
  maxPreviewHeight
}: PrimaryTextParams): SxProps<Theme> => ({
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  maxHeight: expanded ? "none" : maxPreviewHeight,
  overflow: "hidden",
  textDecoration: completed ? "line-through" : "none",
  opacity: completed ? 0.7 : 1,
  display: "block",
  fontSize: { xs: "0.9rem", sm: "1rem" },
  cursor: !editing && isMobile ? "text" : "default"
});

export const expandToggleSx: SxProps<Theme> = {
  cursor: "pointer",
  mt: 0.5
};

type ActionBoxParams = {
  isMobile: boolean;
  editing: boolean;
};

export const getActionBoxSx = ({ isMobile, editing }: ActionBoxParams): SxProps<Theme> => ({
  mt: { xs: 0.25, sm: 0 },
  alignSelf: { xs: "flex-start", sm: "flex-start" },
  ml: { xs: "auto", sm: 0 },
  ...(isMobile && !editing ? { display: "none" } : {})
});

