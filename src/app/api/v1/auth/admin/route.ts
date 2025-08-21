import { createServiceRoleClient } from "@/app/api/supabase_server.config";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServiceRoleClient();
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createServiceRoleClient();
  const { email, password } = await req
    .json()
    .catch((err) => NextResponse.json({ error: err.message }, { status: 500 }));
  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data });
}
