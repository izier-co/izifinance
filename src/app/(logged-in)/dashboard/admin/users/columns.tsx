"use client";
<<<<<<< HEAD
import { CommonRow, SortableHeader } from "@/components/sorting-datatable-header";
=======
import {
  CommonRow,
  SortableHeader,
} from "@/components/sorting-datatable-header";
>>>>>>> 3dca31a (Add employees admin page (#3))
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "lucide-react";
import { UserDropdownMenu } from "./_components/dropdown_menu";
import { DateCell } from "@/components/date-cell";
<<<<<<< HEAD
import { MixedText } from "@/components/mixed-text";
=======
>>>>>>> 3dca31a (Add employees admin page (#3))

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
      return <DateCell row={row} valueSource="created_at" />;
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Updated At" />;
    },
    cell: ({ row }) => {
      return <DateCell row={row} valueSource="updated_at" />;
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <SortableHeader column={column} title="User ID" />;
    },
<<<<<<< HEAD
    cell: ({ row }) => {
      return <MixedText value={row.getValue("id")} />;
    },
=======
>>>>>>> 3dca31a (Add employees admin page (#3))
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Email" />;
    },
<<<<<<< HEAD
    cell: ({ row }) => {
      return <MixedText value={row.getValue("email")} />;
    },
=======
>>>>>>> 3dca31a (Add employees admin page (#3))
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
