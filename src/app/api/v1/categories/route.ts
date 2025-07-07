import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@supabase-config";

import { z } from "zod";
import constValues from "@/lib/constants";

const categorySchema = z.object({
  txCategoryName: z
    .string()
    .max(constValues.maxShortTextLength)
    .transform((str) => {
      str?.replace(constValues.allowOnlyAlphanumericAndSpaceOnlyPattern, "");
    }),
  txCategoryDescription: z
    .string()
    .max(constValues.maxTextLength)
    .nullable()
    .transform((str) => {
      str?.replace(constValues.allowOnlyAlphanumericAndSpaceOnlyPattern, "");
    }),
});

const getRequestParams = z.object({
  paginationPage: z.coerce.number().positive().default(1),
  paginationSize: z.coerce.number().positive().min(1).optional(),
  name: z
    .string()
    .optional()
    .transform((str) => {
      str?.replace(constValues.allowOnlyAlphanumericAndSpaceOnlyPattern, "");
    }),
  isAlphabetical: z.coerce.boolean().optional(),
  fields: z
    .string()
    .optional()
    .transform((str) => {
      str?.replace(constValues.allowOnlyAlphabeticAndCommaPattern, "");
    }),
  createdBefore: z.string().datetime().optional(),
  createdAfter: z.string().datetime().optional(),
  updatedBefore: z.string().datetime().optional(),
  updatedAfter: z.string().datetime().optional(),
});

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const urlParams = Object.fromEntries(searchParams.entries());
  const paramModel = getRequestParams.safeParse(urlParams);

  if (!paramModel.success) {
    return NextResponse.json(
      { error: `400 Bad Request : ${paramModel.error}` },
      { status: 400 }
    );
  }
  const params = paramModel.data;

  let paginationSize = 100;
  if (params.paginationSize) {
    paginationSize = params.paginationSize;
  }
  let tableFields = "*";

  if (params.fields && params.fields !== "") {
    tableFields = params.fields;
  }

  const query = supabase
    .from("m_category")
    .select(tableFields, { count: "exact" })
    .range(
      (params.paginationPage - 1) * paginationSize,
      params.paginationPage * paginationSize
    )
    .eq("boActive", true)
    .eq("boStatus", true);
  if (params.name) {
    // case insensitive matching
    query.ilike("txCategoryName", params.name);
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

  const { data, count, error } = await query;
  let pageCount: number | null = null;
  if (count) {
    pageCount = Math.floor(count / paginationSize);
  }
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(
    {
      data: data,
      meta: {
        isFirstPage: params.paginationPage === 1,
        isLastPage: data.length < paginationSize,
        dataCount: data.length,
        totalDataCount: count,
        pageCount: pageCount,
        offset: (params.paginationPage - 1) * paginationSize,
        pageNumber: params.paginationPage,
        paginationSize: paginationSize,
      },
    },
    { status: 200 }
  );
};

export const POST = async (req: NextRequest) => {
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

  const { data, error } = await supabase
    .from("m_category")
    .insert(categoryModel.data)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(
    {
      message: "Data Successfully Inserted!",
      data: data,
    },
    { status: 201 }
  );
};
