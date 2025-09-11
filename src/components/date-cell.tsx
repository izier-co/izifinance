import { Row } from "@tanstack/react-table";
import { CommonRow } from "./sorting-datatable-header";
<<<<<<< HEAD
import { MixedText } from "./mixed-text";

export function DateCell({ row, valueSource }: { row: Row<CommonRow>; valueSource: string }) {
  const dateFromISO = new Date(row.getValue(valueSource));
  const localTime = dateFromISO.toLocaleString();
  return <MixedText value={localTime} />;
=======

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
>>>>>>> 3dca31a (Add employees admin page (#3))
}
