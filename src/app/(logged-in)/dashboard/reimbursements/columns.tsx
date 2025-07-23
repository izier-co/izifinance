"use client";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { fetchJSONAPI } from "@/lib/server-lib";
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
          description: row.getValue("txDescriptionDetails"),
        },
      });

      const approveForm = useForm<ApprovalSchema>({
        resolver: zodResolver(approvalSchema),
        defaultValues: {
          changeReason: row.getValue("txChangeReason"),
        },
      });

      const router = useRouter();
      const [open, setOpen] = useState(false);
      const [approvalError, setApprovalError] = useState("");
      const [descriptionEditError, setDescriptionEditError] = useState("");

      const approvalForm = useForm();

      const _approve = async (data: ApprovalSchema) => {
        const res = await fetchJSONAPI(
          "PUT",
          `/api/v1/reimbursements/${row.getValue("txReimbursementNoteID")}/approve`,
          data
        );

        if (res.status === 200) {
          setOpen(false);
        } else {
          const json = res.message;
          setApprovalError(json.error);
        }
      };

      const _setDescription = async (data: ChangeDescriptionSchema) => {
        const res = await fetchJSONAPI(
          "PUT",
          `/api/v1/reimbursements/${row.getValue("txReimbursementNoteID")}`,
          data
        );

        if (res.status === 200) {
          setOpen(false);
        } else {
          const json = res.message;
          setDescriptionEditError(json.message);
        }
      };

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
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  // prevents weirc closing bug when opening
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  Edit Description
                </DropdownMenuItem>
              </DialogTrigger>
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
                          _setDescription
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
                                <Input className="mb-5" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          {descriptionEditError && (
                            <span>{descriptionEditError}</span>
                          )}
                          <DialogClose asChild>
                            <Button variant="secondary" type="button">
                              Cancel
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button type="submit">Confirm</Button>
                          </DialogClose>
                        </DialogFooter>
                      </form>
                    </Form>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  Approve
                </DropdownMenuItem>
              </DialogTrigger>
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
                        onSubmit={approveForm.handleSubmit(_approve)}
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
                                <Input className="mb-5" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {approvalError && (
                          <span className="text-sm text-red-600">
                            {approvalError}
                          </span>
                        )}
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="secondary" type="button">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button type="submit">Approve</Button>
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
