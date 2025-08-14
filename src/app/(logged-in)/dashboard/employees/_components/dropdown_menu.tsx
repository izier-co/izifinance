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
import { fetchJSONAPI } from "@/lib/lib";
import { refreshAndRevalidatePage } from "@/lib/server-lib";
import { useEmployeeIDQuery } from "@/queries/queries";
import { useMutation } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function GrantAdminDialog({ row }: { row: Row<CommonRow> }) {
  const [error, setError] = useState("");
  const grantAdminQuery = useMutation({
    mutationKey: ["grant-admin"],
    mutationFn: async () => {
      await fetchJSONAPI(
        "PUT",
        `/api/v1/employees/${row.getValue("txEmployeeCode")}/grant-admin`
      );
    },
    onError: (error) => {
      console.error(error);
      setError(error.message);
    },
    onMutate: () => {
      refreshAndRevalidatePage("/dashboard/employees");
    },
  });
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
        {error && (
          <p className="text-sm font-medium text-destructive mb-2">{error}</p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => {
              grantAdminQuery.mutate();
            }}
          >
            {grantAdminQuery.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Grant"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RevokeAdminDialog({ row }: { row: Row<CommonRow> }) {
  const [error, setError] = useState("");
  const revokeAdminQuery = useMutation({
    mutationKey: ["grant-admin"],
    mutationFn: async () => {
      const res = await fetchJSONAPI(
        "PUT",
        `/api/v1/employees/${row.getValue("txEmployeeCode")}/revoke-admin`
      );
      console.log(await res.json());
    },
    onError: (error) => {
      console.error(error);
      setError(error.message);
    },
    onMutate: () => {
      refreshAndRevalidatePage("/dashboard/employees");
    },
  });
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
        {error && (
          <p className="text-sm font-medium text-destructive mb-2">{error}</p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => {
              revokeAdminQuery.mutate();
            }}
          >
            {revokeAdminQuery.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Revoke"
            )}
          </Button>
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
  if (checkAdminQuery.data === row.getValue("txEmployeeCode")) {
    return; // to avoid bugs after setting self not being admin
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
