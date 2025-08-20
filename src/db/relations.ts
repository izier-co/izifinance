// import { relations } from "drizzle-orm/relations";
// import {
//   reimbursementNotesInDtDwh,
//   reimbursementItemsInDtDwh,
//   mCategoryInDtDwh,
//   mBankInDtDwh,
//   mEmployeesInDtDwh,
//   mCompanyInDtDwh,
//   mEmploymentInDtDwh,
//   mReligionInDtDwh,
//   mRolesInDtDwh,
//   mCompanyTypeInDtDwh,
// } from "./schema";

// export const reimbursementItemsInDtDwhRelations = relations(
//   reimbursementItemsInDtDwh,
//   ({ one }) => ({
//     reimbursementNotesInDtDwh: one(reimbursementNotesInDtDwh, {
//       fields: [reimbursementItemsInDtDwh.txReimbursementNoteID],
//       references: [reimbursementNotesInDtDwh.txReimbursementNoteID],
//     }),
//   })
// );

// export const reimbursementNotesInDtDwhRelations = relations(
//   reimbursementNotesInDtDwh,
//   ({ many }) => ({
//     reimbursementItemsInDtDwhs: many(reimbursementItemsInDtDwh),
//   })
// );

// export const mCategoryInDtDwhRelations = relations(
//   mCategoryInDtDwh,
//   ({ many }) => ({
//     reimbursementItemsInDtDwhs: many(reimbursementItemsInDtDwh),
//   })
// );

// export const mEmployeesInDtDwhRelations = relations(
//   mEmployeesInDtDwh,
//   ({ one }) => ({
//     mBankInDtDwh: one(mBankInDtDwh, {
//       fields: [mEmployeesInDtDwh.txBankTypeCode],
//       references: [mBankInDtDwh.txBankTypeCode],
//     }),
//     mCompanyInDtDwh: one(mCompanyInDtDwh, {
//       fields: [mEmployeesInDtDwh.txCompanyCode],
//       references: [mCompanyInDtDwh.txCompanyCode],
//     }),
//     mEmploymentInDtDwh: one(mEmploymentInDtDwh, {
//       fields: [mEmployeesInDtDwh.txEmploymentTypeCode],
//       references: [mEmploymentInDtDwh.txEmploymentTypeCode],
//     }),
//     mReligionInDtDwh: one(mReligionInDtDwh, {
//       fields: [mEmployeesInDtDwh.txReligionCode],
//       references: [mReligionInDtDwh.txReligionCode],
//     }),
//     mRolesInDtDwh: one(mRolesInDtDwh, {
//       fields: [mEmployeesInDtDwh.txRoleCode],
//       references: [mRolesInDtDwh.txRoleCode],
//     }),
//   })
// );

// export const mBankInDtDwhRelations = relations(mBankInDtDwh, ({ many }) => ({
//   mEmployeesInDtDwhs: many(mEmployeesInDtDwh),
//   reimbursementNotesInDtDwhs: many(reimbursementNotesInDtDwh),
// }));

// export const mCompanyInDtDwhRelations = relations(
//   mCompanyInDtDwh,
//   ({ one, many }) => ({
//     mEmployeesInDtDwhs: many(mEmployeesInDtDwh),
//     reimbursementNotesInDtDwhs: many(reimbursementNotesInDtDwh),
//     mCompanyTypeInDtDwh: one(mCompanyTypeInDtDwh, {
//       fields: [mCompanyInDtDwh.txCompanyTypeCode],
//       references: [mCompanyTypeInDtDwh.txCompanyTypeCode],
//     }),
//   })
// );

// export const mEmploymentInDtDwhRelations = relations(
//   mEmploymentInDtDwh,
//   ({ many }) => ({
//     mEmployeesInDtDwhs: many(mEmployeesInDtDwh),
//   })
// );

// export const mReligionInDtDwhRelations = relations(
//   mReligionInDtDwh,
//   ({ many }) => ({
//     mEmployeesInDtDwhs: many(mEmployeesInDtDwh),
//   })
// );

// export const mRolesInDtDwhRelations = relations(mRolesInDtDwh, ({ many }) => ({
//   mEmployeesInDtDwhs: many(mEmployeesInDtDwh),
// }));

// export const mCompanyTypeInDtDwhRelations = relations(
//   mCompanyTypeInDtDwh,
//   ({ many }) => ({
//     mCompanyInDtDwhs: many(mCompanyInDtDwh),
//   })
// );
