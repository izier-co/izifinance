"use client";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal } from "lucide-react";
import { SortableHeader } from "@/components/sorting-datatable-header";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { fetchJSONAPI } from "@/lib/lib";
import { useState } from "react";
import { refreshAndRevalidatePage } from "@/lib/server-lib";

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
      const [errorMessage, setErrorMessage] = useState();
      const [loading, setLoading] = useState(false);
      async function _deleteCategory() {
        setLoading(true);
        const res = await fetchJSONAPI(
          "DELETE",
          `/api/v1/categories/${row.getValue("inCategoryID")}`
        );
        setLoading(false);
        if (res.status === 200) {
          refreshAndRevalidatePage("/categories");
        } else {
          const json = await res.json();
          setErrorMessage(json.error);
        }
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  // prevents weirc closing bug when opening
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Confirmation</DialogTitle>
                  <DialogDescription>
                    Are you sure that you wanted to delete this?
                  </DialogDescription>
                </DialogHeader>
                {errorMessage && (
                  <p className="text-sm font-medium text-destructive mb-2">
                    {errorMessage}
                  </p>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary" type="button">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="button" onClick={_deleteCategory}>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
