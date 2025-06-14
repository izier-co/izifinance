import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@supabase-config";

import { z } from "zod";

import { db } from "@drizzle-db";
import {
  reimbursementItemsInDtDwh,
  reimbursementNotesInDtDwh,
} from "@/db/schema";
import { table } from "console";

const reimbursementSchema = z.object({
  daCreatedAt: z.string().datetime(),
  daUpdatedAt: z.string().datetime(),
  inReimbursementNoteID: z.number().int(),
  txStatus: z.string(),
  txNotes: z.string().nullable(),
  txRecipientAccount: z.string(),
  inBankTypeCode: z.number().int(),
  inRecipientCompanyCode: z.number().int(),
  txBankAccountCode: z.string(),
  txChangeReason: z.string(),
});

const reimbursementItemSchema = z.object({
  daCreatedAt: z.string().datetime(),
  daUpdatedAt: z.string().datetime(),
  inReimbursementNoteID: z.number().int(),
  txName: z.string(),
  inQuantity: z.number().int(),
  deIndividualPrice: z.number(),
  deTotalPrice: z.number(),
  txCurrency: z.string(),
  inCategoryID: z.number().int(),
});

type ReimbursementItems = {
  daCreatedAt: string;
  daUpdatedAt: string;
  inReimbursementNoteID: number;
  txName: string;
  inQuantity: number;
  deIndividualPrice: number;
  deTotalPrice: number;
  txCurrency: string;
  inCategoryID: number;
};

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get("page");
  const id = searchParams.get("id");
  const status = searchParams.get("status");
  const bankTypeCode = searchParams.get("bank-type-code");
  const recipientCompanyCode = searchParams.get("recipient-company-code");
  const withNotes = searchParams.get("with-notes");

  if (page === null)
    return NextResponse.json(
      { error: "400 Bad Request : page parameter is required" },
      { status: 400 }
    );
  const pageId = Number.parseInt(page);
  var tableQueryString = "*"; // indicates SELECT * without JOIN
  if (withNotes && id) {
    // if details are requested (only when ID is given)
    tableQueryString = "*, reimbursement_items(*)";
  }
  const query = supabase
    .from("reimbursement_notes")
    .select(tableQueryString)
    .range((pageId - 1) * 100, pageId * 100);

  if (id) {
    const numID = Number.parseInt(id);
    query.eq("inReimbursementNoteID", numID);
  }
  if (status) {
    switch (status) {
      case "Pending": {
        query.eq("txStatus", status);
        break;
      }
      case "Approved": {
        query.eq("txStatus", status);
        break;
      }
      case "Rejected": {
        query.eq("txStatus", status);
        break;
      }
      case "Void": {
        console.log(status);
        query.eq("txStatus", status);
        break;
      }
      default: {
        break;
      }
    }
  }
  if (bankTypeCode) {
    const bankID = Number.parseInt(bankTypeCode);
    query.eq("inBankTypeCode", bankID);
  }
  if (recipientCompanyCode) {
    const recipientID = Number.parseInt(recipientCompanyCode);
    query.eq("inRecipientCompanyCode", recipientID);
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
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "400 Bad Request : Invalid JSON Payload" },
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
  for (var i = 0; i < itemModels.length; i++) {
    var itemModel = reimbursementItemSchema.safeParse(
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
      await trx.insert(reimbursementNotesInDtDwh).values({
        inReimbursementNoteID: noteItem.inReimbursementNoteID,
        txStatus: noteItem.txStatus,
        txNotes: noteItem.txNotes,
        txRecipientAccount: noteItem.txRecipientAccount,
        inBankTypeCode: noteItem.inBankTypeCode,
        inRecipientCompanyCode: noteItem.inRecipientCompanyCode,
        txBankAccountCode: noteItem.txBankAccountCode,
        txChangeReason: noteItem.txChangeReason,
      });
      for (const item of items) {
        await trx.insert(reimbursementItemsInDtDwh).values({
          inReimbursementNoteID: item.inReimbursementNoteID,
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
  }
  return NextResponse.json({
    message: "Data Successfully Inserted!",
  });
};

export const PUT = async (req: NextRequest) => {
  // TODO : admin
  // Currently only supports voiding (daLastUpdated still not reflected)
  const params = req.nextUrl.searchParams;
  const idParam = params.get("id");
  if (idParam === null)
    return NextResponse.json(
      { error: "400 Bad Request : id parameter is required" },
      { status: 400 }
    );
  const id = Number.parseInt(idParam);
  const { data, error } = await supabase
    .from("reimbursement_notes")
    .update({ txStatus: "Void", daUpdatedAt: new Date().toISOString() })
    .eq("inReimbursementNoteID", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    message: "Data Successfully Updated!",
    data: data,
  });
};
