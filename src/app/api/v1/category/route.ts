import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@supabase-config";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get("page") || "1");
  const { data, error } = await supabase
    .from("m_category")
    .select("*")
    .range((page - 1) * 100, page * 100);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 200 });
};
