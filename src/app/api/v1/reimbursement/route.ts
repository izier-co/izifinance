import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@supabase-config";

import { z } from "zod";

import { db } from "@drizzle-db";
import {
  reimbursementItemsInDtDwh,
  reimbursementNotesInDtDwh,
} from "@/db/schema";

import { verifyAuthentication } from "@/lib/lib";

const reimbursementSchema = z.object({
  txStatus: z.string(),
  txNotes: z.string().nullable(),
  txRecipientAccount: z.string(),
  inBankTypeCode: z.number().int(),
  inRecipientCompanyCode: z.number().int(),
  txBankAccountCode: z.string(),
  txChangeReason: z.string(),
});

const reimbursementItemSchema = z.object({
  txName: z.string(),
  inQuantity: z.number().int(),
  deIndividualPrice: z.number(),
  deTotalPrice: z.number(),
  txCurrency: z.string(),
  inCategoryID: z.number().int(),
});

type ReimbursementItems = {
  txName: string;
  inQuantity: number;
  deIndividualPrice: number;
  deTotalPrice: number;
  txCurrency: string;
  inCategoryID: number;
};

export const GET = async (req: NextRequest) => {
  const unauthorizedResponse = await verifyAuthentication();
  if (unauthorizedResponse) return unauthorizedResponse;

  const searchParams = req.nextUrl.searchParams;
  const params = Object.fromEntries(searchParams.entries());
  const pageId = Number.parseInt(params.page || "1");

  let tableQueryString = "*"; // indicates SELECT * without JOIN

  if (params.with_notes?.toLocaleLowerCase() === "true" && params.id) {
    // if details are requested (only when ID is given)
    tableQueryString = "*, reimbursement_items(*)";
  }
  const paginationSize = 100;
  const query = supabase
    .from("reimbursement_notes")
    .select(tableQueryString)
    .range((pageId - 1) * paginationSize, pageId * paginationSize);

  if (params.id) {
    const numID = Number.parseInt(params.id);
    query.eq("inReimbursementNoteID", numID);
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
  if (params.bank_type_code) {
    const bankID = Number.parseInt(params.bank_type_code);
    query.eq("inBankTypeCode", bankID);
  }
  if (params.recipient_company_code) {
    const recipientID = Number.parseInt(params.recipient_company_code);
    query.eq("inRecipientCompanyCode", recipientID);
  }

  if (params.created_before) {
    const timestampValue = Number.parseInt(params.created_before);
    if (!Number.isNaN(timestampValue) && timestampValue >= 0) {
      query.lt("daCreatedAt", new Date(timestampValue).toISOString());
    }
  }
  if (params.created_after) {
    const timestampValue = Number.parseInt(params.created_after);
    if (!Number.isNaN(timestampValue) && timestampValue >= 0) {
      query.gt("daCreatedAt", new Date(timestampValue).toISOString());
    }
  }

  if (params.updated_before) {
    const timestampValue = Number.parseInt(params.updated_before);
    if (!Number.isNaN(timestampValue) && timestampValue >= 0) {
      query.lt("daUpdatedAt", new Date(timestampValue).toISOString());
    }
  }
  if (params.updated_after) {
    const timestampValue = Number.parseInt(params.updated_after);
    if (!Number.isNaN(timestampValue) && timestampValue >= 0) {
      query.gt("daUpdatedAt", new Date(timestampValue).toISOString());
    }
  }
  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  // Expects JSON payload for reimbursement_notes table
  // with reimbursement_items field that contains the payload
  // of reimbursement_items in an array

  const unauthorizedResponse = await verifyAuthentication();
  if (unauthorizedResponse) return unauthorizedResponse;

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
  try {
    await db.transaction(async (trx) => {
      const insertedID = await trx
        .insert(reimbursementNotesInDtDwh)
        .values({
          txStatus: noteItem.txStatus,
          txNotes: noteItem.txNotes,
          txRecipientAccount: noteItem.txRecipientAccount,
          inBankTypeCode: noteItem.inBankTypeCode,
          inRecipientCompanyCode: noteItem.inRecipientCompanyCode,
          txBankAccountCode: noteItem.txBankAccountCode,
          txChangeReason: noteItem.txChangeReason,
        })
        .returning({
          inReimbursementNoteID:
            reimbursementNotesInDtDwh.inReimbursementNoteID,
        });
      const idForKey = insertedID[0].inReimbursementNoteID;
      for (const item of items) {
        await trx.insert(reimbursementItemsInDtDwh).values({
          inReimbursementNoteID: idForKey,
          txName: item.txName,
          inQuantity: item.inQuantity,
          deIndividualPrice: item.deIndividualPrice.toFixed(2),
          deTotalPrice: item.deTotalPrice.toFixed(2),
          txCurrency: item.txCurrency,
          inCategoryID: item.inCategoryID,
        });
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
  return NextResponse.json({
    message: "Data Successfully Inserted!",
  });
};
