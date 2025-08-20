import { createClient } from "@/app/api/supabase_server.config";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const schema = z
  .object({
    email: z.email().optional(),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      const keys = Object.values(data).filter((v) => v !== undefined);
      return keys.length === 1;
    },
    {
      error: "Only one field can be filled",
    }
  );

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const parsedBody = schema.safeParse(body);
  if (parsedBody.error) {
    return NextResponse.json(
      {
        error: "400 Bad Request : Invalid JSON Payload",
      },
      { status: 400 }
    );
  }
  const data = parsedBody.data;

  const supabase = await createClient();

  if (data.email) {
    const { error } = await supabase.auth.updateUser({
      email: data.email,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (data.password) {
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const { error } = await supabase.auth.refreshSession();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Successfully changed credentials" });
}
