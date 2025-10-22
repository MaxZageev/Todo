import { format, parseISO } from "date-fns";

// date: ISO 8601 string

const parseISODate = (date: string) => {
  return format(parseISO(date), "dd.MM.yyyy HH:mm");
};

export default parseISODate;
