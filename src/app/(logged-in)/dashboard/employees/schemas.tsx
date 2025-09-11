import z from "zod";

export const employeeSchema = z.object({
  daCreatedAt: z.iso.datetime(),
  daUpdatedAt: z.iso.datetime(),
  daJoinDate: z.iso.datetime(),
  inYear: z.number(),
  inMonth: z.number(),
  txFullName: z.string(),
  daDateOfBirth: z.iso.datetime(),
  txHomeAddress: z.string(),
  txNationalIdNumber: z.string(),
  txReligionCode: z.number(),
  txTaxNumber: z.string(),
  boMarriageStatus: z.boolean(),
  inNumOfDeps: z.number(),
  flSalary: z.number(),
  txRoleCode: z.number(),
  boActive: z.boolean(),
  boStatus: z.boolean(),
  txEmploymentTypeCode: z.number(),
  txEmployeeCode: z.string(),
  txCompanyCode: z.number(),
  txPhoneNumber: z.string(),
  txEmailAddress: z.string(),
  txBankTypeCode: z.number(),
  txBankAccountNumber: z.string(),
  boHasAdminAccess: z.boolean(),
  uiUserID: z.uuid(),
});

export type EmployeeSchema = z.infer<typeof employeeSchema>;
