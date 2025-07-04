import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../../__mocks__/supabase.mock";
import { mockDrizzle } from "../../__mocks__/drizzle.mock";
import { PUT } from "@/app/api/v1/reimbursements/[id]/void/route";
import { NextRequest } from "next/server";

vitest.mock("@supabase-config", () => {
  return {
    supabase: mockSupabase,
  };
});

vitest.mock("@drizzle-db", () => {
  return {
    db: mockDrizzle,
  };
});

beforeEach(() => {
  vitest.clearAllMocks();
});

// separation to not pollute the original request
const req = new NextRequest("localhost:3000");
const reqWithParams = new NextRequest("localhost:3000");
const idParam = "1";

const mockResponseObject = {
  uiReimbursementID: "some-id",
  daCreatedAt: new Date().toISOString(),
  daUpdatedAt: new Date().toISOString(),
  inReimbursementNoteID: 123,
  txStatus: "Void",
  txNotes: "Mock Reason",
  txRecipientAccount: "1234567890",
  inBankTypeCode: 1,
  inRecipientCompanyCode: 1,
  txBankAccountCode: "12345678901234567890",
  txChangeReason: null,
};

describe("PUT /reimbursements success cases", () => {
  test("PUT with ID parameter", async () => {
    vitest.useFakeTimers();
    vitest.setSystemTime(new Date()); // fixes the time
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: mockResponseObject, error: null });
    });
    reqWithParams.nextUrl.searchParams.append("id", idParam);
    const response = await PUT(reqWithParams);
    const body = await response.json();
    expect(mockSupabase.update).toHaveBeenCalledWith({
      txStatus: "Void",
      daUpdatedAt: new Date().toISOString(),
    });
    expect(mockSupabase.eq).toHaveBeenCalledWith(
      "inReimbursementNoteID",
      Number.parseInt(idParam)
    );
    expect(response.status).toBe(200);
    expect(body).toEqual({
      message: "Data Successfully Updated!",
      data: mockResponseObject,
    });

    vitest.useRealTimers();
  });
});

describe("PUT /reimbursements failure cases", () => {
  test("PUT with unregistered user", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({
      data: {
        user: null,
      },
    });
    const response = await PUT(req);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "401 Unauthorized",
    });
  });
  test("PUT without parameters", async () => {
    const response = await PUT(req);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "400 Bad Request : id parameter is required",
    });
  });

  test("PUT with ID parameter but there is an error", async () => {
    const mockError = Error();
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: null, error: mockError });
    });
    req.nextUrl.searchParams.append("id", idParam);
    const response = await PUT(req);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: mockError.message });
  });
});
