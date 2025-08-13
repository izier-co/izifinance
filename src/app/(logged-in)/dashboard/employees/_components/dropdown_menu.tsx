"use client";
import { CommonRow } from "@/components/sorting-datatable-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useEmployeeIDQuery } from "@/queries/queries";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

function GrantAdminDialog({ row }: { row: Row<CommonRow> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          Grant Admin Access
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogDescription>
          Are you sure to grant admin access to {row.getValue("txFullName")}
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button">Grant</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RevokeAdminDialog({ row }: { row: Row<CommonRow> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          Revoke Admin Access
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogDescription>
          Are you sure to revoke admin access to {row.getValue("txFullName")}
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button">Revoke</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GrantRevokeDialogMenu({ row }: { row: Row<CommonRow> }) {
  const checkAdminQuery = useEmployeeIDQuery();
  const isAdmin = checkAdminQuery.isSuccess && checkAdminQuery.data;
  if (!isAdmin) {
    return;
  }
  const adminStatus = row.getValue("boHasAdminAccess") as boolean;
  if (adminStatus === true) {
    return <RevokeAdminDialog row={row} />;
  } else {
    return <GrantAdminDialog row={row} />;
  }
}

export function EmployeeDropdownMenu({ row }: { row: Row<CommonRow> }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            router.push(
              `/dashboard/employees/${row.getValue("txEmployeeCode")}`
            );
          }}
        >
          View Details
        </DropdownMenuItem>
        <GrantRevokeDialogMenu row={row} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
