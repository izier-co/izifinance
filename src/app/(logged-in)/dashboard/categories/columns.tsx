"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  CommonRow,
  SortableHeader,
} from "@/components/sorting-datatable-header";
// import { Categories } from "./schemas";
import { CategoryDropdownMenu } from "./_components/dropdown_menu";

export const columns: ColumnDef<CommonRow>[] = [
  {
    accessorKey: "daCreatedAt",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Created At" />;
    },
    cell: ({ row }) => {
      const dateFromISO = new Date(row.getValue("daCreatedAt"));
      const localTime = dateFromISO.toLocaleString();
      return <div>{localTime}</div>;
    },
  },
  {
    accessorKey: "daUpdatedAt",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Updated At" />;
    },
    cell: ({ row }) => {
      const dateFromISO = new Date(row.getValue("daUpdatedAt"));
      const localTime = dateFromISO.toLocaleString();
      return <div>{localTime}</div>;
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
    cell: ({ row }) => {
      return <CategoryDropdownMenu row={row} />;
    },
  },
];
