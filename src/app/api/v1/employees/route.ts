import { isValidInt, removeByKey, sortArray } from "@/lib/lib";
import { createClient } from "@/app/api/supabase_server.config";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import constValues from "@/lib/constants";

const addEmployeeSchema = z.object({
  daJoinDate: z.iso.date(),
  inYear: z.string().length(4), // string here for formatting consistency
  inMonth: z.string().length(2),
  txFullName: z.string().nonempty().max(constValues.maxShortTextLength),
  daDateOfBirth: z.iso.date(),
  txHomeAddress: z.string().nonempty().max(constValues.maxTextLength),
  txNationalIdNumber: z
    .string()
    .nonempty()
    .refine((num) => isValidInt(num)),
  txReligionCode: z.string().nonempty(),
  txTaxNumber: z
    .string()
    .nonempty()
    .refine((num) => isValidInt(num)),
  boMarriageStatus: z.boolean().default(false),
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

const getRequestParams = z.object({
  paginationPage: z.coerce.number().positive().default(1),
  paginationSize: z.coerce.number().positive().min(1).optional(),
  fields: z
    .string()
    .optional()
    .transform((str) => {
      return str?.replace(constValues.allowOnlyAlphabeticAndCommaPattern, "");
    }),
  sortArray: z.string().optional().transform(sortArray),
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
    .from("m_employees")
    .select(tableFields, { count: "exact" })
    .range(
      (params.paginationPage - 1) * paginationSize,
      params.paginationPage * paginationSize - 1
    );

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

  const sanitizedData = removeByKey(data);

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

export async function POST(req: NextRequest) {
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

  const employeeModel = addEmployeeSchema.safeParse(body);
  if (!employeeModel.success) {
    return NextResponse.json(
      { error: `400 Bad Request : ${employeeModel.error}` },
      { status: 400 }
    );
  }
  const employeeData = employeeModel.data;

  const { data: roleInfo, error: roleError } = await supabase
    .from("m_employment")
    .select("txEmploymentTypeName")
    .eq("txEmploymentTypeCode", employeeData.txEmploymentTypeCode);

  if (roleError)
    return NextResponse.json({ error: roleError.message }, { status: 500 });

  let roleID = "";

  if (roleInfo) {
    if (roleInfo[0].txEmploymentTypeName === "Full Time") roleID = "F";
    else if (roleInfo[0].txEmploymentTypeName === "Part Time") roleID = "P";
    else if (roleInfo[0].txEmploymentTypeName === "Internship") roleID = "I";
  } else {
    return NextResponse.json({ error: "Invalid Role" }, { status: 400 });
  }

  const {
    data: empIDCounter,
    count,
    error: empIDLookupError,
  } = await supabase
    .from("m_employees")
    .select("txEmployeeNumber", {
      count: "exact",
    })
    .order("txEmployeeNumber", {
      ascending: false,
    })
    .eq("inYear", employeeData.inYear)
    .eq("inMonth", employeeData.inMonth);

  if (empIDLookupError)
    return NextResponse.json(
      { error: empIDLookupError.message },
      { status: 500 }
    );
  let newEmpIDNumber = Number(
    `${employeeData.inYear.slice(2, 4)}${employeeData.inMonth}001`
  );
  if (count !== null && count > 0) {
    const empCount = Number(empIDCounter[0].txEmployeeNumber);
    const empNum = String(empCount + 1).padStart(3, "0");
    newEmpIDNumber = Number(
      `${employeeData.inYear.slice(2, 4)}${employeeData.inMonth}${empNum}`
    );
  }
  const base64chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const empID =
    roleID + String(newEmpIDNumber) + base64chars[newEmpIDNumber % 64];

  const { data, error } = await supabase
    .from("m_employees")
    .insert({ ...employeeData, txEmployeeCode: empID })
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sanitizedData = removeByKey(data);

  return NextResponse.json(
    {
      message: "Data Successfully Inserted!",
      data: sanitizedData,
    },
    { status: 201 }
  );
}
