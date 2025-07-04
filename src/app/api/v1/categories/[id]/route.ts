import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@supabase-config";

import { verifyAuthentication } from "@/lib/lib";

export const GET = async (req: NextRequest) => {
  const unauthorizedResponse = await verifyAuthentication();
  if (unauthorizedResponse) return unauthorizedResponse;

  const searchParams = req.nextUrl.searchParams;
  const fields = searchParams.get("fields");
  let tableFields = "*";

  if (fields && fields !== "") {
    tableFields = fields;
  }

  const { data, error } = await supabase
    .from("m_category")
    .select(tableFields, { count: "exact" })
    .eq("boActive", true)
    .eq("boStatus", true);

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

export const DELETE = async (
  req: NextRequest,
  props: { params: Promise<{ id: number }> }
) => {
  const unauthorizedResponse = await verifyAuthentication();
  if (unauthorizedResponse) return unauthorizedResponse;

  const params = await props.params;
  const idParam = params.id;

  const { data, error } = await supabase
    .from("m_category")
    .update({ boActive: false, boStatus: false })
    .eq("inCategoryID", idParam)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    message: "Data Successfully Deleted!",
    data: data,
  });
};
