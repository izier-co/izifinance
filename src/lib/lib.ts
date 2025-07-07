import { supabase } from "@supabase-config";
import { NextResponse } from "next/server";

export async function verifyAuthentication(): Promise<NextResponse<unknown> | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "401 Unauthorized" }, { status: 401 });
  }
  return null;
}

export function isValidInt(str: string): boolean {
  return !isNaN(Number.parseInt(str));
}
