import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@supabase-config"; // Use the appropriate client

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({
    message: "Login successful",
    user: data.user,
    accessToken: data.session?.access_token,
    refreshToken: data.session?.refresh_token,
    expiresAt: data.session?.expires_at,
  });
}
