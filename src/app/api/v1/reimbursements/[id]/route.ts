import constValues from "@/lib/constants";
import { sanitizeDatabaseOutputs } from "@/lib/lib";
import { createClient } from "@/app/api/supabase_server.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  const searchParams = req.nextUrl.searchParams;
  const fields = searchParams.get("fields");
  const urlParams = await props.params;

  let tableQueryString = "*";

  if (fields) {
    tableQueryString = fields;
  }

  const { data, error } = await supabase
    .from("reimbursement_notes")
    .select(tableQueryString)
    .eq("txReimbursementNoteID", urlParams.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = sanitizeDatabaseOutputs(data);

  return NextResponse.json(
    {
      data: sanitizedData,
      meta: {},
    },
    { status: 200 }
  );
};

export const PUT = async (
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  const urlParams = await props.params;
  let description = "";
  try {
    const body = await req.json();
    description = body["description"] || "";
    description = description.replace(
      constValues.allowOnlyAlphanumericAndSpaceOnlyPattern,
      ""
    );
  } catch {
    return NextResponse.json(
      { error: "400 Bad Request : Invalid JSON Payload" },
      { status: 400 }
    );
  } finally {
    // TODO : handle something regarding logging
  }

  const { data, error } = await supabase
    .from("reimbursement_notes")
    .update({
      txDescriptionDetails: description,
      daUpdatedAt: new Date().toISOString(),
    })
    .eq("txReimbursementNoteID", urlParams.id)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = sanitizeDatabaseOutputs(data);

  return NextResponse.json(
    {
      message: "Data Successfully Updated!",
      data: sanitizedData,
    },
    { status: 200 }
  );
};
