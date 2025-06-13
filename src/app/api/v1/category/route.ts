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
  const name = searchParams.get("name");
  const isAlphabetical = searchParams.get("is-alphabetical");
  const query = supabase
    .from("m_category")
    .select("*")
    .range((page - 1) * 100, page * 100)
    .eq("boActive", true)
    .eq("boStatus", true);
  if (name) {
    query.eq("txCategoryName", name);
  }
  if (isAlphabetical === "true") {
    query.order("txCategoryName", {
      ascending: true,
    });
  } else if (isAlphabetical === "false") {
    query.order("txCategoryName", {
      ascending: false,
    });
  }

  const { data, error } = await query;
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

  const { data, error } = await supabase
    .from("m_category")
    .insert(categoryModel.data);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    message: "Data Successfully Inserted!",
    data: data,
  });
};

export const DELETE = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const idParam = params.get("id");
  if (idParam === null)
    return NextResponse.json(
      { error: "400 Bad Request : id parameter is required" },
      { status: 400 }
    );
  const id = Number.parseInt(idParam);

  const { error } = await supabase
    .from("m_category")
    .update({ boActive: false, boStatus: false })
    .eq("inCategoryID", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    message: "Data Successfully Deleted!",
  });
};
