import { fetchJSONAPI } from "@/lib/lib";
import { useQuery } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";

export function QueryCell({
  row,
  queryKey,
  queryUrl,
  fieldKey,
  foreignFieldKey,
  targetFieldKey,
}: {
  row: Row<any>;
  queryKey: Array<string>;
  queryUrl: string;
  fieldKey: string;
  foreignFieldKey?: string;
  targetFieldKey: string;
}) {
  const query = useQuery({
    queryKey: queryKey,
    queryFn: async (): Promise<Array<any>> => {
      const res = await fetchJSONAPI("GET", queryUrl);
      const json = await res.json();
      return json.data;
    },
  });
  const rowValue = row.getValue(fieldKey);

  if (query.isError || query.isLoading) {
    return rowValue;
  }
  let accessorKey = fieldKey;
  if (foreignFieldKey) accessorKey = foreignFieldKey;

  const name = query.data?.find((obj) => obj[accessorKey] === rowValue);
  if (name === undefined) {
    return "Unavailable";
  }
  return name[targetFieldKey] || "Unavailable";
}
