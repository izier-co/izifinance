import { verifyAuthentication } from "@/lib/lib";
import { supabase } from "@supabase-config";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
  const unauthorizedResponse = await verifyAuthentication();
  if (unauthorizedResponse) return unauthorizedResponse;

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
    .eq("inReimbursementNoteID", id)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    message: "Data Successfully Updated!",
    data: data,
  });
};
