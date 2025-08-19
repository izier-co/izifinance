"use client";
import {
  CommonRow,
  SortableHeader,
} from "@/components/sorting-datatable-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "lucide-react";
import { UserDropdownMenu } from "./_components/dropdown_menu";

type RowWithMetadata = {
  user_metadata?: {
    profile_picture?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export const columns: ColumnDef<CommonRow>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Created At" />;
    },
    cell: ({ row }) => {
      const dateFromISO = new Date(row.getValue("created_at"));
      const localTime = dateFromISO.toLocaleString();
      return <div>{localTime}</div>;
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Updated At" />;
    },
    cell: ({ row }) => {
      const dateFromISO = new Date(row.getValue("updated_at"));
      const localTime = dateFromISO.toLocaleString();
      return <div>{localTime}</div>;
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <SortableHeader column={column} title="User ID" />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Email" />;
    },
  },
  {
    accessorKey: "profile_picture",
    accessorFn: (row: RowWithMetadata) => row.user_metadata?.profile_picture,
    id: "profile_picture",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Profile Picture" />;
    },
    cell: ({ row }) => {
      const url = row.getValue("profile_picture") as string;
      return (
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={url} alt="Avatar Image" />
          <AvatarFallback className="rounded-lg">
            <User />
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <UserDropdownMenu row={row} />;
    },
  },
];
