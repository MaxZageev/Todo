/**
 * Панель фильтрации и сортировки: выбирает фильтр, направление сортировки и позволяет
 * переключать тему интерфейса.
 */
import React from "react";
import { useTranslation } from "react-i18next";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  FormControlLabel,
  Button,
  Box
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useColorMode } from "@/shared/config/theme/ui/ThemeProvider";
import ThemeSwitch from "@/shared/ui/ThemeSwitch";
import type { FilterSortProps } from "@/entities/todo/model/types/components";
import { useFilterSortHandlers } from "@/features/todo/filter-sort/model/useFilterSortHandlers";
import { FILTER_LABEL_ID } from "@/entities/todo/model/constants/filterSort";
import {
  containerSx,
  filterControlSx,
  sortButtonLabelSx,
  sortButtonSx,
  themeToggleLabelSx
} from "./FilterSort.styles";

const FilterSort: React.FC<FilterSortProps> = ({ filter, sort, onChangeFilter, onChangeSort }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "features.filter-sort" });
  const { mode, toggle } = useColorMode();
  const { handleFilter, toggleSort } = useFilterSortHandlers(onChangeFilter, sort, onChangeSort);

  const sortTitle =
    sort === "newFirst" ? t("sort.title.newFirst") : t("sort.title.oldFirst");

  const sortAria =
    sort === "newFirst" ? t("sort.aria.newFirst") : t("sort.aria.oldFirst");

  const themeLabel = mode === "dark" ? t("theme.dark") : t("theme.light");

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, sm: 2 }}
      alignItems="center"
      sx={containerSx}
    >
      <FormControl
        size="small"
        sx={filterControlSx}
      >
        <InputLabel id={FILTER_LABEL_ID}>{t("filter-label")}</InputLabel>
        <Select labelId={FILTER_LABEL_ID} label={t("filter-label")} value={filter} onChange={handleFilter}>
          <MenuItem value="all">{t("filters.all")}</MenuItem>
          <MenuItem value="completed">{t("filters.completed")}</MenuItem>
          <MenuItem value="active">{t("filters.active")}</MenuItem>
        </Select>
      </FormControl>

      <Button
        aria-label={sortAria}
        variant="outlined"
        size="small"
        onClick={toggleSort}
        endIcon={sort === "newFirst" ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
        sx={sortButtonSx}
      >
        <Box component="span" sx={sortButtonLabelSx}>
          {sortTitle}
        </Box>
      </Button>

      <FormControlLabel
        control={<ThemeSwitch checked={mode === "dark"} onChange={toggle} />}
        label={themeLabel}
        sx={themeToggleLabelSx}
      />
    </Stack>
  );
};

export default FilterSort;
