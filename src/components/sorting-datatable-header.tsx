import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";

export const SortableHeader = ({
  column,
  title,
}: {
  column: Column<any, any>;
  title: string;
}) => {
  const isSorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(isSorted === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};