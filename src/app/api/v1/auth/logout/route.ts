import { NextResponse } from "next/server";
import { createClient } from "@/app/api/supabase_server.config";

export async function POST() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Logged Out Successfully!" });
}
