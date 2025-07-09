import { sanitizeDatabaseOutputs } from "@/lib/lib";
import { supabase } from "@supabase-config";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) => {
  const params = await props.params;
  const id = params.id;
  const { data, error } = await supabase
    .from("reimbursement_notes")
    .update({ txStatus: "Void", daUpdatedAt: new Date().toISOString() })
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
