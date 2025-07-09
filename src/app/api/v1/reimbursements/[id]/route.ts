import constValues from "@/lib/constants";
import { sanitizeDatabaseOutputs } from "@/lib/lib";
import { supabase } from "@supabase-config";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const descriptionValidator = z
  .string()
  .max(constValues.maxTextLength)
  .transform((str) => {
    return str?.replace(
      constValues.allowOnlyAlphanumericAndSpaceOnlyPattern,
      ""
    );
  });

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) => {
  const searchParams = req.nextUrl.searchParams;
  const fields = searchParams.get("fields");
  const urlParams = await props.params;

  let tableQueryString = "*";

  if (fields) {
    tableQueryString = fields;
  }

  const { data, error } = await supabase
    .from("reimbursement_notes")
    .select(tableQueryString)
    .eq("txReimbursementNoteID", urlParams.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = sanitizeDatabaseOutputs(data);

  return NextResponse.json(
    {
      data: sanitizedData,
      meta: {},
    },
    { status: 200 }
  );
};

export const PUT = async (
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) => {
  const urlParams = await props.params;
  let descriptionBody;
  try {
    const body = await req.json();
    descriptionBody = body["description"];
  } catch {
    return NextResponse.json(
      { error: "400 Bad Request : Invalid JSON Payload" },
      { status: 400 }
    );
  } finally {
    // TODO : handle something regarding logging
  }
  const descriptionResult = descriptionValidator.safeParse(descriptionBody);
  if (!descriptionResult.success) {
    return NextResponse.json(
      { error: `400 Bad Request : ${descriptionResult.error}` },
      { status: 400 }
    );
  }

  const newDescription = descriptionResult.data;

  const { data, error } = await supabase
    .from("reimbursement_notes")
    .update({ txDescriptionDetails: newDescription })
    .eq("txReimbursementNoteID", urlParams.id)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = sanitizeDatabaseOutputs(data);

  return NextResponse.json(
    {
      message: "Data Successfully Updated!",
      data: sanitizedData,
    },
    { status: 200 }
  );
};
