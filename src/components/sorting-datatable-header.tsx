import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";

export const SortableHeader = ({
  column,
  title,
}: {
  column: Column<object, string>;
  title: string;
}) => {
  const isSorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      className="bg-green"
      onClick={() => column.toggleSorting(isSorted === "asc")}
    >
      <b>{title}</b>
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};
