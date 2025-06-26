import { supabase } from "@supabase-config";
import { NextResponse } from "next/server";

export async function verifyAuthentication(): Promise<NextResponse<unknown> | null> {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();
  if (!session || authError) {
    return NextResponse.json({ error: "401 Unauthorized" }, { status: 401 });
  }
  return null;
}
