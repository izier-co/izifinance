import { createClient } from "@/app/api/supabase_server.config";
import constValues from "@/lib/constants";
import { authorizeAdmin, sanitizeDatabaseOutputs } from "@/lib/lib";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  const unauthorizedResponse = await authorizeAdmin(supabase);
  if (unauthorizedResponse) return unauthorizedResponse;

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
    .eq("txStatus", "Void");

  if (preCheckError)
    return NextResponse.json({ error: preCheckError.message }, { status: 500 });

  if (preCheckData.length)
    return NextResponse.json(
      { error: "Cannot approve voided notes" },
      { status: 422 }
    );

  const { data, error } = await supabase
    .from("reimbursement_notes")
    .update({
      txStatus: "Approved",
      txChangeReason: changeReason,
      daUpdatedAt: new Date().toISOString(),
    })
    .eq("txReimbursementNoteID", id)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = sanitizeDatabaseOutputs(data);

  return NextResponse.json({
    message: "Note Approved!",
    data: sanitizedData,
  });
};
