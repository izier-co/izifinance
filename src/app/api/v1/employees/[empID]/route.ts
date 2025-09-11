import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/api/supabase_server.config";
import { isValidInt, removeByKey } from "@/lib/lib";
import z from "zod";
import constValues from "@/lib/constants";

const editEmployeeSchema = z.object({
  txFullName: z.string().nonempty().max(constValues.maxShortTextLength),
  daDateOfBirth: z.iso.date(),
  txHomeAddress: z.string().nonempty().max(constValues.maxTextLength),
  txReligionCode: z.string().nonempty(),
  txTaxNumber: z
    .string()
    .nonempty()
    .refine((num) => isValidInt(num)),
  boMarriageStatus: z.boolean(),
  inNumOfDeps: z.number().int(),
  flSalary: z.float32(),
  txRoleCode: z.string(),
  txEmploymentTypeCode: z.string(),
  txCompanyCode: z.string(),
  txPhoneNumber: z
    .string()
    .nonempty()
    .refine((num) => isValidInt(num)),
  txEmailAddress: z.email(),
  txBankTypeCode: z.string(),
  txBankAccountNumber: z
    .string()
    .nonempty()
    .refine((num) => isValidInt(num)),
});

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ empID: string }> }
) {
  const supabase = await createClient();
  const searchParams = req.nextUrl.searchParams;
  const params = await props.params;
  const fields = searchParams.get("fields");
  let tableFields = "*";

  if (fields && fields !== "") {
    tableFields = fields;
  }
  const { data, error } = await supabase
    .from("m_employees")
    .select(tableFields)
    .eq("txEmployeeCode", params.empID);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = removeByKey(data);

  return NextResponse.json(
    {
      data: sanitizedData,
      pagination: {},
    },
    { status: 200 }
  );
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ empID: string }> }
) {
  const params = await props.params;
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

  const employeeModel = editEmployeeSchema.safeParse(body);
  if (!employeeModel.success) {
    return NextResponse.json(
      { error: `400 Bad Request : ${employeeModel.error}` },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("m_employees")
    .update(employeeModel.data)
    .eq("txEmployeeCode", params.empID)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = removeByKey(data);

  return NextResponse.json(
    {
      message: "Data Successfully Updated!",
      data: sanitizedData,
    },
    { status: 200 }
  );
}
