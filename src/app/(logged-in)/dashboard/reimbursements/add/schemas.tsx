import constValues from "@/lib/constants";
import z from "zod";

export const reimbursementSchema = z.object({
  txDescriptionDetails: z.string().max(constValues.maxTextLength),
  txCurrency: z
    .string()
    .length(constValues.currencyCodeStringLength, "Invalid Currency")
    .transform((str) => str.toUpperCase()),
  inCategoryID: z.coerce
    .number("Invalid Input")
    .positive("Invalid Input")
    .int("Integer values only"),
});

export const reimbursementItemSchema = z
  .object({
    txName: z.string().max(constValues.maxTextLength, "Name too Long!"),
    inQuantity: z
      .number()
      .positive("Must use positive value")
      .int("Integer values only"),
    deIndividualPrice: z.number().positive("Must use positive value"),
  })
  .transform((data) => ({
    ...data,
    deTotalPrice: data.deIndividualPrice * data.inQuantity,
    uid: crypto.randomUUID(),
  }));

export type ReimbursementSchema = z.infer<typeof reimbursementSchema>;
export type ReimbursementItemSchema = z.infer<typeof reimbursementItemSchema>;
