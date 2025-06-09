import { NextResponse } from "next/server"

import { createClient } from "@supabase/supabase-js"

// TODO: move to supabase client config
const options = {
  db: {
    schema: "dt_dwh",
  },
}

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
  options
)

export const GET = async () => {
  const { data, error } = await supabase.from("m_employees").select("*")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 200 })
}
