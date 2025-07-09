import { supabase } from "@supabase-config";
import { NextResponse } from "next/server";

export async function verifyAuthentication(): Promise<NextResponse<unknown> | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "401 Unauthorized" }, { status: 401 });
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
