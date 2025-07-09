import {
  pgTable,
  pgSchema,
  unique,
  uuid,
  timestamp,
  smallint,
  text,
  boolean,
  foreignKey,
  pgPolicy,
  integer,
  numeric,
  date,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const dtDwh = pgSchema("dt_dwh");

export const mCompanyInCompanyCodeSeqInDtDwh = dtDwh.sequence(
  "m_company_inCompanyCode_seq",
  {
    startWith: "1",
    increment: "1",
    minValue: "1",
    maxValue: "2147483647",
    cache: "1",
    cycle: false,
  }
);
export const mBankInBankTypeCodeSeqInDtDwh = dtDwh.sequence(
  "m_bank_inBankTypeCode_seq",
  {
    startWith: "1",
    increment: "1",
    minValue: "1",
    maxValue: "32767",
    cache: "1",
    cycle: false,
  }
);
export const mReligionInReligionCodeSeqInDtDwh = dtDwh.sequence(
  "m_religion_inReligionCode_seq",
  {
    startWith: "1",
    increment: "1",
    minValue: "1",
    maxValue: "32767",
    cache: "1",
    cycle: false,
  }
);
export const mPositionInPositionCodeSeqInDtDwh = dtDwh.sequence(
  "m_position_inPositionCode_seq",
  {
    startWith: "1",
    increment: "1",
    minValue: "1",
    maxValue: "32767",
    cache: "1",
    cycle: false,
  }
);
export const mCompanyTypeInCompanyTypeCodeSeqInDtDwh = dtDwh.sequence(
  "m_company_type_inCompanyTypeCode_seq",
  {
    startWith: "1",
    increment: "1",
    minValue: "1",
    maxValue: "32767",
    cache: "1",
    cycle: false,
  }
);
export const mEmploymentInEmploymentTypeCodeSeqInDtDwh = dtDwh.sequence(
  "m_employment_inEmploymentTypeCode_seq",
  {
    startWith: "1",
    increment: "1",
    minValue: "1",
    maxValue: "32767",
    cache: "1",
    cycle: false,
  }
);
export const mRolesInRoleCodeSeqInDtDwh = dtDwh.sequence(
  "m_roles_inRoleCode_seq",
  {
    startWith: "1",
    increment: "1",
    minValue: "1",
    maxValue: "32767",
    cache: "1",
    cycle: false,
  }
);

export const mReligionInDtDwh = dtDwh.table(
  "m_religion",
  {
    uiReligionId: uuid().defaultRandom().primaryKey().notNull(),
    daCreatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    daUpdatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    inReligionCode: smallint().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_religion_inReligionCode_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 32767,
    }),
    txReligionName: text().notNull(),
    boActive: boolean().notNull(),
    boStatus: boolean().notNull(),
  },
  (table) => [
    unique("m_religion_daUpdatedAt_key").on(table.daUpdatedAt),
    unique("m_religion_inReligionCode_key").on(table.inReligionCode),
    unique("m_religion_txReligionName_key").on(table.txReligionName),
  ]
);

export const mRolesInDtDwh = dtDwh.table(
  "m_roles",
  {
    uiRolesId: uuid().defaultRandom().primaryKey().notNull(),
    daCreatedAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    daUpdatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    inRoleCode: smallint().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_roles_inRoleCode_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 32767,
    }),
    txLongRoleName: text().notNull(),
    txRoleDescription: text(),
    txShortRoleName: text(),
  },
  (table) => [
    unique("m_roles_inRoleCode_key").on(table.inRoleCode),
    unique("m_roles_inRoleCode_key1").on(table.inRoleCode),
    unique("m_roles_txRoleName_key").on(table.txLongRoleName),
  ]
);

export const mBankInDtDwh = dtDwh.table(
  "m_bank",
  {
    uiBankId: uuid().defaultRandom().primaryKey().notNull(),
    daCreatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    daUpdatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    inBankTypeCode: smallint().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_bank_inBankTypeCode_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 32767,
    }),
    txBankName: text().notNull(),
    boLocalBank: boolean().default(true).notNull(),
    boActive: boolean().default(true).notNull(),
    boStatus: boolean().default(true).notNull(),
    boEwallet: boolean().default(false).notNull(),
  },
  (table) => [
    unique("m_bank_inBankTypeCode_key").on(table.inBankTypeCode),
    unique("m_bank_txBankName_key").on(table.txBankName),
  ]
);

export const mPositionInDtDwh = dtDwh.table(
  "m_position",
  {
    uiPositionId: uuid().defaultRandom().primaryKey().notNull(),
    daCreatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    daUpdatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    inPositionCode: smallint().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_position_inPositionCode_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 32767,
    }),
    txPositionName: text().notNull(),
    txPositionDetails: text(),
    boActive: boolean().default(true).notNull(),
    boStatus: boolean().default(true).notNull(),
  },
  (table) => [
    unique("m_position_inPositionCode_key").on(table.inPositionCode),
    unique("m_position_txPositionName_key").on(table.txPositionName),
  ]
);

export const reimbursementItemsInDtDwh = dtDwh.table(
  "reimbursement_items",
  {
    uiReimbursementItemID: uuid().defaultRandom().primaryKey().notNull(),
    daCreatedAt: timestamp({
      withTimezone: true,
      mode: "string",
    })
      .notNull()
      .defaultNow()
      .notNull(),
    daUpdatedAt: timestamp({
      withTimezone: true,
      mode: "string",
    })
      .notNull()
      .defaultNow(),
    txReimbursementNoteID: text().notNull(),
    txName: text().notNull(),
    inQuantity: integer().notNull(),
    deIndividualPrice: numeric({
      precision: 100,
      scale: 2,
    }).notNull(),
    deTotalPrice: numeric({
      precision: 100,
      scale: 2,
    }).notNull(),
    txCurrency: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.txReimbursementNoteID],
      foreignColumns: [reimbursementNotesInDtDwh.txReimbursementNoteID],
      name: "reimbursement_items_inReimbursementNoteID_fkey",
    }),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ]
);

export const mEmploymentInDtDwh = dtDwh.table(
  "m_employment",
  {
    uiEmploymentId: uuid().defaultRandom().primaryKey().notNull(),
    daCreatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    daUpdatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    inEmploymentTypeCode: smallint().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_employment_inEmploymentTypeCode_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 32767,
    }),
    txEmploymentTypeName: text().notNull(),
    boActive: boolean().notNull(),
    boStatus: boolean().notNull(),
  },
  (table) => [
    unique("m_employment_inEmploymentTypeCode_key").on(
      table.inEmploymentTypeCode
    ),
    unique("m_employment_txEmploymentTypeName_key").on(
      table.txEmploymentTypeName
    ),
  ]
);

export const mCompanyTypeInDtDwh = dtDwh.table(
  "m_company_type",
  {
    uiCompanyTypeId: uuid().defaultRandom().primaryKey().notNull(),
    daCreatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    daUpdatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`(now() AT TIME ZONE 'utc'::text)`)
      .notNull(),
    inCompanyTypeCode: smallint().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_company_type_inCompanyTypeCode_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 32767,
    }),
    txLongCompanyTypeName: text().notNull(),
    txShortCompanyTypeName: text().notNull(),
    boActive: boolean().notNull(),
    boStatus: boolean().notNull(),
  },
  (table) => [
    unique("m_company_type_inCompanyTypeCode_key").on(table.inCompanyTypeCode),
    unique("m_company_type_txLongCompanyTypeName_key").on(
      table.txLongCompanyTypeName
    ),
    unique("m_company_type_txShortCompanyTypeName_key").on(
      table.txShortCompanyTypeName
    ),
  ]
);

export const mEmployeesInDtDwh = dtDwh.table(
  "m_employees",
  {
    uiEmployeeId: uuid().defaultRandom().primaryKey().notNull(),
    daCreatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    daUpdatedAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    daJoinDate: date().notNull(),
    inYear: integer().notNull(),
    inMonth: smallint().notNull(),
    txFullName: text().notNull(),
    daDateOfBirth: date().notNull(),
    txHomeAddress: text().notNull(),
    txNationalIdNumber: text().notNull(),
    inReligionCode: smallint().notNull(),
    txTaxNumber: text().notNull(),
    boMarriageStatus: boolean().notNull(),
    inNumOfDeps: smallint().notNull(),
    flSalary: doublePrecision().notNull(),
    inRoleCode: smallint().notNull(),
    boActive: boolean().notNull(),
    boStatus: boolean().notNull(),
    inEmploymentTypeCode: smallint().notNull(),
    txEmployeeCode: text().notNull(),
    inCompanyCode: integer().notNull(),
    txPhoneNumber: text().notNull(),
    txEmailAddress: text().notNull(),
    inBankTypeCode: smallint().notNull(),
    txBankAccountNumber: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.inBankTypeCode],
      foreignColumns: [mBankInDtDwh.inBankTypeCode],
      name: "m_employees_inBankTypeCode_fkey",
    }),
    foreignKey({
      columns: [table.inCompanyCode],
      foreignColumns: [mCompanyInDtDwh.inCompanyCode],
      name: "m_employees_inCompanyCode_fkey",
    }),
    foreignKey({
      columns: [table.inEmploymentTypeCode],
      foreignColumns: [mEmploymentInDtDwh.inEmploymentTypeCode],
      name: "m_employees_inEmploymentTypeCode_fkey",
    }),
    foreignKey({
      columns: [table.inReligionCode],
      foreignColumns: [mReligionInDtDwh.inReligionCode],
      name: "m_employees_inReligionCode_fkey",
    }),
    foreignKey({
      columns: [table.inRoleCode],
      foreignColumns: [mRolesInDtDwh.inRoleCode],
      name: "m_employees_inRoleCode_fkey",
    }),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ]
);

export const reimbursementNotesInDtDwh = dtDwh.table(
  "reimbursement_notes",
  {
    uiReimbursementID: uuid().defaultRandom().primaryKey().notNull(),
    uiIdempotencyKey: uuid().notNull(),
    daCreatedAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    daUpdatedAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    txReimbursementNoteID: text().default(""),
    txStatus: text(),
    txDescriptionDetails: text(),
    inCategoryID: smallint().notNull(),
    txRecipientAccount: text().notNull(),
    inBankTypeCode: smallint().notNull(),
    inRecipientCompanyCode: integer().notNull(),
    txBankAccountCode: text().notNull(),
    txChangeReason: text(),
    txEmployeeCode: text().notNull(),
    txApprovedBy: text(),
    deNominalReimbursement: numeric({
      precision: 100,
      scale: 2,
    }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.inBankTypeCode],
      foreignColumns: [mBankInDtDwh.inBankTypeCode],
      name: "reinbursement_notes_inBankTypeCode_fkey",
    }),
    foreignKey({
      columns: [table.inCategoryID],
      foreignColumns: [mCategoryInDtDwh.inCategoryID],
      name: "reinbursement_items_inCategoryID_fkey",
    }),
    foreignKey({
      columns: [table.inRecipientCompanyCode],
      foreignColumns: [mCompanyInDtDwh.inCompanyCode],
      name: "reinbursement_notes_inRecipientCompanyCode_fkey",
    }),
    unique("reinbursement_notes_inReinbursementNoteID_key").on(
      table.txReimbursementNoteID
    ),
    pgPolicy("Enable update for authenticated users", {
      as: "permissive",
      for: "update",
      to: ["authenticated"],
      using: sql`true`,
      withCheck: sql`true`,
    }),
    pgPolicy("Enable insert for authenticated users only", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
    }),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ]
);

export const mCompanyInDtDwh = dtDwh.table(
  "m_company",
  {
    uiCompanyId: uuid().defaultRandom().primaryKey().notNull(),
    daCreatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    daUpdatedAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    inCompanyCode: integer().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_company_inCompanyCode_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    txCompanyName: text().notNull(),
    txCompanyDetails: text(),
    boActive: boolean().notNull(),
    boStatus: boolean().notNull(),
    inCompanyTypeCode: smallint().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.inCompanyTypeCode],
      foreignColumns: [mCompanyTypeInDtDwh.inCompanyTypeCode],
      name: "m_company_inCompanyTypeCode_fkey",
    }),
    unique("m_company_inCompanyCode_key").on(table.inCompanyCode),
    unique("m_company_txCompanyName_key").on(table.txCompanyName),
  ]
);

export const mCategoryInDtDwh = dtDwh.table(
  "m_category",
  {
    uiCategoryId: uuid().defaultRandom().primaryKey().notNull(),
    daCreatedAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    daUpdatedAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    inCategoryID: smallint().notNull(),
    txCategoryName: text().notNull(),
    txCategoryDescription: text(),
    boActive: boolean().default(true).notNull(),
    boStatus: boolean().default(true).notNull(),
  },
  (table) => [
    unique("m_category_inCategoryID_key").on(table.inCategoryID),
    pgPolicy("Enable update for authenticated users", {
      as: "permissive",
      for: "update",
      to: ["public"],
      using: sql`true`,
      withCheck: sql`true`,
    }),
    pgPolicy("Enable insert for authenticated users only", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
    }),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ]
);
