import { NextResponse } from "next/server";
import { supabase } from "@supabase-config";

export const GET = async () => {
  const { data, error } = await supabase.from("m_employees").select("*");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 200 });
};
