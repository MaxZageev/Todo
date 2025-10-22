import { useState } from "react";
import { useTranslation } from "react-i18next";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
