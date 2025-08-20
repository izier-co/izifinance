import {
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
  "m_company_txCompanyCode_seq",
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
  "m_bank_txBankTypeCode_seq",
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
  "m_religion_txReligionCode_seq",
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
  "m_position_txPositionCode_seq",
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
  "m_company_type_txCompanyTypeCode_seq",
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
  "m_employment_txEmploymentTypeCode_seq",
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
  "m_roles_txRoleCode_seq",
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
    txReligionCode: smallint().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_religion_txReligionCode_seq",
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
    unique("m_religion_txReligionCode_key").on(table.txReligionCode),
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
    txRoleCode: smallint().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_roles_txRoleCode_seq",
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
    unique("m_roles_txRoleCode_key").on(table.txRoleCode),
    unique("m_roles_txRoleCode_key1").on(table.txRoleCode),
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
    txBankTypeCode: smallint().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_bank_txBankTypeCode_seq",
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
    unique("m_bank_txBankTypeCode_key").on(table.txBankTypeCode),
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
    txPositionCode: smallint().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_position_txPositionCode_seq",
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
    unique("m_position_txPositionCode_key").on(table.txPositionCode),
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
    txEmploymentTypeCode: smallint().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_employment_txEmploymentTypeCode_seq",
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
    unique("m_employment_txEmploymentTypeCode_key").on(
      table.txEmploymentTypeCode
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
    txCompanyTypeCode: smallint().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_company_type_txCompanyTypeCode_seq",
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
    unique("m_company_type_txCompanyTypeCode_key").on(table.txCompanyTypeCode),
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
    txReligionCode: smallint().notNull(),
    txTaxNumber: text().notNull(),
    boMarriageStatus: boolean().notNull(),
    inNumOfDeps: smallint().notNull(),
    flSalary: doublePrecision().notNull(),
    txRoleCode: smallint().notNull(),
    boActive: boolean().notNull(),
    boStatus: boolean().notNull(),
    txEmploymentTypeCode: smallint().notNull(),
    txEmployeeCode: text().notNull(),
    txCompanyCode: integer().notNull(),
    txPhoneNumber: text().notNull(),
    txEmailAddress: text().notNull(),
    txBankTypeCode: smallint().notNull(),
    txBankAccountNumber: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.txBankTypeCode],
      foreignColumns: [mBankInDtDwh.txBankTypeCode],
      name: "m_employees_txBankTypeCode_fkey",
    }),
    foreignKey({
      columns: [table.txCompanyCode],
      foreignColumns: [mCompanyInDtDwh.txCompanyCode],
      name: "m_employees_txCompanyCode_fkey",
    }),
    foreignKey({
      columns: [table.txEmploymentTypeCode],
      foreignColumns: [mEmploymentInDtDwh.txEmploymentTypeCode],
      name: "m_employees_txEmploymentTypeCode_fkey",
    }),
    foreignKey({
      columns: [table.txReligionCode],
      foreignColumns: [mReligionInDtDwh.txReligionCode],
      name: "m_employees_txReligionCode_fkey",
    }),
    foreignKey({
      columns: [table.txRoleCode],
      foreignColumns: [mRolesInDtDwh.txRoleCode],
      name: "m_employees_txRoleCode_fkey",
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
    daCreatedAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    daUpdatedAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    txReimbursementNoteID: text().default(""),
    txStatus: text(),
    txDescriptionDetails: text(),
    txChangeReason: text(),
    txEmployeeCode: text().notNull(),
    txChangedBy: text(),
    txCurrency: text().notNull(),
    dcNominalReimbursement: numeric({
      precision: 100,
      scale: 2,
    })
      .notNull()
      .default((0).toFixed(2)),
    txCategoryID: text(),
    uiIdempotencyKey: uuid().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.txCategoryID],
      foreignColumns: [mCategoryInDtDwh.txCategoryID],
      name: "reinbursement_items_txCategoryID_fkey",
    }),
    foreignKey({
      columns: [table.txChangedBy],
      foreignColumns: [mEmployeesInDtDwh.txEmployeeCode],
      name: "reimbursement_notes_txApprovedBy_fkey",
    }),
    foreignKey({
      columns: [table.txEmployeeCode],
      foreignColumns: [mEmployeesInDtDwh.txEmployeeCode],
      name: "reimbursement_notes_txEmployeeCode_fkey",
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
    txCompanyCode: integer().generatedByDefaultAsIdentity({
      name: "dt_dwh.m_company_txCompanyCode_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
    }),
    txCompanyName: text().notNull(),
    txCompanyDetails: text(),
    boActive: boolean().notNull(),
    boStatus: boolean().notNull(),
    txCompanyTypeCode: smallint().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.txCompanyTypeCode],
      foreignColumns: [mCompanyTypeInDtDwh.txCompanyTypeCode],
      name: "m_company_txCompanyTypeCode_fkey",
    }),
    unique("m_company_txCompanyCode_key").on(table.txCompanyCode),
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
    txCategoryID: smallint().notNull(),
    txCategoryName: text().notNull(),
    txCategoryDescription: text(),
    boActive: boolean().default(true).notNull(),
    boStatus: boolean().default(true).notNull(),
  },
  (table) => [
    unique("m_category_txCategoryID_key").on(table.txCategoryID),
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
