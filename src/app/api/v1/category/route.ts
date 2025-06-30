import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@supabase-config";

import { z } from "zod";
import { verifyAuthentication } from "@/lib/lib";

const categorySchema = z.object({
  txCategoryName: z.string(),
  txCategoryDescription: z.string().nullable(),
});

const getRequestParams = z.object({
  paginationPage: z.coerce.number().default(1),
  paginationSize: z.coerce.number().optional(),
  name: z.string().optional(),
  isAlphabetical: z.coerce.boolean().optional(),
  createdBefore: z.string().datetime().optional(),
  createdAfter: z.string().datetime().optional(),
  updatedBefore: z.string().datetime().optional(),
  updatedAfter: z.string().datetime().optional(),
});

export const GET = async (req: NextRequest) => {
  const unauthorizedResponse = await verifyAuthentication();
  if (unauthorizedResponse) return unauthorizedResponse;

  const searchParams = req.nextUrl.searchParams;
  const urlParams = Object.fromEntries(searchParams.entries());
  const params = getRequestParams.parse(urlParams);
  const paginationDefaultSize = 100;

  const query = supabase
    .from("m_category")
    .select("*")
    .range(
      (params.paginationPage - 1) * paginationDefaultSize,
      params.paginationPage * paginationDefaultSize
    )
    .eq("boActive", true)
    .eq("boStatus", true);
  if (params.name) {
    query.eq("txCategoryName", params.name);
  }
  if (params.isAlphabetical === true) {
    query.order("txCategoryName", {
      ascending: params.isAlphabetical,
    });
  } else if (params.isAlphabetical === false) {
    query.order("txCategoryName", {
      ascending: params.isAlphabetical,
    });
  }

  if (params.createdBefore) {
    query.lt("daCreatedAt", params.createdBefore);
  }
  if (params.createdAfter) {
    query.gt("daCreatedAt", params.createdAfter);
  }

  if (params.updatedBefore) {
    query.lt("daUpdatedAt", params.updatedBefore);
  }
  if (params.updatedAfter) {
    query.gt("daUpdatedAt", params.updatedAfter);
  }

  const { data, error } = await query;
  if (data && data.length === 0) {
    return NextResponse.json(
      { error: "Error 404 : Data Not Found." },
      { status: 404 }
    );
  }
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const unauthorizedResponse = await verifyAuthentication();
  if (unauthorizedResponse) return unauthorizedResponse;

  let body: Record<string, string> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "400 Bad Request : Invalid JSON Payload" },
      { status: 400 }
    );
  } finally {
    // TODO : handle something regarding logging
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
