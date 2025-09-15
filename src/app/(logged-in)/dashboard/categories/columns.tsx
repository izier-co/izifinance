"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CommonRow, SortableHeader } from "@/components/sorting-datatable-header";
import { CategoryDropdownMenu } from "./_components/dropdown_menu";
import { DateCell } from "@/components/date-cell";
import { MixedText } from "@/components/mixed-text";

export const columns: ColumnDef<CommonRow>[] = [
  {
    accessorKey: "daCreatedAt",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Created At" />;
    },
    cell: ({ row }) => {
      return <DateCell row={row} valueSource="daCreatedAt" />;
    },
  },
  {
    accessorKey: "daUpdatedAt",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Updated At" />;
    },
    cell: ({ row }) => {
      return <DateCell row={row} valueSource="daUpdatedAt" />;
    },
  },
  {
    accessorKey: "txCategoryID",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Category ID" />;
    },
    cell: ({ row }) => {
      return <MixedText value={row.getValue("txCategoryID")} />;
    },
  },
  {
    accessorKey: "txCategoryName",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Category Name" />;
    },
  },
  {
    accessorKey: "txCategoryDescription",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Category Description" />;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      return <CategoryDropdownMenu row={row} table={table} />;
    },
  },
];
