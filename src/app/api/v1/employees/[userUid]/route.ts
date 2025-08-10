import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/api/supabase_server.config";
import { removeByKey } from "@/lib/lib";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ userUid: string }> }
) => {
  const supabase = await createClient();
  const searchParams = req.nextUrl.searchParams;
  const params = await props.params;
  const fields = searchParams.get("fields");
  let tableFields = "*";

  if (fields && fields !== "") {
    tableFields = fields;
  }
  console.log("params" + params.userUid);

  const { data, error } = await supabase
    .from("m_employees")
    .select(tableFields)
    .eq("uiUserID", params.userUid);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = removeByKey(data);

  return NextResponse.json(
    {
      data: sanitizedData,
      pagination: {},
    },
    { status: 200 }
  );
};
