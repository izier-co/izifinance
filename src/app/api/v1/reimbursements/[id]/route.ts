import { supabase } from "@supabase-config";
import { verifyAuthentication } from "@/lib/lib";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ id: number }> }
) => {
  const unauthorizedResponse = await verifyAuthentication();
  if (unauthorizedResponse) return unauthorizedResponse;

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
    .eq("inReimbursementNoteID", urlParams.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(
    {
      data: data,
      meta: {},
    },
    { status: 200 }
  );
};
