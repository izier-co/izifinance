import constValues from "@/lib/constants";
import { isValidInt } from "@/lib/lib";
import z from "zod";

export const addEmployeeSchema = z
  .object({
    daJoinDate: z.date(),
    txFullName: z
      .string()
      .nonempty("Input can't be empty")
      .max(constValues.maxShortTextLength),
    daDateOfBirth: z.iso.date(),
    txHomeAddress: z
      .string()
      .nonempty("Input can't be empty")
      .max(constValues.maxTextLength),
    txNationalIdNumber: z
      .string()
      .nonempty("Input can't be empty")
      .refine((num) => isValidInt(num), "Must be numerical string"),
    txReligionCode: z.string().nonempty("Input can't be empty"),
    txTaxNumber: z
      .string()
      .nonempty("Input can't be empty")
      .refine((num) => isValidInt(num), "Must be numerical string"),
    boMarriageStatus: z.boolean().default(false),
    inNumOfDeps: z.number().int("Must be valid Integer"),
    flSalary: z.float32("Must be a number"),
    txRoleCode: z.string(),
    txEmploymentTypeCode: z.string(),
    txCompanyCode: z.string(),
    txPhoneNumber: z
      .string()
      .nonempty("Input can't be empty")
      .refine((num) => isValidInt(num), "Must be numerical string"),
    txEmailAddress: z.email(),
    txBankTypeCode: z.string(),
    txBankAccountNumber: z
      .string()
      .nonempty("Input can't be empty")
      .refine((num) => isValidInt(num), "Must be numerical string"),
  })
  .transform((obj) => {
    return {
      ...obj,
      inYear: obj.daJoinDate.getFullYear(),
      inMonth: obj.daJoinDate.getMonth(),
    };
  });

export type AddEmployeeSchema = z.infer<typeof addEmployeeSchema>;
