import { supabase } from "@/app/api/supabase.config";
import { NextRequest, NextResponse } from "next/server";

const {
  data: { session },
  error: authError,
} = await supabase.auth.getSession();

export const PUT = async (req: NextRequest) => {
  if (!session || authError) {
    return NextResponse.json({ message: "401 Unauthorized" }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const idParam = params.get("id");
  if (idParam === null)
    return NextResponse.json(
      { error: "400 Bad Request : id parameter is required" },
      { status: 400 }
    );
  const id = Number.parseInt(idParam);
  const { error } = await supabase
    .from("reimbursement_notes")
    .update({ txStatus: "Void", daUpdatedAt: new Date().toISOString() })
    .eq("inReimbursementNoteID", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    message: "Data Successfully Updated!",
  });
};
