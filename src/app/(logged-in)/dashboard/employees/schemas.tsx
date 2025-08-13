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
  inReligionCode: z.number(),
  txTaxNumber: z.string(),
  boMarriageStatus: z.boolean(),
  inNumOfDeps: z.number(),
  flSalary: z.number(),
  inRoleCode: z.number(),
  boActive: z.boolean(),
  boStatus: z.boolean(),
  inEmploymentTypeCode: z.number(),
  txEmployeeCode: z.string(),
  inCompanyCode: z.number(),
  txPhoneNumber: z.string(),
  txEmailAddress: z.string(),
  inBankTypeCode: z.number(),
  txBankAccountNumber: z.string(),
  boHasAdminAccess: z.boolean(),
  uiUserID: z.uuid(),
});

export type EmployeeSchema = z.infer<typeof employeeSchema>;
