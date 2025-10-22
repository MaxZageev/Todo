/**
 * Панель пагинации: выводит счётчики элементов и управляет переключателем
 * количества записей. На десктопе использует TablePagination, на мобильных —
 * облегченную версию с компактными кнопками.
 */
import React from "react";
import {
  Box,
  TablePagination,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useTranslation } from "react-i18next";
import type { PaginationControlsProps } from "@/entities/todo/model/types/components";

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  total,
  totalPages,
  limit,
  limitOptions,
  onChangePage,
  onChangeLimit
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "features.pagination" });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formatRowsLabel = ({ from, to, count }: { from: number; to: number; count: number }) => {
    if (count === 0) {
      return t("range.empty");
    }
    if (count === -1) {
      return t("range.unknown", { from, to });
    }
    return t("range.default", { from, to, count });
  };

  const safeTotalPages = Math.max(totalPages, 1);
  const clampedPage = Math.min(page, safeTotalPages);
  const pageIndex = Math.max(clampedPage - 1, 0);

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement> | null,
    nextPage: number
  ) => {
    onChangePage(nextPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChangeLimit(Number(event.target.value));
  };

  const startItem = total <= 0 ? 0 : pageIndex * limit + 1;
  const theoreticalEnd = (pageIndex + 1) * limit;
  const endItem = total === -1 ? theoreticalEnd : Math.min(theoreticalEnd, total);
  const rangeLabel = formatRowsLabel({ from: startItem || 0, to: endItem, count: total });

  if (isMobile) {
    const handleLimitChange = (event: SelectChangeEvent<number>) => {
      onChangeLimit(Number(event.target.value));
    };

    return (
      <Stack spacing={0.75} sx={{ width: "100%", px: 0.75 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {t("rows-per-page")}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 90 }}>
            <InputLabel id="todo-limit-mobile">{t("modal-limit")}</InputLabel>
            <Select
              labelId="todo-limit-mobile"
              label={t("modal-limit")}
              value={limit}
              onChange={handleLimitChange}
            >
              {limitOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <IconButton
            size="small"
            onClick={() => onChangePage(Math.max(1, page - 1))}
            disabled={pageIndex === 0}
            aria-label={t("aria.prev")}
          >
            <NavigateBeforeIcon fontSize="small" />
          </IconButton>

          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {rangeLabel}
          </Typography>

          <IconButton
            size="small"
            onClick={() => onChangePage(Math.min(safeTotalPages, page + 1))}
            disabled={pageIndex >= safeTotalPages - 1}
            aria-label={t("aria.next")}
          >
            <NavigateNextIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    );
  }

  return (
    <Box display="flex" justifyContent="center" sx={{ width: "100%" }}>
      <TablePagination
        component="div"
        count={total}
        page={pageIndex}
        onPageChange={handleChangePage}
        rowsPerPage={limit}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={limitOptions}
        labelRowsPerPage={t("rows-per-page")}
        labelDisplayedRows={formatRowsLabel}
      />
    </Box>
  );
};

export default PaginationControls;
