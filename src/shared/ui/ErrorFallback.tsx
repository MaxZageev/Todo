import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type ErrorFallbackProps = {
  error: Error;
  title: string;
  description?: string;
};

const ErrorFallback = ({ error, title, description }: ErrorFallbackProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "app-error-fallback" });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box display="flex" alignItems="center">
        <Typography display="inline">{title}</Typography>
        <Tooltip title={t("tooltip-title", "Подробнее об ошибке")}>
          <IconButton size="small" onClick={handleOpen}>
            <InfoOutlinedIcon color="error" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography>{description ? `${error.message} ${description}` : error.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleClose}>
            {t("btn-close", "Закрыть")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ErrorFallback;
