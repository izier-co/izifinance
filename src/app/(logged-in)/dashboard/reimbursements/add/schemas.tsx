import constValues from "@/lib/constants";
import { isValidInt } from "@/lib/lib";
import z from "zod";

export const reimbursementSchema = z.object({
  txDescriptionDetails: z.string().max(constValues.maxTextLength),
  txRecipientAccount: z
    .string()
    .max(constValues.maxBankCodeLength, "Code too long")
    .refine((val) => isValidInt(val), "Must be Valid integer"),
  inBankTypeCode: z.coerce
    .number("Invalid Input")
    .positive("Invalid Input")
    .int("Integer values only"),
  inRecipientCompanyCode: z.coerce
    .number("Invalid Input")
    .positive("Invalid Input")
    .int("Integer values only"),
  txBankAccountCode: z
    .string()
    .max(constValues.maxBankCodeLength, "Code too long")
    .refine((val) => isValidInt(val), "Must be Valid integer"),
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