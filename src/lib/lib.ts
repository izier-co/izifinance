import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { JSONValue } from "postgres";
import { getCookies, getDomain } from "./server-lib";

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
    if (key === "uiIdempotencyKey") {
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
