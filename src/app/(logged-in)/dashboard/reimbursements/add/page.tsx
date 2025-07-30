"use client";
import constValues from "@/lib/constants";
import { fetchJSONAPI, isValidInt } from "@/lib/lib";
import z from "zod";
import { supabase } from "@supabase-config";

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
import { getCookies, refreshAndRevalidatePage } from "@/lib/server-lib";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
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

const reimbursementSchema = z.object({
  txDescriptionDetails: z.string().max(constValues.maxTextLength),
  txRecipientAccount: z
    .string()
    .max(constValues.maxBankCodeLength, "Code too long")
    .refine((val) => isValidInt(val), "Must be Valid integer"),
  inBankTypeCode: z.coerce
    .number()
    .positive("Must use positive value")
    .int("Integer values only"),
  inRecipientCompanyCode: z.coerce
    .number()
    .positive("Must use positive value")
    .int("Integer values only"),
  txBankAccountCode: z
    .string()
    .max(constValues.maxBankCodeLength, "Code too long")
    .refine((val) => isValidInt(val), "Must be Valid integer"),
  inCategoryID: z.coerce
    .number()
    .positive("Must use positive value")
    .int("Integer values only"),
});

const reimbursementItemSchema = z
  .object({
    txName: z.string().max(constValues.maxTextLength, "Name too Long!"),
    inQuantity: z
      .number()
      .positive("Must use positive value")
      .int("Integer values only"),
    deIndividualPrice: z.number().positive("Must use positive value"),
    txCurrency: z
      .string()
      .length(
        constValues.currencyCodeStringLength,
        "Must be valid currency string"
      )
      .transform((str) => str.toUpperCase()),
  })
  .transform((data) => ({
    ...data,
    deTotalPrice: data.deIndividualPrice * data.inQuantity,
    uid: crypto.randomUUID(),
  }));

type ReimbursementSchema = z.infer<typeof reimbursementSchema>;
type ReimbursementItemSchema = z.infer<typeof reimbursementItemSchema>;

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
      txRecipientAccount: "",
      inBankTypeCode: 0,
      inRecipientCompanyCode: 0,
      txBankAccountCode: "",
    },
  });

  const reimbursementItemForm = useForm({
    resolver: zodResolver(reimbursementItemSchema),
    defaultValues: {
      txName: "",
      inQuantity: 0,
      deIndividualPrice: 0,
      txCurrency: "",
    },
  });

  const [items, setItems] = useState<ReimbursementItemSchema[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Array<ComboboxItem>>([]);
  const [banks, setBanks] = useState<Array<ComboboxItem>>([]);
  const [companies, setCompanies] = useState<Array<ComboboxItem>>([]);

  function _setReimbursementRootError(message: string) {
    reimbursementForm.setError("root", {
      message: message,
    });
  }

  async function addReimbursement(reimbursementData: ReimbursementSchema) {
    if (items.length === 0) {
      _setReimbursementRootError("Reimbursement Items can't be empty");
      return;
    }

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      _setReimbursementRootError(error.message);
      return;
    }
    if (data.user === null) {
      _setReimbursementRootError("Unregistered User");
      return;
    }

    const empRes = await fetchJSONAPI(
      "GET",
      `/api/v1/employees/${data.user.id}`
    );
    const empData = await empRes.json();
    if (empData.data.length === 0) {
      _setReimbursementRootError("Unauthorized Action");
      return;
    }
    const empID = empData.data[0].txEmployeeCode;
    const payload = {
      ...reimbursementData,
      txEmployeeCode: empID,
      reimbursement_items: items,
    };

    const res = await fetch("/api/v1/reimbursements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
        cookie: await getCookies(),
      },
      body: JSON.stringify(payload),
    });
    if (res.status === 201) {
      refreshAndRevalidatePage("/dashboard/reimbursement");
      refreshAndRevalidatePage("/");
      reimbursementForm.reset();
      setItems([]);
    } else {
      const json = await res.json();
      _setReimbursementRootError(json.error);
    }
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

  async function fetchComboboxData(fetchParams: {
    url: string;
    labelProperty: string;
    valueProperty: string;
    stateSetter: React.Dispatch<React.SetStateAction<any>>;
  }) {
    const searchParams = new URLSearchParams({
      fields: `${fetchParams.labelProperty},${fetchParams.valueProperty}`,
    }).toString();
    const urlWithParams = fetchParams.url + "?" + searchParams;
    const res = await fetchJSONAPI("GET", urlWithParams);
    const json = await res.json();
    const comboboxItems = json.data.map(
      (item: Record<string, any>) =>
        ({
          label: item[fetchParams.labelProperty],
          value: item[fetchParams.valueProperty],
        }) as ComboboxItem
    );
    fetchParams.stateSetter(comboboxItems);
  }

  useEffect(() => {
    fetchComboboxData({
      url: "/api/v1/categories",
      labelProperty: "txCategoryName",
      valueProperty: "inCategoryID",
      stateSetter: setCategories,
    });
    fetchComboboxData({
      url: "/api/v1/banks",
      labelProperty: "txBankName",
      valueProperty: "inBankTypeCode",
      stateSetter: setBanks,
    });
    fetchComboboxData({
      url: "/api/v1/companies",
      labelProperty: "txCompanyName",
      valueProperty: "inCompanyCode",
      stateSetter: setCompanies,
    });
  }, []);

  return (
    <div className="flex flex-row">
      <div className="w-1/2">
        <h1 className="">Add Reimbursement</h1>
        <Form {...reimbursementForm}>
          <form
            id="reimbursement-form"
            onSubmit={reimbursementForm.handleSubmit(addReimbursement)}
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
              name="txRecipientAccount"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="capitalize">
                    Recipient Account :
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={reimbursementForm.control}
              name="inBankTypeCode"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="capitalize">Bank Type :</FormLabel>
                  <FormControl>
                    <FormCombobox
                      value={field.value as string}
                      onChange={field.onChange}
                      items={banks}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={reimbursementForm.control}
              name="inRecipientCompanyCode"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="capitalize">
                    Recipient Company :
                  </FormLabel>
                  <FormControl>
                    <FormCombobox
                      value={field.value as string}
                      onChange={field.onChange}
                      items={companies}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={reimbursementForm.control}
              name="txBankAccountCode"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="capitalize">
                    Bank Account Code :
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={reimbursementForm.control}
              name="inCategoryID"
              render={({ field }) => {
                return (
                  <FormItem className="my-3">
                    <FormLabel className="capitalize">Category :</FormLabel>
                    <FormControl>
                      <FormCombobox
                        value={field.value as string}
                        onChange={field.onChange}
                        items={categories}
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
            <Button
              type="submit"
              disabled={reimbursementForm.formState.isSubmitting}
            >
              {reimbursementForm.formState.isSubmitting ? (
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
                <FormField
                  control={reimbursementItemForm.control}
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
                  {item.txCurrency} {item.deIndividualPrice} / item
                </CardDescription>
                <CardAction>Qty : {item.inQuantity}</CardAction>
              </CardHeader>
              <CardContent className="text-xl text-bold">
                <div className="flex justify-between ">
                  <div>
                    {item.txCurrency} {item.deTotalPrice}
                  </div>
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
