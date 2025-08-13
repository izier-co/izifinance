"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  CommonRow,
  SortableHeader,
} from "@/components/sorting-datatable-header";
import { QueryCell } from "./_components/query-cell-component";
import { ReimbursementDropdownMenu } from "./_components/dropdown_menu";

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
    accessorKey: "txStatus",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Status" />;
    },
  },
  {
    accessorKey: "txChangedBy",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Changed By" />;
    },
  },
  {
    accessorKey: "txCurrency",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Currency" />;
    },
  },
  {
    accessorKey: "txReimbursementNoteID",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Reimbursement ID" />;
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
    accessorKey: "inRecipientCompanyCode",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Recipient Company" />;
    },
    cell: ({ row }) => {
      return (
        <QueryCell
          row={row}
          queryKey={["get-companies"]}
          queryUrl="/api/v1/companies"
          fieldKey="inRecipientCompanyCode"
          foreignFieldKey="inCompanyCode"
          targetFieldKey="txCompanyName"
        />
      );
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
      return <SortableHeader column={column} title="Category" />;
    },
    cell: ({ row }) => {
      return (
        <QueryCell
          row={row}
          queryKey={["get-categories"]}
          queryUrl="/api/v1/categories"
          fieldKey="inCategoryID"
          targetFieldKey="txCategoryName"
        />
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
      return <ReimbursementDropdownMenu row={row} />;
    },
  },
];
