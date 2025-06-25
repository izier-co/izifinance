import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@supabase-config";

import { z } from "zod";

const categorySchema = z.object({
  txCategoryName: z.string(),
  txCategoryDescription: z.string().nullable(),
});

const {
  data: { session },
  error: authError,
} = await supabase.auth.getSession();

export const GET = async (req: NextRequest) => {
  if (!session || authError) {
    return NextResponse.json({ message: "401 Unauthorized" }, { status: 401 });
  }
  const searchParams = req.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get("page") || "1");
  const name = searchParams.get("name");
  const isAlphabetical = searchParams.get("is-alphabetical");
  const createdBeforeTimestamp = searchParams.get("created-before");
  const createdAfterTimestamp = searchParams.get("created-after");
  const updatedBeforeTimestamp = searchParams.get("updated-before");
  const updatedAfterTimestamp = searchParams.get("updated-after");

  const query = supabase
    .from("m_category")
    .select("*")
    .range((page - 1) * 100, page * 100)
    .eq("boActive", true)
    .eq("boStatus", true);
  if (name) {
    query.eq("txCategoryName", name);
  }
  if (isAlphabetical?.toLowerCase() === "true") {
    query.order("txCategoryName", {
      ascending: true,
    });
  } else if (isAlphabetical?.toLowerCase() === "false") {
    query.order("txCategoryName", {
      ascending: false,
    });
  }
  if (createdBeforeTimestamp) {
    const timestampValue = Number.parseInt(createdBeforeTimestamp);
    if (!Number.isNaN(timestampValue) && timestampValue >= 0) {
      query.lt("daCreatedAt", new Date(timestampValue).toISOString());
    }
  }
  if (createdAfterTimestamp) {
    const timestampValue = Number.parseInt(createdAfterTimestamp);
    if (!Number.isNaN(timestampValue) && timestampValue >= 0) {
      query.gt("daCreatedAt", new Date(timestampValue).toISOString());
    }
  }

  if (updatedBeforeTimestamp) {
    const timestampValue = Number.parseInt(updatedBeforeTimestamp);
    if (!Number.isNaN(timestampValue) && timestampValue >= 0) {
      query.lt("daUpdatedAt", new Date(timestampValue).toISOString());
    }
  }
  if (updatedAfterTimestamp) {
    const timestampValue = Number.parseInt(updatedAfterTimestamp);
    if (!Number.isNaN(timestampValue) && timestampValue >= 0) {
      query.gt("daUpdatedAt", new Date(timestampValue).toISOString());
    }
  }
  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  if (!session || authError) {
    return NextResponse.json({ message: "401 Unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await req.json();
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
  return NextResponse.json({
    message: "Data Successfully Inserted!",
  });
};

export const DELETE = async (req: NextRequest) => {
  if (!session || authError) {
    return NextResponse.json({ message: "401 Unauthorized" }, { status: 401 });
  }
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
