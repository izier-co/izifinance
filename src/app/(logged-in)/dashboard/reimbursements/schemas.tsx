import z from "zod";

export const payloadSchema = z.object({
  daCreatedAt: z.string(),
  daUpdatedAt: z.string(),
  txStatus: z.string(),
  txCurrency: z.string(),
  txReimbursementNoteID: z.string(),
  txDescriptionDetails: z.string(),
  txRecipientAccount: z.string(),
  txApprovedBy: z.string(),
  inBankTypeCode: z.number(),
  inRecipientCompanyCode: z.number(),
  txBankAccountCode: z.string(),
  txChangeReason: z.string(),
  txEmployeeCode: z.string(),
  inCategoryID: z.number(),
  dcNominalReimbursement: z.number(),
});

export const processSchema = z.object({
  changeReason: z.string(),
});

export const changeDescriptionSchema = z.object({
  description: z.string(),
});

export type Reimbursements = z.infer<typeof payloadSchema>;
export type ApprovalSchema = z.infer<typeof processSchema>;
export type VoidSchema = ApprovalSchema;
export type RejectSchema = ApprovalSchema;
export type ChangeDescriptionSchema = z.infer<typeof changeDescriptionSchema>;
