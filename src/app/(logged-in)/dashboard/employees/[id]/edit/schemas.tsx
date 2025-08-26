import constValues from "@/lib/constants";
import { isValidInt } from "@/lib/lib";
import z from "zod";

export const editEmployeeSchema = z.object({
  txFullName: z
    .string()
    .nonempty("Input can't be empty")
    .max(constValues.maxShortTextLength),
  daDateOfBirth: z.iso.date(),
  txHomeAddress: z
    .string()
    .nonempty("Input can't be empty")
    .max(constValues.maxTextLength),
  txReligionCode: z.string().nonempty("Input can't be empty"),
  txTaxNumber: z
    .string()
    .nonempty("Input can't be empty")
    .refine((num) => isValidInt(num), "Must be numerical string"),
  boMarriageStatus: z.boolean(),
  inNumOfDeps: z.number().int("Must be an integer"),
  flSalary: z.float32("Must be a number"),
  txRoleCode: z.string().nonempty("Input can't be empty"),
  txEmploymentTypeCode: z.string().nonempty("Input can't be empty"),
  txCompanyCode: z.string().nonempty("Input can't be empty"),
  txPhoneNumber: z
    .string()
    .nonempty("Input can't be empty")
    .refine((num) => isValidInt(num), "Must be numerical string"),
  txEmailAddress: z.email("Must be valid email"),
  txBankTypeCode: z.string().nonempty("Input can't be empty"),
  txBankAccountNumber: z
    .string()
    .nonempty("Input can't be empty")
    .refine((num) => isValidInt(num), "Must be numerical string"),
});

export type EditEmployeeSchema = z.infer<typeof editEmployeeSchema>;
