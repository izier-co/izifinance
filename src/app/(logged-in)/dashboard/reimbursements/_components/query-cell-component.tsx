import { CommonRow } from "@/components/sorting-datatable-header";
import { fetchJSONAPI } from "@/lib/lib";
import { useQuery } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { ReactNode } from "react";

export function QueryCell({
  row,
  queryKey,
  queryUrl,
  fieldKey,
  foreignFieldKey,
  targetFieldKey,
}: {
  row: Row<CommonRow>;
  queryKey: Array<string>;
  queryUrl: string;
  fieldKey: string;
  foreignFieldKey?: string;
  targetFieldKey: string;
}): ReactNode {
  const query = useQuery({
    queryKey: queryKey,
    queryFn: async (): Promise<Array<Record<string, string | number>>> => {
      const res = await fetchJSONAPI("GET", queryUrl);
      const json = await res.json();
      return json.data;
    },
  });
  const rowValue = row.getValue(fieldKey);

  if (query.isError || query.isLoading) {
    return rowValue as string | number;
  }
  let accessorKey = fieldKey;
  if (foreignFieldKey) accessorKey = foreignFieldKey;

  const name = query.data?.find(
    (obj: Record<string, string | number>) => obj[accessorKey] === rowValue
  );
  if (name === undefined) {
    return "Unavailable";
  }
  return name[targetFieldKey] || "Unavailable";
}
