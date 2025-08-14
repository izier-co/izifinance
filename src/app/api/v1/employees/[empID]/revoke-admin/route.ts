import { createClient } from "@/app/api/supabase_server.config";
import { authorizeAdmin, removeByKey } from "@/lib/lib";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  props: { params: Promise<{ empID: string }> }
) => {
  const supabase = await createClient();
  const unauthorizedResponse = await authorizeAdmin(supabase);
  if (unauthorizedResponse) return unauthorizedResponse;

  const params = await props.params;
  const id = params.empID;

  const { data, error } = await supabase
    .from("m_employees")
    .update({
      boHasAdminAccess: false,
    })
    .eq("txEmployeeCode", id)
    .select();
  console.log(id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = removeByKey(data);

  return NextResponse.json({
    message: "Admin Revoked!",
    data: sanitizedData,
  });
};
