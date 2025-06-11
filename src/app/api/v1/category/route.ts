import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@supabase-config";

import { z } from "zod";

const categorySchema = z.object({
  daCreatedAt: z.date(),
  daUpdatedAt: z.date(),
  inCategoryID: z.number().int(),
  txCategoryName: z.string(),
  txCategoryDescription: z.string().nullable(),
  boActive: z.boolean(),
  boStatus: z.boolean(),
});

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get("page") || "1");
  const { data, error } = await supabase
    .from("m_category")
    .select("*")
    .range((page - 1) * 100, page * 100);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  let body;
  try {
    body = await req.json();
    body["daCreatedAt"] = new Date(body["daCreatedAt"]);
    body["daUpdatedAt"] = new Date(body["daUpdatedAt"]);
  } catch {
    return NextResponse.json(
      { error: "400 Bad Request : Invalid JSON Payload" },
      { status: 400 }
    );
  }

  const categoryModel = categorySchema.safeParse(body);
  if (!categoryModel.success) {
    return NextResponse.json(
      { error: `400 Bad Request : ${categoryModel.error}` },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("m_category")
    .insert(categoryModel.data);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Data Successfully Inserted!" });
};
