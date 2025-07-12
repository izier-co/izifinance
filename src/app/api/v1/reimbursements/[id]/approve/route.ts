import { createClient } from "@/app/api/supabase_server.config";
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
    .update({ txStatus: "Approved", daUpdatedAt: new Date().toISOString() })
    .eq("txReimbursementNoteID", id)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = sanitizeDatabaseOutputs(data);

  return NextResponse.json({
    message: "Data Successfully Updated!",
    data: sanitizedData,
  });
};
