import constValues from "@/lib/constants";
import { isValidInt } from "@/lib/lib";
import z from "zod";

export const addEmployeeSchema = z
  .object({
    daJoinDate: z.iso.date(),
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
    inNumOfDeps: z.transform(Number).pipe(z.number()),
    flSalary: z.transform(Number).pipe(z.float32()),
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
  })
  .transform((obj) => {
    const splitISODate = obj.daJoinDate.split("-");
    return {
      ...obj,
      inYear: splitISODate[0],
      inMonth: splitISODate[1],
    };
  });

export type AddEmployeeSchema = z.infer<typeof addEmployeeSchema>;
