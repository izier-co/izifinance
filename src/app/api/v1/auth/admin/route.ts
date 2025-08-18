import { createServiceRoleClient } from "@/app/api/supabase_server.config";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServiceRoleClient();
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data });
}
