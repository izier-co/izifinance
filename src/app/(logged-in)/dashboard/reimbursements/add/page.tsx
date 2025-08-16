"use client";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { refreshAndRevalidatePage } from "@/lib/server-lib";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { FormCombobox, ComboboxItem } from "@/components/form-combobox";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addReimbursement, useCategoryQuery } from "./_queries/queries";
import { QueryCombobox } from "./_components/query-combobox";
import {
  reimbursementSchema,
  reimbursementItemSchema,
  type ReimbursementItemSchema,
  type ReimbursementSchema,
} from "./schemas";
import { useEmployeeIDQuery } from "@/queries/queries";

const currencies: Array<ComboboxItem> = [
  {
    value: "IDR",
    label: "IDR",
  },
  {
    value: "USD",
    label: "USD",
  },
  {
    value: "CNY",
    label: "CNY",
  },
];

export default function Page() {
  const reimbursementForm = useForm({
    resolver: zodResolver(reimbursementSchema),
    defaultValues: {
      txDescriptionDetails: "",
      txCurrency: "",
    },
  });

  const reimbursementItemForm = useForm({
    resolver: zodResolver(reimbursementItemSchema),
    defaultValues: {
      txName: "",
      inQuantity: 0,
      deIndividualPrice: 0,
    },
  });

  const [items, setItems] = useState<ReimbursementItemSchema[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  function _setReimbursementRootError(message: string) {
    reimbursementForm.setError("root", {
      message: message,
    });
  }

  function addReimbursementItem(data: ReimbursementItemSchema) {
    setItems([...items, data]);
    setOpen(false);
  }

  function deleteItem(data: ReimbursementItemSchema) {
    setItems(items.filter((item) => item.uid !== data.uid));
  }

  function _reimbursementItemsCleanupForm() {
    reimbursementItemForm.clearErrors();
  }
  function handleDialogChange(isOpen: boolean) {
    reimbursementItemForm.reset();
    setOpen(isOpen);
    if (isOpen === false) {
      _reimbursementItemsCleanupForm();
    }
  }

  const categoryComboboxQuery = useCategoryQuery();
  const getEmpIDQuery = useEmployeeIDQuery();

  const submitQuery = useMutation({
    mutationKey: ["reimbursement-send-mutation"],
    mutationFn: addReimbursement,
    onSuccess: () => {
      refreshAndRevalidatePage("/dashboard/reimbursement");
      refreshAndRevalidatePage("/");
      reimbursementForm.reset();
      setItems([]);
    },
    onError: (error) => {
      _setReimbursementRootError(error.message);
    },
  });

  function submitReimbursement(reimbursementData: ReimbursementSchema) {
    if (items.length === 0) {
      _setReimbursementRootError("Reimbursement Items can't be empty");
      return;
    }

    if (getEmpIDQuery.error) {
      _setReimbursementRootError(getEmpIDQuery.error.message);
      return;
    }
    const empID = getEmpIDQuery.data;
    submitQuery.mutate({
      reimbursementData: reimbursementData,
      empID: empID?.empID,
      items: items,
    });
  }

  return (
    <div className="flex flex-row">
      <div className="w-1/2">
        <h1 className="">Add Reimbursement</h1>
        <Form {...reimbursementForm}>
          <form
            id="reimbursement-form"
            onSubmit={reimbursementForm.handleSubmit(submitReimbursement)}
          >
            <FormField
              control={reimbursementForm.control}
              name="txDescriptionDetails"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="capitalize">Description :</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={reimbursementForm.control}
              name="txCurrency"
              render={({ field }) => {
                return (
                  <FormItem className="my-3">
                    <FormLabel className="capitalize">Currency :</FormLabel>
                    <FormControl>
                      <FormCombobox
                        value={field.value}
                        onChange={field.onChange}
                        items={currencies}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={reimbursementForm.control}
              name="inCategoryID"
              render={({ field }) => {
                return (
                  <FormItem className="my-3">
                    <FormLabel className="capitalize">Category :</FormLabel>
                    <FormControl>
                      <QueryCombobox
                        value={field.value as string}
                        onChange={field.onChange}
                        query={categoryComboboxQuery}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {reimbursementForm.formState.errors.root?.message && (
              <p className="text-sm font-medium text-destructive mb-2">
                {reimbursementForm.formState.errors.root.message}
              </p>
            )}
            <Button type="submit" disabled={submitQuery.isPending}>
              {submitQuery.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Add Reimbursement"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div className="w-1/2 px-6">
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger className="flex" asChild>
            <Button className="ml-auto mb-2">Add Items</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Items</DialogTitle>
            </DialogHeader>
            <Form {...reimbursementItemForm}>
              <form
                id="reimbursement-item-form"
                onSubmit={reimbursementItemForm.handleSubmit(
                  addReimbursementItem
                )}
              >
                <FormField
                  control={reimbursementItemForm.control}
                  name="txName"
                  render={({ field }) => (
                    <FormItem className="my-3">
                      <FormLabel className="capitalize">Name :</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={reimbursementItemForm.control}
                  name="inQuantity"
                  render={({ field }) => (
                    <FormItem className="my-3">
                      <FormLabel className="capitalize">Quantity :</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? 0 : Number(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={reimbursementItemForm.control}
                  name="deIndividualPrice"
                  render={({ field }) => (
                    <FormItem className="my-3">
                      <FormLabel className="capitalize">
                        Price per item :
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? 0 : Number(value));
                          }}
                        />
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
                  <Button type="submit">Add Items</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        {items.map((item) => {
          return (
            <Card key={item.uid}>
              <CardHeader>
                <CardTitle>{item.txName}</CardTitle>
                <CardDescription>
                  {item.deIndividualPrice} / item
                </CardDescription>
                <CardAction>Qty : {item.inQuantity}</CardAction>
              </CardHeader>
              <CardContent className="text-xl text-bold">
                <div className="flex justify-between ">
                  <div>{item.deTotalPrice}</div>
                  <div>
                    <Button
                      onClick={() => {
                        deleteItem(item);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
