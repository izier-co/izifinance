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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Command, CheckIcon } from "lucide-react";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";

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
  inRecipientCompanyCode: z
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
  inCategoryID: z
    .number()
    .positive("Must use positive value")
    .int("Integer values only"),
});

const reimbursementItemSchema = z.object({
  txName: z.string().max(constValues.maxTextLength, "Name too Long!"),
  inQuantity: z
    .number()
    .positive("Must use positive value")
    .int("Integer values only"),
  deIndividualPrice: z.number().positive("Must use positive value"),
  deTotalPrice: z.number().positive("Must use positive value"),
  txCurrency: z
    .string()
    .length(
      constValues.currencyCodeStringLength,
      "Must be Valid ISO 4217 string"
    )
    .transform((str) => str.toUpperCase()),
});

type ReimbursementSchema = z.infer<typeof reimbursementSchema>;
type ReimbursementItemSchema = z.infer<typeof reimbursementItemSchema>;

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
      inCategoryID: 0,
    },
  });

  const reimbursementItemForm = useForm({
    resolver: zodResolver(reimbursementItemSchema),
    defaultValues: {
      txName: "",
      inQuantity: 0,
      deIndividualPrice: 0,
      deTotalPrice: 0,
      txCurrency: "",
    },
  });

  const [items, setItems] = useState<ReimbursementItemSchema[]>([]);

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
  async function addReimbursementItem(data: ReimbursementItemSchema) {
    setItems([...items, data]);
  }
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
            />
            <Button type="submit">Add Reimbursement</Button>
          </form>
        </Form>
      </div>
      <div className="w-1/2 px-6">
        <Dialog>
          <DialogTrigger className="flex" asChild>
            <Button className="ml-auto mb-2">Add Items</Button>
          </DialogTrigger>
          <DialogContent onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Add Items</DialogTitle>
            </DialogHeader>
            <Form {...reimbursementItemForm}>
              <form id="reimbursement-item-form">
                <FormField
                  control={reimbursementItemForm.control}
                  name="txName"
                  render={({ field }) => (
                    <FormItem className="my-3">
                      <FormLabel className="capitalize">Name :</FormLabel>
                      <FormControl>
                        <Input />
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
                {/* TODO : use select */}
                <FormField
                  control={reimbursementItemForm.control}
                  name="txCurrency"
                  render={({ field }) => {
                    const selectedValue = field.value;
                    const [open, setOpen] = useState(false);
                    const nameOptions = ["Alice", "Bob", "Charlie", "Diana"]; // Example names
                    return (
                      <FormItem className="my-3">
                        <FormLabel className="capitalize">Currency :</FormLabel>
                        <FormControl>
                          <FormLabel className="capitalize">Name :</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                role="combobox"
                                className="w-full justify-between"
                              >
                                {selectedValue
                                  ? nameOptions.find(
                                      (name) => name === selectedValue
                                    )
                                  : "Select name"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search name..." />
                                <CommandEmpty>No name found.</CommandEmpty>
                                <CommandList>
                                  {nameOptions.map((name) => (
                                    <CommandItem
                                      key={name}
                                      value={name}
                                      onSelect={() => {
                                        field.onChange(name);
                                        setOpen(false);
                                      }}
                                    >
                                      <CheckIcon
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          name === selectedValue
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {name}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <Button type="submit">Add Reimbursement</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Card>
          <CardHeader>
            <CardTitle>Big Mac</CardTitle>
            <CardDescription>Rp. 12.000 / pcs</CardDescription>
            <CardAction>Qty : 5</CardAction>
          </CardHeader>
          <CardContent className="text-xl text-bold">Rp. 60.000</CardContent>
        </Card>
      </div>
    </div>
  );
}
