import { createClient } from "@/app/api/supabase_server.config";
import { authorizeAdmin, removeByKey } from "@/lib/lib";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const uuidSchema = z.object({
  uuid: z.uuid().nullable(),
});

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ empID: string }> }
) {
  const supabase = await createClient();

  let body: Record<string, string> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "400 Bad Request : Invalid JSON Payload" },
      { status: 400 }
    );
  } finally {
    // TODO : handle something regarding logging
  }
  // TODO : consider nullifying data if empty string?
  const uuidModel = uuidSchema.safeParse(body);
  if (!uuidModel.success) {
    return NextResponse.json(
      { error: `400 Bad Request : ${uuidModel.error}` },
      { status: 400 }
    );
  }
  const uuidData = uuidModel.data;

  const unauthorizedResponse = await authorizeAdmin(supabase);
  if (unauthorizedResponse) return unauthorizedResponse;

  const params = await props.params;
  const id = params.empID;

  const { data, error } = await supabase
    .from("m_employees")
    .update({
      uiUserID: uuidData.uuid,
    })
    .eq("txEmployeeCode", id)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = removeByKey(data);

  return NextResponse.json({
    message: "Employee User Set!",
    data: sanitizedData,
  });
}
