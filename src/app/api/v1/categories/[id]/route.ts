import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@supabase-config";
import { authorizeAdmin, sanitizeDatabaseOutputs } from "@/lib/lib";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ id: number }> }
) => {
  const searchParams = req.nextUrl.searchParams;
  const params = await props.params;
  const fields = searchParams.get("fields");
  let tableFields = "*";

  if (fields && fields !== "") {
    tableFields = fields;
  }

  const { data, error } = await supabase
    .from("m_category")
    .select(tableFields)
    .eq("inCategoryID", params.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = sanitizeDatabaseOutputs(data);

  return NextResponse.json(
    {
      data: sanitizedData,
      meta: {},
    },
    { status: 200 }
  );
};

export const DELETE = async (
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) => {
  const unauthorizedResponse = await authorizeAdmin();
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

  const sanitizedData = sanitizeDatabaseOutputs(data);

  return NextResponse.json({
    message: "Data Successfully Deleted!",
    data: sanitizedData,
  });
};
