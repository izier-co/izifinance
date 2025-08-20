"use client";

import {
  CommonRow,
  SortableHeader,
} from "@/components/sorting-datatable-header";
import { ColumnDef } from "@tanstack/react-table";
import { EmployeeDropdownMenu } from "./_components/dropdown_menu";
import { booleanToString } from "@/lib/lib";
import { DateCell } from "@/components/date-cell";

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
    accessorKey: "daJoinDate",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Joined At" />;
    },
    cell: ({ row }) => {
      return <DateCell row={row} valueSource="daJoinDate" />;
    },
  },
  {
    accessorKey: "txFullName",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Full Name" />;
    },
  },
  {
    accessorKey: "boMarriageStatus",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Marriage Status" />;
    },
    cell: ({ row }) => {
      const booleanData = row.getValue("boMarriageStatus") as boolean;
      return booleanToString(booleanData, "Married", "Unmarried");
    },
  },
  {
    accessorKey: "inRoleCode",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Role Code" />;
    },
  },
  {
    id: "status",
    accessorFn: (row) => [row.boActive, row.boStatus],
    header: ({ column }) => {
      return <SortableHeader column={column} title="Employment Status" />;
    },
    cell: (info) => {
      const arr = info.getValue() as Array<boolean>;
      if (arr[0] !== arr[1]) {
        return <>Error</>;
      }

      return booleanToString(arr[0], "Active", "Inactive");
    },
  },
  {
    accessorKey: "txEmployeeCode",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Employee Code" />;
    },
  },
  {
    accessorKey: "txPhoneNumber",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Phone Number" />;
    },
  },
  {
    accessorKey: "txEmailAddress",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Email Address" />;
    },
  },
  {
    accessorKey: "inBankTypeCode",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Bank Type" />;
    },
  },
  {
    accessorKey: "txBankAccountNumber",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Bank Account Number" />;
    },
  },
  {
    accessorKey: "boHasAdminAccess",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Admin Access" />;
    },
    cell: ({ row }) => {
      const booleanData = row.getValue("boHasAdminAccess") as boolean;
      return booleanToString(booleanData);
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      return <EmployeeDropdownMenu table={table} row={row} />;
    },
  },
];
