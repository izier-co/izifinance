import { Row } from "@tanstack/react-table";
import { CommonRow } from "./sorting-datatable-header";

export function DateCell({
  row,
  valueSource,
}: {
  row: Row<CommonRow>;
  valueSource: string;
}) {
  const dateFromISO = new Date(row.getValue(valueSource));
  const localTime = dateFromISO.toLocaleString();
  return <div>{localTime}</div>;
}
