import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { JSONValue } from "postgres";
import { getCookies, getDomain } from "./server-lib";
import constValues from "./constants";

export async function verifyAuthentication(
  supabase: SupabaseClient<any, any, any>
): Promise<NextResponse<unknown> | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "401 Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function authorizeAdmin(
  supabase: SupabaseClient<any, any, any>
): Promise<NextResponse<JSONValue> | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "401 Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("m_employees")
    .select("*")
    .eq("uiUserID", user.id)
    .eq("boHasAdminAccess", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (data.length === 0) {
    return NextResponse.json({ error: "403 Forbidden" }, { status: 403 });
  }
  return null;
}

export function isValidInt(str: string): boolean {
  return !isNaN(Number.parseInt(str));
}

export function sortArray(str?: string) {
  if (str === undefined) {
    return undefined;
  }
  const resultArray = [];
  const filteredStr = str.replace(constValues.allowSortingPattern, "");
  const strArray = filteredStr.split(",");
  for (let i = 0; i < strArray.length; i++) {
    let sortState = undefined;
    if (strArray[i][0] === "+") sortState = true;
    if (strArray[i][0] === "-") sortState = false;
    resultArray.push({
      fieldName: strArray[i].substring(1),
      sortState: sortState,
    });
    return resultArray;
  }
}

export function sanitizeDatabaseOutputs(obj: object[]): object {
  obj.map((v) => {
    if ("uiReimbursementID" in v) {
      delete v.uiReimbursementID;
    }
    if ("uiIdempotencyKey" in v) {
      delete v.uiIdempotencyKey;
    }
    if ("uiReimbursementItemID" in v) {
      delete v.uiReimbursementItemID;
    }
    if ("uiCategoryID" in v) {
      delete v.uiCategoryID;
    }
  });
  return obj;
}

export function removeByKey(data: object): object {
  const jsonString = JSON.stringify(data, (key, value) => {
    if (key === "uiReimbursementID") {
      return undefined;
    }
    if (key === "uiBankId") {
      return undefined;
    }
    if (key === "uiCompanyId") {
      return undefined;
    }
    if (key === "uiEmployeeId") {
      return undefined;
    }
    if (key === "uiReimbursementItemID") {
      return undefined;
    }
    if (key === "uiCategoryID") {
      return undefined;
    }
    return value;
  });
  return JSON.parse(jsonString);
}

export async function fetchJSONAPI(
  method: string,
  url: string,
  jsonBody?: object
) {
  const domain = await getDomain();
  const cookies = await getCookies();
  const fullURL = domain + url;

  return await fetch(fullURL, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      cookie: cookies,
    },
    body: JSON.stringify(jsonBody),
  });
}

export function assemblePathName(pathNameList: Array<string>, index: number) {
  if (Number.isInteger(index) && 0 <= index && index < pathNameList.length) {
    let resultStr = "/";
    for (let i = 0; i <= index; i++) {
      resultStr += pathNameList[i] + "/";
    }
    return resultStr;
  } else {
    return "#";
  }
}
