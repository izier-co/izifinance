import { sanitizeDatabaseOutputs } from "@/lib/lib";
import { createClient } from "@/app/api/supabase_server.config";
import { NextRequest, NextResponse } from "next/server";

import constValues from "@/lib/constants";

export const PUT = async (
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  const params = await props.params;
  const id = params.id;
  let changeReason = "";
  try {
    const body = await req.json();
    // ensures type safety when body is null or undefined
    changeReason = body["changeReason"] || "";
    changeReason = changeReason.replace(
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
  const { data: preCheckData, error: preCheckError } = await supabase
    .from("reimbursement_notes")
    .select("*")
    .eq("txReimbursementNoteID", id)
    .eq("txStatus", "Approved");

  if (preCheckError)
    return NextResponse.json({ error: preCheckError.message }, { status: 500 });

  if (preCheckData.length > 0)
    return NextResponse.json(
      { error: "Cannot void approved notes" },
      { status: 422 }
    );

  const { data, error } = await supabase
    .from("reimbursement_notes")
    .update({
      txStatus: "Void",
      txChangeReason: changeReason,
      daUpdatedAt: new Date().toISOString(),
    })
    .eq("txReimbursementNoteID", id)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = sanitizeDatabaseOutputs(data);

  return NextResponse.json({
    message: "Note Voided!",
    data: sanitizedData,
  });
};
