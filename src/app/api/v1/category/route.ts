import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@supabase-config";

import { z } from "zod";
import { verifyAuthentication } from "@/lib/lib";

const categorySchema = z.object({
  txCategoryName: z.string(),
  txCategoryDescription: z.string().nullable(),
});

export const GET = async (req: NextRequest) => {
  const unauthorizedResponse = await verifyAuthentication();
  if (unauthorizedResponse) return unauthorizedResponse;

  const searchParams = req.nextUrl.searchParams;
  const params = Object.fromEntries(searchParams.entries());
  const pageNum = Number.parseInt(params["page"] || "1");
  const paginationSize = 100;

  const query = supabase
    .from("m_category")
    .select("*")
    .range((pageNum - 1) * paginationSize, pageNum * paginationSize)
    .eq("boActive", true)
    .eq("boStatus", true);
  if (params["name"]) {
    query.eq("txCategoryName", params["name"]);
  }
  if (params["is-alphabetical"]?.toLowerCase() === "true") {
    query.order("txCategoryName", {
      ascending: true,
    });
  } else if (params["is-alphabetical"]?.toLowerCase() === "false") {
    query.order("txCategoryName", {
      ascending: false,
    });
  }
  if (params["created-before"]) {
    const timestampValue = Number.parseInt(params["created-before"]);
    if (!Number.isNaN(timestampValue) && timestampValue >= 0) {
      query.lt("daCreatedAt", new Date(timestampValue).toISOString());
    }
  }
  if (params["created-after"]) {
    const timestampValue = Number.parseInt(params["created-after"]);
    if (!Number.isNaN(timestampValue) && timestampValue >= 0) {
      query.gt("daCreatedAt", new Date(timestampValue).toISOString());
    }
  }

  if (params["updated-before"]) {
    const timestampValue = Number.parseInt(params["updated-before"]);
    if (!Number.isNaN(timestampValue) && timestampValue >= 0) {
      query.lt("daUpdatedAt", new Date(timestampValue).toISOString());
    }
  }
  if (params["updated-after"]) {
    const timestampValue = Number.parseInt(params["updated-after"]);
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
  const unauthorizedResponse = await verifyAuthentication();
  if (unauthorizedResponse) return unauthorizedResponse;

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
  const unauthorizedResponse = await verifyAuthentication();
  if (unauthorizedResponse) return unauthorizedResponse;

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
