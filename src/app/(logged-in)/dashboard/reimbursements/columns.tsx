"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal } from "lucide-react";
import { SortableHeader } from "@/components/sorting-datatable-header";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { refreshAndRevalidatePage } from "@/lib/server-lib";
import { fetchJSONAPI } from "@/lib/lib";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { useEmployeeIDQuery } from "@/queries/queries";
import {
  Reimbursements,
  ChangeDescriptionSchema,
  processSchema,
  changeDescriptionSchema,
  ApprovalSchema,
  RejectSchema,
  VoidSchema,
} from "./schemas";
import { QueryCell } from "./_components/query-cell-component";

export const columns: ColumnDef<Reimbursements>[] = [
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
    accessorKey: "inBankTypeCode",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Bank Type" />;
    },
    cell: ({ row }) => {
      return (
        <QueryCell
          row={row}
          queryKey={["get-banks"]}
          queryUrl="/api/v1/banks"
          fieldKey="inBankTypeCode"
          targetFieldKey="txBankName"
        />
      );
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
    accessorKey: "txBankAccountCode",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Bank Account Code" />;
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
    cell: ({ row, table }) => {
      const changeDescriptionForm = useForm<ChangeDescriptionSchema>({
        resolver: zodResolver(changeDescriptionSchema),
        defaultValues: {
          description: row.getValue("txDescriptionDetails") || "",
        },
      });

      const approveForm = useForm<ApprovalSchema>({
        resolver: zodResolver(processSchema),
        defaultValues: {
          changeReason: row.getValue("txChangeReason") || "",
        },
      });

      const voidForm = useForm<VoidSchema>({
        resolver: zodResolver(processSchema),
        defaultValues: {
          changeReason: row.getValue("txChangeReason") || "",
        },
      });

      const rejectForm = useForm<RejectSchema>({
        resolver: zodResolver(processSchema),
        defaultValues: {
          changeReason: row.getValue("txChangeReason") || "",
        },
      });

      const router = useRouter();
      const pathname = usePathname();
      const [approvalModalOpen, setApprovalModalOpen] = useState(false);
      const [rejectModalOpen, setRejectModalOpen] = useState(false);
      const [voidModalOpen, setVoidModalOpen] = useState(false);
      const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);

      const checkAdminQuery = useEmployeeIDQuery();

      const isAdmin: boolean =
        checkAdminQuery.isSuccess && checkAdminQuery.data;
      const isApproved: boolean = row.getValue("txStatus") === "Approved";
      const isRejected: boolean = row.getValue("txStatus") === "Rejected";
      const isVoid: boolean = row.getValue("txStatus") === "Void";
      const isChanged: boolean = isApproved || isRejected || isVoid;

      const approvalQuery = useMutation({
        mutationKey: ["approve-reimbursement-mutation"],
        mutationFn: _approve,
        onSuccess: () => {
          setApprovalModalOpen(false);
          refreshData();
          refreshAndRevalidatePage("/dashboard");
        },
        onError: (error) => {
          approveForm.setError("changeReason", {
            message: error.message,
          });
        },
      });

      const rejectQuery = useMutation({
        mutationKey: ["reject-reimbursement-mutation"],
        mutationFn: _reject,
        onSuccess: () => {
          setRejectModalOpen(false);
          refreshData();
          refreshAndRevalidatePage("/dashboard");
        },
        onError: (error) => {
          rejectForm.setError("changeReason", {
            message: error.message,
          });
        },
      });

      const voidQuery = useMutation({
        mutationKey: ["void-reimbursement-mutation"],
        mutationFn: _void,
        onSuccess: () => {
          setVoidModalOpen(false);
          refreshData();
          refreshAndRevalidatePage("/dashboard");
        },
        onError: (error) => {
          voidForm.setError("changeReason", {
            message: error.message,
          });
        },
      });

      const changeDescriptionQuery = useMutation({
        mutationKey: ["change-description-mutation"],
        mutationFn: _setDescription,
        onSuccess: () => {
          setDescriptionModalOpen(false);
          refreshData();
        },
        onError: (error) => {
          changeDescriptionForm.setError("description", {
            message: error.message,
          });
        },
      });

      function refreshData() {
        window.location.reload();
      }
      function approve(data: ApprovalSchema) {
        approvalQuery.mutate(data);
      }

      function voidNote(data: VoidSchema) {
        voidQuery.mutate(data);
      }

      function rejectNote(data: RejectSchema) {
        rejectQuery.mutate(data);
      }

      function changeDescription(data: ChangeDescriptionSchema) {
        changeDescriptionQuery.mutate(data);
      }
      // refactor merge
      function _approvalModalCleanup(open: boolean) {
        if (!open) {
          setApprovalModalOpen(false);
        }
        approveForm.clearErrors();
      }
      function _voidModalCleanup(open: boolean) {
        if (!open) {
          setVoidModalOpen(false);
        }
        voidForm.clearErrors();
      }

      function _rejectModalCleanup(open: boolean) {
        if (!open) {
          setRejectModalOpen(false);
        }
        rejectForm.clearErrors();
      }

      function _descriptionModalCleanup(open: boolean) {
        if (!open) {
          setDescriptionModalOpen(false);
        }
        changeDescriptionForm.clearErrors();
      }
      async function _approve(data: ApprovalSchema) {
        await fetchJSONAPI(
          "PUT",
          `/api/v1/reimbursements/${row.getValue("txReimbursementNoteID")}/approve`,
          data
        );
      }

      async function _reject(data: RejectSchema) {
        await fetchJSONAPI(
          "PUT",
          `/api/v1/reimbursements/${row.getValue("txReimbursementNoteID")}/reject`,
          data
        );
      }

      async function _void(data: VoidSchema) {
        await fetchJSONAPI(
          "PUT",
          `/api/v1/reimbursements/${row.getValue("txReimbursementNoteID")}/void`,
          data
        );
      }

      async function _setDescription(data: ChangeDescriptionSchema) {
        await fetchJSONAPI(
          "PUT",
          `/api/v1/reimbursements/${row.getValue("txReimbursementNoteID")}`,
          data
        );
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
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  `/dashboard/reimbursements/${row.getValue("txReimbursementNoteID")}`
                );
              }}
            >
              View Details
            </DropdownMenuItem>
            <Dialog
              open={descriptionModalOpen}
              onOpenChange={_descriptionModalCleanup}
            >
              <DropdownMenuItem
                // prevents weird closing bug when opening
                onSelect={(e) => {
                  e.preventDefault();
                  setDescriptionModalOpen(true);
                }}
              >
                Edit Description
              </DropdownMenuItem>
              <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Edit Description</DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="grid flex-1 gap-2">
                    <Form {...changeDescriptionForm}>
                      <form
                        id="change-description-form"
                        onSubmit={changeDescriptionForm.handleSubmit(
                          changeDescription
                        )}
                      >
                        <FormField
                          control={changeDescriptionForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="capitalize">
                                Description :
                              </FormLabel>
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
                            {changeDescriptionQuery.isPending ? (
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
            {/* admin only block */}
            {isAdmin && (
              <>
                <Dialog
                  open={approvalModalOpen}
                  onOpenChange={_approvalModalCleanup}
                >
                  <DropdownMenuItem
                    className={
                      isChanged ? "pointer-events-none opacity-50" : ""
                    }
                    onSelect={(e) => {
                      e.preventDefault();
                      setApprovalModalOpen(true);
                    }}
                  >
                    Approve
                  </DropdownMenuItem>
                  <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                      <DialogTitle>Confirmation</DialogTitle>
                      <DialogDescription>
                        Are you sure to Approve this note?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                      <div className="grid flex-1 gap-2">
                        <Form {...approveForm}>
                          <form
                            id="approval-form"
                            onSubmit={approveForm.handleSubmit(approve)}
                          >
                            <FormField
                              control={approveForm.control}
                              name="changeReason"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="capitalize">
                                    Change Reason :
                                  </FormLabel>
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
                                {approvalQuery.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Approve"
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={rejectModalOpen}
                  onOpenChange={_rejectModalCleanup}
                >
                  <DropdownMenuItem
                    className={
                      isChanged ? "pointer-events-none opacity-50" : ""
                    }
                    onSelect={(e) => {
                      e.preventDefault();
                      setRejectModalOpen(true);
                    }}
                  >
                    Reject
                  </DropdownMenuItem>
                  <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                      <DialogTitle>Confirmation</DialogTitle>
                      <DialogDescription>
                        Are you sure to Reject this note?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                      <div className="grid flex-1 gap-2">
                        <Form {...rejectForm}>
                          <form
                            id="reject-form"
                            onSubmit={rejectForm.handleSubmit(rejectNote)}
                          >
                            <FormField
                              control={rejectForm.control}
                              name="changeReason"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="capitalize">
                                    Change Reason :
                                  </FormLabel>
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
                                {rejectQuery.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Reject"
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
            <Dialog open={voidModalOpen} onOpenChange={_voidModalCleanup}>
              <DropdownMenuItem
                className={isChanged ? "pointer-events-none opacity-50" : ""}
                onSelect={(e) => {
                  e.preventDefault();
                  setVoidModalOpen(true);
                }}
              >
                Void
              </DropdownMenuItem>
              <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Confirmation</DialogTitle>
                  <DialogDescription>
                    Are you sure to Void this note?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="grid flex-1 gap-2">
                    <Form {...voidForm}>
                      <form
                        id="void-form"
                        onSubmit={voidForm.handleSubmit(voidNote)}
                      >
                        <FormField
                          control={voidForm.control}
                          name="changeReason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="capitalize">
                                Change Reason :
                              </FormLabel>
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
                            {voidQuery.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Void"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
