"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { z } from "zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { SortableHeader } from "@/components/sorting-datatable-header";

export const payloadSchema = z.object({
  daCreatedAt: z.string(),
  daUpdatedAt: z.string(),
  inCategoryID: z.number(),
  txCategoryName: z.string(),
  txCategoryDescription: z.string(),
});

export type Categories = z.infer<typeof payloadSchema>;

export const columns: ColumnDef<Categories>[] = [
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
    accessorKey: "inCategoryID",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Category ID" />;
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
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Delete</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
