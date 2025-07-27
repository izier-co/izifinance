"use client";
import constValues from "@/lib/constants";
import { fetchJSONAPI, isValidInt } from "@/lib/lib";
import z from "zod";

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
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import React from "react";

const reimbursementSchema = z.object({
  txDescriptionDetails: z.string().max(constValues.maxTextLength),
  txRecipientAccount: z
    .string()
    .max(constValues.maxBankCodeLength, "Code too long")
    .refine((val) => isValidInt(val), "Must be Valid integer"),
  inBankTypeCode: z
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
  txEmployeeCode: z
    .string()
    .length(9, "Employee Code is exactly 9 characters")
    .regex(
      constValues.allowOnlyAlphabeticOnlyPattern,
      "Only Alphabetical Characters"
    ),
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

type ComboboxItem = {
  value: string | number;
  label: string;
};

export default function Page() {
  const reimbursementForm = useForm({
    resolver: zodResolver(reimbursementSchema),
    defaultValues: {
      txDescriptionDetails: "",
      txRecipientAccount: "",
      inBankTypeCode: 0,
      inRecipientCompanyCode: 0,
      txBankAccountCode: "",
      txEmployeeCode: "",
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

  async function addReimbursement(data: ReimbursementSchema) {
    const payload = { ...data, reimbursement_items: items };
    const res = await fetchJSONAPI("POST", `/api/v1/reimbursements/`, payload);
    if (res.status === 200) {
      refreshAndRevalidatePage("/dashboard/reimbursement");
      refreshAndRevalidatePage("/");
    } else {
      const json = await res.json();
      reimbursementForm.setError("root", {
        message: json.error,
      });
    }
  }
  function addReimbursementItem(data: ReimbursementItemSchema) {
    setItems([...items, data]);
    setOpen(false);
  }

  function deleteItem(data: ReimbursementItemSchema) {
    setItems(items.filter((item) => item.uid !== data.uid));
  }

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

  function _reimbursementItemsCleanupForm() {
    reimbursementItemForm.clearErrors();
  }
  function handleDialogChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen === false) {
      _reimbursementItemsCleanupForm();
    }
  }

  function ExampleCombobox({
    value,
    onChange,
    items,
  }: {
    value: string;
    onChange: (val: string) => void;
    items: Array<ComboboxItem>;
  }) {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? items.find((item) => String(item.value) === value)?.label
              : "Select value ..."}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search currency code..." />
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value.toString()}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(item.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
  useEffect(() => {
    async function fetchSelectData() {
      const url = "/api/v1/categories?";
      const searchParams = new URLSearchParams({
        fields: "txCategoryName,inCategoryID",
      }).toString();
      const res = await fetchJSONAPI("GET", url + searchParams);
      const json = await res.json();
      const items = json.data.map(
        (item: { txCategoryName: any; inCategoryID: any }) =>
          ({
            label: item.txCategoryName,
            value: item.inCategoryID,
          }) as ComboboxItem
      );
      setCategories(items);
    }
    fetchSelectData();
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
            {/* TODO use select instead */}
            <FormField
              control={reimbursementForm.control}
              name="inBankTypeCode"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="capitalize">Bank Type :</FormLabel>
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
              control={reimbursementForm.control}
              name="inRecipientCompanyCode"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="capitalize">
                    Recipient Company :
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
            {/*probably optional*/}
            <FormField
              control={reimbursementForm.control}
              name="txEmployeeCode"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="capitalize">Employee Code :</FormLabel>
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
                      <ExampleCombobox
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

            {/* <FormField
              control={reimbursementForm.control}
              name="inCategoryID"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="capitalize">Category :</FormLabel>
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
            /> */}
            <Button type="submit">Add Reimbursement</Button>
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
                          <ExampleCombobox
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
