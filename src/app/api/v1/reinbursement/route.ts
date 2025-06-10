import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@supabase-config";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get("page");
  if (page === null)
    return NextResponse.json(
      { error: "403 Bad Request : id parameter is required" },
      { status: 400 }
    );
  const pageId = Number.parseInt(page);
  const { data, error } = await supabase
    .from("reinbursement_notes")
    .select("*, reinbursement_items(*)")
    .range((pageId - 1) * 100, pageId * 100);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 200 });
};

