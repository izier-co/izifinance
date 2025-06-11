import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@supabase-config";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get("page");
  if (page === null)
    return NextResponse.json(
      { error: "403 Bad Request : page parameter is required" },
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

export const PUT = async (req: NextRequest) => {
  // TODO : admin
  // Currently only supports voiding
  const params = req.nextUrl.searchParams;
  const idParam = params.get("id");
  if (idParam === null)
    return NextResponse.json(
      { error: "403 Bad Request : id parameter is required" },
      { status: 400 }
    );
  const id = Number.parseInt(idParam);
  const { data, error } = await supabase
    .from("reimbursement_notes")
    .select("*")
    .eq("inReimbursementNoteID", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (data.length === 0)
    return NextResponse.json({ error: "Data Not Found" }, { status: 404 });

  data[0]["txStatus"] = "Void";

  await supabase
    .from("reimbursement_notes")
    .update(data)
    .eq("inReimbursementNoteID", id);
  return NextResponse.json({ message: "Data Successfully Updated!" });
};
