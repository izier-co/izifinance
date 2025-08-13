"use client";

import {
  CommonRow,
  SortableHeader,
} from "@/components/sorting-datatable-header";
import { ColumnDef } from "@tanstack/react-table";
import { EmployeeDropdownMenu } from "./_components/dropdown_menu";

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
    accessorKey: "daJoinDate",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Joined At" />;
    },
    cell: ({ row }) => {
      const dateFromISO = new Date(row.getValue("daJoinDate"));
      const localTime = dateFromISO.toDateString();
      return <div>{localTime}</div>;
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
      const booleanData = row.getValue("boMarriageStatus");
      if (booleanData === true) {
        return <>Married</>;
      }
      return <>Not Married</>;
    },
  },
  {
    accessorKey: "inRoleCode",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Role Code" />;
    },
  },
  {
    accessorKey: "boActive", // and boStatus
    header: ({ column }) => {
      return <SortableHeader column={column} title="Employment Status" />;
    },
    cell: ({ row }) => {
      const booleanData = row.getValue("boActive");
      if (booleanData === true) {
        return <>Active</>;
      }
      return <>Inactive</>;
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
      const booleanData = row.getValue("boActive");
      if (booleanData === true) {
        return <>True</>;
      }
      return <>False</>;
    },
  },
  {
    id: "actions",
    cell: ({}) => {
      return <EmployeeDropdownMenu />;
    },
  },
];
