import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@supabase-config";

import { z } from "zod";

import { db } from "@drizzle-db";
import {
  reimbursementItemsInDtDwh,
  reimbursementNotesInDtDwh,
} from "@/db/schema";
import { isValidInt } from "@/lib/lib";
import constValues from "@/lib/constants";

const reimbursementSchema = z.object({
  txDescriptionDetails: z
    .string()
    .max(constValues.maxTextLength)
    .nullable()
    .transform((str) => {
      return str?.replace(
        constValues.allowOnlyAlphanumericAndSpaceOnlyPattern,
        ""
      );
    }),
  txRecipientAccount: z
    .string()
    .max(constValues.maxBankCodeLength)
    .refine((val) => isValidInt(val)),
  inBankTypeCode: z.number().positive().int(),
  inRecipientCompanyCode: z.number().positive().int(),
  txBankAccountCode: z
    .string()
    .max(constValues.maxBankCodeLength)
    .refine((val) => isValidInt(val)),
  txChangeReason: z
    .string()
    .max(constValues.maxTextLength)
    .nullable()
    .transform((str) => {
      return str?.replace(
        constValues.allowOnlyAlphanumericAndSpaceOnlyPattern,
        ""
      );
    }),
  txEmployeeCode: z
    .string()
    .length(9)
    .regex(/^[a-zA-Z0-9]+$/),
  txApprovedBy: z
    .string()
    .length(9)
    .regex(/^[a-zA-Z0-9]+$/)
    .nullable(),
  inCategoryID: z.number().positive().int(),
  deNominalReimbursement: z.number().positive().int(),
});

const reimbursementItemSchema = z.object({
  txName: z
    .string()
    .max(constValues.maxTextLength)
    .transform((str) => {
      return str?.replace(
        constValues.allowOnlyAlphanumericAndSpaceOnlyPattern,
        ""
      );
    }),
  inQuantity: z.number().positive().int(),
  deIndividualPrice: z.number().positive().int(),
  deTotalPrice: z.number().positive().int(),
  txCurrency: z
    .string()
    .length(
      constValues.currencyCodeStringLength,
      "Must be Valid ISO 4217 string"
    )
    .transform((str) => str.toUpperCase()),
});

const getRequestParams = z.object({
  paginationPage: z.coerce.number().positive().default(1),
  paginationSize: z.coerce.number().positive().min(1).optional(),
  id: z.coerce.number().positive().optional(),
  status: z.enum(["Pending", "Approved", "Rejected", "Void"]).optional(),
  bankTypeCode: z.coerce.number().positive().optional(),
  recipientCompanyCode: z.coerce.number().positive().optional(),
  withNotes: z.coerce.boolean().default(false),
  fields: z
    .string()
    .optional()
    .transform((str) => {
      return str?.replace(constValues.allowOnlyAlphabeticAndCommaPattern, "");
    }),
  approvedBy: z.coerce.number().positive().optional(),
  createdBefore: z.string().datetime().optional(),
  createdAfter: z.string().datetime().optional(),
  updatedBefore: z.string().datetime().optional(),
  updatedAfter: z.string().datetime().optional(),
});

type ReimbursementItems = {
  txName: string;
  inQuantity: number;
  deIndividualPrice: number;
  deTotalPrice: number;
  txCurrency: string;
};

type ReturnedData = Record<string, number | string>;

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const urlParams = Object.fromEntries(searchParams.entries());
  const paramModel = getRequestParams.safeParse(urlParams);

  if (!paramModel.success) {
    return NextResponse.json(
      { error: `400 Bad Request : ${paramModel.error}` },
      { status: 400 }
    );
  }
  const params = paramModel.data;

  let tableQueryString = "*"; // indicates SELECT * without JOIN

  if (params.fields) {
    tableQueryString = params.fields;
  }

  let paginationSize = 100;
  if (params.paginationSize) {
    paginationSize = params.paginationSize;
  }
  const query = supabase
    .from("reimbursement_notes")
    .select(tableQueryString, { count: "exact" })
    .range(
      (params.paginationPage - 1) * paginationSize,
      params.paginationPage * paginationSize
    );

  if (params.status) {
    switch (params.status) {
      case "Pending": {
        query.eq("txStatus", params.status);
        break;
      }
      case "Approved": {
        query.eq("txStatus", params.status);
        break;
      }
      case "Rejected": {
        query.eq("txStatus", params.status);
        break;
      }
      case "Void": {
        query.eq("txStatus", params.status);
        break;
      }
      default: {
        break;
      }
    }
  }
  if (params.approvedBy) {
    query.eq("txApprovedBy", params.approvedBy);
  }
  if (params.bankTypeCode) {
    query.eq("inBankTypeCode", params.bankTypeCode);
  }
  if (params.recipientCompanyCode) {
    query.eq("inRecipientCompanyCode", params.recipientCompanyCode);
  }

  if (params.createdBefore) {
    query.lt("daCreatedAt", params.createdBefore);
  }
  if (params.createdAfter) {
    query.gt("daCreatedAt", params.createdAfter);
  }

  if (params.updatedBefore) {
    query.lt("daUpdatedAt", params.updatedBefore);
  }
  if (params.updatedAfter) {
    query.gt("daUpdatedAt", params.updatedAfter);
  }

  const { data, count, error } = await query;
  let pageCount: number | null = null;
  if (count) {
    pageCount = Math.floor(count / paginationSize);
  }

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(
    {
      data: data,
      meta: {
        isFirstPage: params.paginationPage === 1,
        isLastPage: data.length < paginationSize,
        dataCount: data.length,
        totalDataCount: count,
        pageCount: pageCount,
        offset: (params.paginationPage - 1) * paginationSize,
        pageNumber: params.paginationPage,
        paginationSize: paginationSize,
      },
    },
    { status: 200 }
  );
};

export const POST = async (req: NextRequest) => {
  // Expects JSON payload for reimbursement_notes table
  // with reimbursement_items field that contains the payload
  // of reimbursement_items in an array

  let body: Record<string, string> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "400 Bad Request : Invalid JSON Payload" },
      { status: 400 }
    );
  } finally {
    // TODO : handle something regarding logging
  }
  const noteModel = reimbursementSchema.safeParse(body);
  if (!noteModel.success) {
    return NextResponse.json(
      { error: `400 Bad Request : ${noteModel.error.message}` },
      { status: 400 }
    );
  }
  const noteItem = noteModel.data;
  const items: ReimbursementItems[] = [];
  if (
    body["reimbursement_items"] === null ||
    body["reimbursement_items"] === undefined
  ) {
    return NextResponse.json(
      { error: "400 Bad Request : Invalid JSON Payload" },
      { status: 400 }
    );
  }
  const itemModels = body["reimbursement_items"];
  for (let i = 0; i < itemModels.length; i++) {
    const itemModel = reimbursementItemSchema.safeParse(
      body["reimbursement_items"][i]
    );
    if (!itemModel.success) {
      return NextResponse.json(
        { error: "400 Bad Request : " + itemModel.error },
        { status: 400 }
      );
    } else {
      items.push(itemModel.data);
    }
  }
  let returnedParentData = {};
  const returnedChildData: Array<ReturnedData> = [];
  try {
    await db.transaction(async (trx) => {
      const insertedParentData = await trx
        .insert(reimbursementNotesInDtDwh)
        .values({
          txDescriptionDetails: noteItem.txDescriptionDetails,
          inCategoryID: noteItem.inCategoryID,
          txRecipientAccount: noteItem.txRecipientAccount,
          inBankTypeCode: noteItem.inBankTypeCode,
          inRecipientCompanyCode: noteItem.inRecipientCompanyCode,
          txBankAccountCode: noteItem.txBankAccountCode,
          txChangeReason: noteItem.txChangeReason,
          txEmployeeCode: noteItem.txEmployeeCode,
          txApprovedBy: noteItem.txApprovedBy,
          deNominalReimbursement: noteItem.deNominalReimbursement.toFixed(2),
        })
        .returning();

      const idForKey = insertedParentData[0].txReimbursementNoteID;

      if (idForKey === null) {
        return new Error("Insertion Failed to return in transaction");
      }

      for (const item of items) {
        const insertedChildData = await trx
          .insert(reimbursementItemsInDtDwh)
          .values({
            txReimbursementNoteID: idForKey,
            txName: item.txName,
            inQuantity: item.inQuantity,
            deIndividualPrice: item.deIndividualPrice.toFixed(2),
            deTotalPrice: item.deTotalPrice.toFixed(2),
            txCurrency: item.txCurrency,
          })
          .returning();
        returnedChildData.push(insertedChildData[0]);
      }
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "500 Internal Server Error :" + (error as Error).toString() },
      { status: 500 }
    );
  } finally {
    // TODO : handle something regarding to logging
  }
  return NextResponse.json(
    {
      message: "Data Successfully Inserted!",
      data: {
        ...returnedParentData,
        reimbursement_items: returnedChildData,
      },
    },
    { status: 201 }
  );
};
