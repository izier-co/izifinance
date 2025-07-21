"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
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
  txStatus: z.string(),
  txDescriptionDetails: z.string(),
  txRecipientAccount: z.string(),
  inBankTypeCode: z.number(),
  inRecipientCompanyCode: z.number(),
  txBankAccountCode: z.string(),
  txChangeReason: z.string(),
  txEmployeeCode: z.string(),
  inCategoryID: z.number(),
  dcNominalReimbursement: z.number(),
});

export type Reimbursements = z.infer<typeof payloadSchema>;

export type ReimbursementPayload = {
  daCreatedAt: string;
  daUpdatedAt: string;
  txStatus: string;
  txDescriptionDetails: string;
  txRecipientAccount: string;
  inBankTypeCode: number;
  inRecipientCompanyCode: number;
  txBankAccountCode: string;
  txChangeReason: string;
  txEmployeeCode: string;
  inCategoryID: number;
  dcNominalReimbursement: number;
};

export const columns: ColumnDef<Reimbursements>[] = [
  {
    accessorKey: "daCreatedAt",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Created At" />;
    },
    cell: ({ row }) => {
      const dateFromISO = new Date(row.getValue("daCreatedAt"));
      const localTime = dateFromISO.toLocaleTimeString();
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
      const localTime = dateFromISO.toLocaleTimeString();
      return <div>{localTime}</div>;
    },
  },
  {
    accessorKey: "txStatus",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Status" />;
    },
  },
  {
    accessorKey: "txDescriptionDetails",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Description" />;
    },
  },
  {
    accessorKey: "txRecipientAccount",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Recipient Account" />;
    },
  },
  {
    accessorKey: "inBankTypeCode",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Bank Type" />;
    },
  },
  {
    accessorKey: "inRecipientCompanyCode",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Description" />;
    },
  },
  {
    accessorKey: "txBankAccountCode",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Bank Account Code" />;
    },
  },
  {
    accessorKey: "txChangeReason",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Change Reason" />;
    },
  },
  {
    accessorKey: "txEmployeeCode",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Employee Code" />;
    },
  },
  {
    accessorKey: "inCategoryID",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "dcNominalReimbursement",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Total Reimbursement" />;
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
            <DropdownMenuLabel>Approve/Void</DropdownMenuLabel>
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
