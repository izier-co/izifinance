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
import { useRouter } from "next/navigation";
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

export const payloadSchema = z.object({
  daCreatedAt: z.string(),
  daUpdatedAt: z.string(),
  txReimbursementNoteID: z.string(),
  txStatus: z.string(),
  txDescriptionDetails: z.string(),
  txRecipientAccount: z.string(),
  inBankTypeCode: z.number(),
  inRecipientCompanyCode: z.number(),
  txBankAccountCode: z.string(),
  txChangeReason: z.string(),
  txEmployeeCode: z.string(),
  inCategoryID: z.number(),
  dcNominalReimbursement: z.number(),
});

const approvalSchema = z.object({
  changeReason: z.string(),
});

const changeDescriptionSchema = z.object({
  description: z.string(),
});

type ApprovalSchema = z.infer<typeof approvalSchema>;
type ChangeDescriptionSchema = z.infer<typeof changeDescriptionSchema>;

export type Reimbursements = z.infer<typeof payloadSchema>;

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
    accessorKey: "txReimbursementNoteID",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Reimbursement ID" />;
    },
  },
  {
    accessorKey: "txStatus",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Status" />;
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
  },
  {
    accessorKey: "inRecipientCompanyCode",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Description" />;
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
  },
  {
    accessorKey: "dcNominalReimbursement",
    header: ({ column }) => {
      return <SortableHeader column={column} title="Total Reimbursement" />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const changeDescriptionForm = useForm<ChangeDescriptionSchema>({
        resolver: zodResolver(changeDescriptionSchema),
        defaultValues: {
          description: row.getValue("txDescriptionDetails") || "",
        },
      });

      const approveForm = useForm<ApprovalSchema>({
        resolver: zodResolver(approvalSchema),
        defaultValues: {
          changeReason: row.getValue("txChangeReason") || "",
        },
      });

      const router = useRouter();
      const [approvalModalOpen, setApprovalModalOpen] = useState(false);
      const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);

      const approvalQuery = useMutation({
        mutationKey: ["approve-reimbursement-mutation"],
        mutationFn: _approve,
        onSuccess: () => {
          setApprovalModalOpen(false);
          refreshAndRevalidatePage("/dashboard/reimbursement");
          refreshAndRevalidatePage("/dashboard");
        },
        onError: (error) => {
          approveForm.setError("changeReason", {
            message: error.message,
          });
        },
      });

      const changeDescriptionQuery = useMutation({
        mutationKey: ["change-description-mutation"],
        mutationFn: _setDescription,
        onSuccess: () => {
          setDescriptionModalOpen(false);
          refreshAndRevalidatePage("/dashboard/reimbursement");
        },
        onError: (error) => {
          changeDescriptionForm.setError("description", {
            message: error.message,
          });
        },
      });

      function approve(data: ApprovalSchema) {
        approvalQuery.mutate(data);
      }

      function changeDescription(data: ChangeDescriptionSchema) {
        changeDescriptionQuery.mutate(data);
      }

      function _approvalModalCleanup(open: boolean) {
        if (!open) {
          setApprovalModalOpen(false);
        }
        approveForm.clearErrors();
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
            <Dialog
              open={approvalModalOpen}
              onOpenChange={_approvalModalCleanup}
            >
              <DropdownMenuItem
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
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
