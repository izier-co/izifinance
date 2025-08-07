import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/app/api/supabase_server.config";

import { z } from "zod";
import constValues from "@/lib/constants";
import { sanitizeDatabaseOutputs, sortArray } from "@/lib/lib";

const categorySchema = z.object({
  txCategoryName: z
    .string()
    .max(constValues.maxShortTextLength)
    .transform((str) => {
      return str?.replace(
        constValues.allowOnlyAlphanumericAndSpaceOnlyPattern,
        ""
      );
    }),
  txCategoryDescription: z
    .string()
    .max(constValues.maxTextLength)
    .nullable()
    .transform((str) => {
      return str?.replace(
        constValues.allowOnlyAlphanumericAndSpaceOnlyPattern,
        ""
      );
    }),
});

const getRequestParams = z.object({
  paginationPage: z.coerce.number().positive().default(1),
  paginationSize: z.coerce.number().positive().min(1).optional(),
  name: z
    .string()
    .optional()
    .transform((str) => {
      return str?.replace(
        constValues.allowOnlyAlphanumericAndSpaceOnlyPattern,
        ""
      );
    }),
  includeDeleted: z.coerce.boolean().default(false),
  fields: z
    .string()
    .optional()
    .transform((str) => {
      return str?.replace(constValues.allowOnlyAlphabeticAndCommaPattern, "");
    }),
  sortArray: z
    .string()
    .optional()
    .transform(sortArray),
  createdBefore: z.iso.datetime().optional(),
  createdAfter: z.iso.datetime().optional(),
  updatedBefore: z.iso.datetime().optional(),
  updatedAfter: z.iso.datetime().optional(),
});

export const GET = async (req: NextRequest) => {
  const supabase = await createClient();
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
      params.paginationPage * paginationSize - 1
    );

  if (params.includeDeleted === false) {
    query.eq("boActive", true);
    query.eq("boStatus", true);
  }

  if (params.name) {
    // case insensitive matching
    query.ilike("txCategoryName", params.name);
  }
  if (params.sortArray) {
    for (let i = 0; i < params.sortArray.length; i++) {
      query.order(params.sortArray[i].fieldName, {
        ascending: params.sortArray[i].sortState,
      });
    }
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

  const sanitizedData = sanitizeDatabaseOutputs(data);

  return NextResponse.json(
    {
      data: sanitizedData,
      pagination: {
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
  const supabase = await createClient();
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

  const sanitizedData = sanitizeDatabaseOutputs(data);

  return NextResponse.json(
    {
      message: "Data Successfully Inserted!",
      data: sanitizedData,
    },
    { status: 201 }
  );
};
