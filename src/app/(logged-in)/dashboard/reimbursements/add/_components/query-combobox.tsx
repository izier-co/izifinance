import { ComboboxItem, FormCombobox } from "@/components/form-combobox";
import { UseQueryResult } from "@tanstack/react-query";

export function QueryCombobox({
  value,
  onChange,
  query,
}: {
  value: string;
  onChange: (_: string) => void;
  query: UseQueryResult;
}) {
  if (query.isLoading) {
    return (
      <FormCombobox value={value} onChange={onChange} items={[]} loading />
    );
  }
  if (query.isError) {
    console.error(query.error);
    return <FormCombobox value={value} onChange={onChange} items={[]} error />;
  }
  return (
    <FormCombobox
      value={value}
      onChange={onChange}
      items={query.data as Array<ComboboxItem>}
    />
  );
}
