"use client";

import {
  CommonRow,
  SortableHeader,
} from "@/components/sorting-datatable-header";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const payloadSchema = z.object({
  daCreatedAt: z.string(),
  daUpdatedAt: z.string(),
  txName: z.string(),
  inQuantity: z.number(),
  deIndividualPrice: z.number(),
  deTotalPrice: z.number(),
});

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
    accessorKey: "txName",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Name" />;
    },
  },
  {
    accessorKey: "inQuantity",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Quantity" />;
    },
  },
  {
    accessorKey: "deIndividualPrice",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Individual Price" />;
    },
  },
  {
    accessorKey: "deTotalPrice",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Total Price" />;
    },
  },
];
