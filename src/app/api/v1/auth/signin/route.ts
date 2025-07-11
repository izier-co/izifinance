import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/api/supabase_server.config";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { session } = data;

  if (session) {
    supabase.auth.setSession(session);
    return NextResponse.json({ message: "Sign In successful!" });
  }

  return NextResponse.json({ error: "No Session" }, { status: 401 });

  // return NextResponse.json({
  //   message: "Sign In successful",
  //   user: data.user,
  //   accessToken: data.session?.access_token,
  //   refreshToken: data.session?.refresh_token,
  //   expiresAt: data.session?.expires_at,
  // });
}
