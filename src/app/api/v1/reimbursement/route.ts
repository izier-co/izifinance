import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@supabase-config";

import { z } from "zod";

const reimbursementSchema = z.object({
  daCreatedAt: z.date(),
  daUpdatedAt: z.date(),
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
  daCreatedAt: z.date(),
  daUpdatedAt: z.date(),
  inReimbursementNoteID: z.number().int(),
  txName: z.string(),
  inQuantity: z.number().int(),
  deIndividualPrice: z.number(),
  deTotalPrice: z.number(),
  txCurrency: z.string(),
  inCategoryID: z.number().int(),
});

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get("page");
  if (page === null)
    return NextResponse.json(
      { error: "400 Bad Request : page parameter is required" },
      { status: 400 }
    );
  const pageId = Number.parseInt(page);
  const { data, error } = await supabase
    .from("reimbursement_notes")
    .select("*, reimbursement_items(*)")
    .range((pageId - 1) * 100, pageId * 100);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
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
      { error: `400 Bad Request : ${noteModel.error}` },
      { status: 400 }
    );
  }
  const items = [];
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
        { error: "400 Bad Request : Invalid JSON Payload" },
        { status: 400 }
      );
    } else {
      items.push(itemModel.data);
    }
  }
};

export const PUT = async (req: NextRequest) => {
  // TODO : admin
  // Currently only supports voiding
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
    .select("*")
    .eq("inReimbursementNoteID", id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (data.length === 0)
    return NextResponse.json({ error: "Data Not Found" }, { status: 404 });

  data["txStatus"] = "Void";

  await supabase
    .from("reimbursement_notes")
    .update(data)
    .eq("inReimbursementNoteID", id);
  return NextResponse.json({ message: "Data Successfully Updated!" });
};
