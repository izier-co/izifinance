import { relations } from "drizzle-orm/relations";
import {
  reimbursementNotesInDtDwh,
  reimbursementItemsInDtDwh,
  mCategoryInDtDwh,
  mBankInDtDwh,
  mEmployeesInDtDwh,
  mCompanyInDtDwh,
  mEmploymentInDtDwh,
  mReligionInDtDwh,
  mRolesInDtDwh,
  mCompanyTypeInDtDwh,
} from "./schema";

export const reimbursementItemsInDtDwhRelations = relations(
  reimbursementItemsInDtDwh,
  ({ one }) => ({
    reimbursementNotesInDtDwh: one(reimbursementNotesInDtDwh, {
      fields: [reimbursementItemsInDtDwh.txReimbursementNoteID],
      references: [reimbursementNotesInDtDwh.txReimbursementNoteID],
    }),
  })
);

export const reimbursementNotesInDtDwhRelations = relations(
  reimbursementNotesInDtDwh,
  ({ one, many }) => ({
    reimbursementItemsInDtDwhs: many(reimbursementItemsInDtDwh),
    mBankInDtDwh: one(mBankInDtDwh, {
      fields: [reimbursementNotesInDtDwh.inBankTypeCode],
      references: [mBankInDtDwh.inBankTypeCode],
    }),
    mCompanyInDtDwh: one(mCompanyInDtDwh, {
      fields: [reimbursementNotesInDtDwh.inRecipientCompanyCode],
      references: [mCompanyInDtDwh.inCompanyCode],
    }),
  })
);

export const mCategoryInDtDwhRelations = relations(
  mCategoryInDtDwh,
  ({ many }) => ({
    reimbursementItemsInDtDwhs: many(reimbursementItemsInDtDwh),
  })
);

export const mEmployeesInDtDwhRelations = relations(
  mEmployeesInDtDwh,
  ({ one }) => ({
    mBankInDtDwh: one(mBankInDtDwh, {
      fields: [mEmployeesInDtDwh.inBankTypeCode],
      references: [mBankInDtDwh.inBankTypeCode],
    }),
    mCompanyInDtDwh: one(mCompanyInDtDwh, {
      fields: [mEmployeesInDtDwh.inCompanyCode],
      references: [mCompanyInDtDwh.inCompanyCode],
    }),
    mEmploymentInDtDwh: one(mEmploymentInDtDwh, {
      fields: [mEmployeesInDtDwh.inEmploymentTypeCode],
      references: [mEmploymentInDtDwh.inEmploymentTypeCode],
    }),
    mReligionInDtDwh: one(mReligionInDtDwh, {
      fields: [mEmployeesInDtDwh.inReligionCode],
      references: [mReligionInDtDwh.inReligionCode],
    }),
    mRolesInDtDwh: one(mRolesInDtDwh, {
      fields: [mEmployeesInDtDwh.inRoleCode],
      references: [mRolesInDtDwh.inRoleCode],
    }),
  })
);

export const mBankInDtDwhRelations = relations(mBankInDtDwh, ({ many }) => ({
  mEmployeesInDtDwhs: many(mEmployeesInDtDwh),
  reimbursementNotesInDtDwhs: many(reimbursementNotesInDtDwh),
}));

export const mCompanyInDtDwhRelations = relations(
  mCompanyInDtDwh,
  ({ one, many }) => ({
    mEmployeesInDtDwhs: many(mEmployeesInDtDwh),
    reimbursementNotesInDtDwhs: many(reimbursementNotesInDtDwh),
    mCompanyTypeInDtDwh: one(mCompanyTypeInDtDwh, {
      fields: [mCompanyInDtDwh.inCompanyTypeCode],
      references: [mCompanyTypeInDtDwh.inCompanyTypeCode],
    }),
  })
);

export const mEmploymentInDtDwhRelations = relations(
  mEmploymentInDtDwh,
  ({ many }) => ({
    mEmployeesInDtDwhs: many(mEmployeesInDtDwh),
  })
);

export const mReligionInDtDwhRelations = relations(
  mReligionInDtDwh,
  ({ many }) => ({
    mEmployeesInDtDwhs: many(mEmployeesInDtDwh),
  })
);

export const mRolesInDtDwhRelations = relations(mRolesInDtDwh, ({ many }) => ({
  mEmployeesInDtDwhs: many(mEmployeesInDtDwh),
}));

export const mCompanyTypeInDtDwhRelations = relations(
  mCompanyTypeInDtDwh,
  ({ many }) => ({
    mCompanyInDtDwhs: many(mCompanyInDtDwh),
  })
);
