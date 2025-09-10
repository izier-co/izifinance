"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CommonRow, SortableHeader } from "@/components/sorting-datatable-header";
import { QueryCell } from "./_components/query-cell-component";
import { ReimbursementDropdownMenu } from "./_components/dropdown_menu";
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
    cell: ({ row }) => {
      return <MixedText value={row.getValue("txChangedBy")} />;
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
    cell: ({ row }) => {
      return <MixedText value={row.getValue("txReimbursementNoteID")} />;
    },
  },
  {
    accessorKey: "txDescriptionDetails",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Description" />;
    },
    cell: ({ row }) => {
      return <MixedText value={row.getValue("txDescriptionDetails")} />;
    },
  },
  {
    accessorKey: "txChangeReason",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Change Reason" />;
    },
    cell: ({ row }) => {
      return <MixedText value={row.getValue("txChangeReason")} />;
    },
  },
  {
    accessorKey: "txEmployeeCode",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Employee Code" />;
    },
    cell: ({ row }) => {
      return <MixedText value={row.getValue("txEmployeeCode")} />;
    },
  },
  {
    accessorKey: "txCategoryID",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Category" />;
    },
    cell: ({ row }) => {
      return <QueryCell row={row} queryKey={["get-categories"]} queryUrl="/api/v1/categories" fieldKey="txCategoryID" targetFieldKey="txCategoryName" />;
    },
  },
  {
    accessorKey: "dcNominalReimbursement",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Total Reimbursement" />;
    },
    cell: ({ row }) => {
      return <div className="font-numeric">{row.getValue("dcNominalReimbursement")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      return <ReimbursementDropdownMenu row={row} table={table} />;
    },
  },
];
