import { useMemo } from "react";

import { Chip } from "@mui/material";

import parseISODate from "@/shared/lib/date/dateParser";

type DateChipProps = {
  ISODate: string; // ISO 8601 string
};

const DateChip = ({ ISODate }: DateChipProps) => {
  const date = useMemo(() => {
    return parseISODate(ISODate);
  }, [ISODate]);

  return <Chip size="small" label={`built: ${date}`} />;
};

export default DateChip;
