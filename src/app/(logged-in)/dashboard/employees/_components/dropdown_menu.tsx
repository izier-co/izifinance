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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fetchJSONAPI } from "@/lib/lib";
import { refreshAndRevalidatePage } from "@/lib/server-lib";
import { useEmployeeIDQuery } from "@/queries/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Column, Row, RowData, Table } from "@tanstack/react-table";
import { Loader2, MoreHorizontal, Star, StarOff, View } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> {
    column?: Column<TData>;
    triggerRefetch: () => void;
  }
}

function GrantAdminDialog({ row, table }: { row: Row<CommonRow>; table: Table<CommonRow> }) {
  const [error, setError] = useState("");
  const grantAdminQuery = useMutation({
    mutationKey: ["grant-admin"],
    mutationFn: async () => {
      const res = await fetchJSONAPI(
        "PUT",
        `/api/v1/employees/${row.getValue("txEmployeeCode")}/grant-admin`
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error.message);
    },
    onSuccess: () => {
      refreshAndRevalidatePage("/dashboard/employees");
      table.options.meta?.triggerRefetch();
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
          <Star className="text-[var(--sidebar-accent-foreground)]" />
          Grant Admin Access
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogDescription>Are you sure to grant admin access to {row.getValue("txFullName")}</DialogDescription>
        {error && <p className="text-sm font-medium text-destructive mb-2">{error}</p>}
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
            {grantAdminQuery.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Grant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RevokeAdminDialog({ row, table }: { row: Row<CommonRow>; table: Table<CommonRow> }) {
  const [error, setError] = useState("");
  const revokeAdminQuery = useMutation({
    mutationKey: ["grant-admin"],
    mutationFn: async () => {
      const res = await fetchJSONAPI(
        "PUT",
        `/api/v1/employees/${row.getValue("txEmployeeCode")}/revoke-admin`
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error.message);
    },
    onSuccess: () => {
      refreshAndRevalidatePage("/dashboard/employees");
      table.options.meta?.triggerRefetch();
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
          <StarOff className="text-[var(--sidebar-accent-foreground)]" />
          Revoke Admin Access
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogDescription>Are you sure to revoke admin access to {row.getValue("txFullName")}</DialogDescription>
        {error && <p className="text-sm font-medium text-destructive mb-2">{error}</p>}
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
            {revokeAdminQuery.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Revoke"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ActivateEmployeeDialog({
  row,
  table,
}: {
  row: Row<CommonRow>;
  table: Table<CommonRow>;
}) {
  const [error, setError] = useState("");
  const query = useMutation({
    mutationKey: ["activate-employee"],
    mutationFn: async () => {
      const res = await fetchJSONAPI(
        "PUT",
        `/api/v1/employees/${row.getValue("txEmployeeCode")}/enable`
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error.message);
    },
    onSuccess: () => {
      refreshAndRevalidatePage("/dashboard/employees");
      table.options.meta?.triggerRefetch();
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
          Activate Employee
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogDescription>
          Are you sure to activate employee status of{" "}
          {row.getValue("txFullName")}
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
              query.mutate();
            }}
          >
            {query.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Activate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeactivateEmployeeDialog({
  row,
  table,
}: {
  row: Row<CommonRow>;
  table: Table<CommonRow>;
}) {
  const [error, setError] = useState("");
  const query = useMutation({
    mutationKey: ["deactivate-employee"],
    mutationFn: async () => {
      const res = await fetchJSONAPI(
        "PUT",
        `/api/v1/employees/${row.getValue("txEmployeeCode")}/disable`
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error.message);
    },
    onSuccess: () => {
      refreshAndRevalidatePage("/dashboard/employees");
      table.options.meta?.triggerRefetch();
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
          Deactivate Employee
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogDescription>
          Are you sure to deactivate employee status of{" "}
          {row.getValue("txFullName")}
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
              query.mutate();
            }}
          >
            {query.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Deactivate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GrantRevokeDialogMenu({
  row,
  table,
}: {
  row: Row<CommonRow>;
  table: Table<CommonRow>;
}) {
  const checkAdminQuery = useEmployeeIDQuery();
  const isAdmin: boolean = checkAdminQuery.isSuccess && checkAdminQuery.data.adminStatus;
  if (!isAdmin) {
    return;
  }
  if (checkAdminQuery.data === row.getValue("txEmployeeCode")) {
    return; // to avoid bugs after setting self not being admin
  }
  const adminStatus = row.getValue("boHasAdminAccess") as boolean;
  if (adminStatus === true) {
    return <RevokeAdminDialog row={row} table={table} />;
  } else {
    return <GrantAdminDialog row={row} table={table} />;
  }
}

function ActivateDeactivateDialogMenu({
  row,
  table,
}: {
  row: Row<CommonRow>;
  table: Table<CommonRow>;
}) {
  const checkAdminQuery = useEmployeeIDQuery();
  const isAdmin: boolean =
    checkAdminQuery.isSuccess && checkAdminQuery.data.adminStatus;
  if (!isAdmin) {
    return;
  }
  if (checkAdminQuery.data === row.getValue("txEmployeeCode")) {
    return; // to avoid bugs after setting self not being admin
  }
  const activateStatus = row.getValue("status") as Array<boolean>;
  if (activateStatus.every((v) => v === true)) {
    return <DeactivateEmployeeDialog row={row} table={table} />;
  } else if (activateStatus.every((v) => v === false)) {
    return <ActivateEmployeeDialog row={row} table={table} />;
  } else {
    return <DropdownMenuItem> Something went wrong </DropdownMenuItem>;
  }
}

function SetUUIDDialog({
  row,
  table,
}: {
  row: Row<CommonRow>;
  table: Table<CommonRow>;
}) {
  const userUUIDSchema = z.object({
    uuid: z.uuid("Invalid UUID"),
  });

  type UserUUIDSchema = z.infer<typeof userUUIDSchema>;

  const [modalOpen, setModalOpen] = useState(false);

  const setUUIDForm = useForm<UserUUIDSchema>({
    resolver: zodResolver(userUUIDSchema),
    defaultValues: {
      uuid: "",
    },
  });

  const setUUIDMutation = useMutation({
    mutationKey: ["uuid-mutation"],
    mutationFn: setUUIDUpdate,
    onSuccess: () => {
      setModalOpen(false);
      table.options.meta?.triggerRefetch();
    },
    onError: (error) => {
      setUUIDForm.setError("root", {
        message: error.message,
      });
    },
  });

  function setUUID(data: UserUUIDSchema) {
    setUUIDMutation.mutate(data);
  }

  function _setUUIDCleanup(open: boolean) {
    if (!open) {
      setModalOpen(false);
    }
    setUUIDForm.clearErrors();
  }

  async function setUUIDUpdate(data: UserUUIDSchema) {
    const res = await fetchJSONAPI(
      "PUT",
      `/api/v1/employees/${row.getValue("txEmployeeCode")}/set-uuid`,
      data
    );
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error);
    }
  }

  const checkAdminQuery = useEmployeeIDQuery();
  const isAdmin: boolean =
    checkAdminQuery.isSuccess && checkAdminQuery.data.adminStatus;

  if (!isAdmin) {
    return;
  }
  return (
    <Dialog open={modalOpen} onOpenChange={_setUUIDCleanup}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setModalOpen(true);
          }}
        >
          Add User ID
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogTitle>Confirmation</DialogTitle>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Form {...setUUIDForm}>
              <form
                id="change-description-form"
                onSubmit={setUUIDForm.handleSubmit(setUUID)}
              >
                <FormField
                  control={setUUIDForm.control}
                  name="uuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">User ID :</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="my-2">
                  <DialogClose asChild>
                    <Button variant="secondary" type="button">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">
                    {setUUIDMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EmployeeDropdownMenu({
  row,
  table,
}: {
  row: Row<CommonRow>;
  table: Table<CommonRow>;
}) {
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
            router.push(`/dashboard/employees/${row.getValue("txEmployeeCode")}`);
          }}
        >
          <View className="text-[var(--sidebar-accent-foreground)]" />
          View Details
        </DropdownMenuItem>
        <GrantRevokeDialogMenu row={row} table={table} />
        <ActivateDeactivateDialogMenu row={row} table={table} />
        <SetUUIDDialog row={row} table={table} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
