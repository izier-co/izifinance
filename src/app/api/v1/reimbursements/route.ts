import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/app/api/supabase_server.config";

import { z } from "zod";

import { db } from "@drizzle-db";
import { eq } from "drizzle-orm";

import {
  reimbursementItemsInDtDwh,
  reimbursementNotesInDtDwh,
} from "@/db/schema";
import { removeByKey, sortArray } from "@/lib/lib";
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
  txEmployeeCode: z
    .string()
    .length(9)
    .regex(/^[a-zA-Z0-9]+$/),
  inCategoryID: z.number().positive().int(),
  txCurrency: z
    .string()
    .length(
      constValues.currencyCodeStringLength,
      "Must be Valid ISO 4217 string"
    )
    .transform((str) => str.toUpperCase()),
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
});

const getRequestParams = z.object({
  paginationPage: z.coerce.number().positive().optional().default(1),
  paginationSize: z.coerce.number().positive().min(1).optional(),
  status: z.enum(["Pending", "Approved", "Rejected", "Void"]).optional(),
  fields: z
    .string()
    .optional()
    .transform((str) => {
      return str?.replace(constValues.allowOnlyAlphabeticAndCommaPattern, "");
    }),
  sortArray: z.string().optional().transform(sortArray),
  currency: z
    .string()
    .length(
      constValues.currencyCodeStringLength,
      "Must be Valid ISO 4217 string"
    )
    .optional()
    .transform((str) => str?.toUpperCase()),
  changedBy: z.coerce.string().optional(),
  createdBefore: z.iso.datetime().optional(),
  createdAfter: z.iso.datetime().optional(),
  updatedBefore: z.iso.datetime().optional(),
  updatedAfter: z.iso.datetime().optional(),
});

type ReimbursementItems = {
  txName: string;
  inQuantity: number;
  deIndividualPrice: number;
  deTotalPrice: number;
};

type ReturnedData = Record<string, number | string>;

export const GET = async (req: NextRequest) => {
  const supabase = await createClient();
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
      params.paginationPage * paginationSize - 1
    );

  if (params.sortArray) {
    for (let i = 0; i < params.sortArray.length; i++) {
      query.order(params.sortArray[i].fieldName, {
        ascending: params.sortArray[i].sortState,
      });
    }
  }
  if (params.currency) {
    query.eq("txCurrency", params.currency);
  }
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
  if (params.changedBy) {
    query.ilike("txChangedBy", `%${params.changedBy}%`);
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

  const sanitizedData = removeByKey(data);
  return NextResponse.json(
    {
      data: sanitizedData,
      pagination: {
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
  const idempotencyKey = req.headers.get("Idempotency-Key");
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

  if (idempotencyKey === null) {
    return NextResponse.json(
      { error: "400 Bad Request : Missing Idempotency Key" },
      { status: 400 }
    );
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
      const existingParent = await trx
        .select({
          uiIdempotencyKey: reimbursementNotesInDtDwh.uiIdempotencyKey,
        })
        .from(reimbursementNotesInDtDwh)
        .where(eq(reimbursementNotesInDtDwh.uiIdempotencyKey, idempotencyKey))
        .execute();

      if (existingParent.length > 0) {
        trx.rollback();
      }

      const insertedParentData = await trx
        .insert(reimbursementNotesInDtDwh)
        .values({
          uiIdempotencyKey: idempotencyKey,
          txDescriptionDetails: noteItem.txDescriptionDetails,
          inCategoryID: noteItem.inCategoryID,
          txEmployeeCode: noteItem.txEmployeeCode,
          txCurrency: noteItem.txCurrency,
        })
        .returning();
      returnedParentData = insertedParentData[0];
      const idForKey = insertedParentData[0].txReimbursementNoteID;

      if (idForKey === null) {
        return new Error("Insertion Failed to return in transaction");
      }
      let totalPrice = 0;
      for (const item of items) {
        const insertedChildData = await trx
          .insert(reimbursementItemsInDtDwh)
          .values({
            txReimbursementNoteID: idForKey,
            txName: item.txName,
            inQuantity: item.inQuantity,
            deIndividualPrice: item.deIndividualPrice.toFixed(2),
            deTotalPrice: item.deTotalPrice.toFixed(2),
          })
          .returning();
        totalPrice += item.deTotalPrice;
        returnedChildData.push(insertedChildData[0]);
      }
      await trx
        .update(reimbursementNotesInDtDwh)
        .set({ dcNominalReimbursement: totalPrice.toFixed(2) })
        .where(
          eq(
            reimbursementNotesInDtDwh.uiReimbursementID,
            insertedParentData[0].uiReimbursementID
          )
        );
    });
    if ("uiReimbursementID" in returnedParentData) {
      delete returnedParentData.uiReimbursementID;
    }
    if ("uiIdempotencyKey" in returnedParentData) {
      delete returnedParentData.uiIdempotencyKey;
    }
    returnedChildData.forEach((val) => {
      if ("uiReimbursementItemID" in val) {
        delete val.uiReimbursementItemID;
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "500 Internal Server Error :" + (error as Error).toString() },
      { status: 500 }
    );
  } finally {
    // TODO : handle something regarding to logging
  }
  // todo sanitize drizzle output
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
