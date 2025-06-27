import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../__mocks__/supabase.mock";
import { mockDrizzle } from "../__mocks__/drizzle.mock";
import { GET } from "@/app/api/v1/reimbursement/route";
import { NextRequest } from "next/server";
import { AuthError } from "@supabase/supabase-js";

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

const url = "localhost:3000";
const req = new NextRequest(url);
const reqWithoutDetails = new NextRequest(url);
const reqWithDetails = new NextRequest(url);

const SECONDS_IN_DAY = 60 * 60 * 24;
const YESTERDAY = Date.now() - SECONDS_IN_DAY;
const TOMORROW = Date.now() + SECONDS_IN_DAY;
const DAY_BEFORE_YESTERDAY = Date.now() - SECONDS_IN_DAY;
const DAY_AFTER_TOMORROW = Date.now() + SECONDS_IN_DAY;

const testPageID = "2";
const testIDStr = "1";
const testStatus = "Pending";
const testBankID = "123456";
const testRecipientCode = "98765";

// expected to become ISO string in API
const expectedEqCalls = [
  ["inReimbursementNoteID", Number.parseInt(testIDStr)],
  ["txStatus", testStatus],
  ["inBankTypeCode", Number.parseInt(testBankID)],
  ["inRecipientCompanyCode", Number.parseInt(testRecipientCode)],
];

const expectedGtCalls = [
  ["daCreatedAt", new Date(YESTERDAY).toISOString()],
  ["daUpdatedAt", new Date(DAY_BEFORE_YESTERDAY).toISOString()],
];

const expectedLtCalls = [
  ["daCreatedAt", new Date(TOMORROW).toISOString()],
  ["daUpdatedAt", new Date(DAY_AFTER_TOMORROW).toISOString()],
];

describe("GET /reimbursement tests", () => {
  test("GET without authorization", async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: null,
      },
      error: new AuthError("Mock Auth Error"),
    });
    const response = await GET(req);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "401 Unauthorized",
    });
  });
  test("GET with unregistered user", async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: null,
      },
      error: null,
    });
    const response = await GET(req);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "401 Unauthorized",
    });
  });
  test("GET without parameters", async () => {
    const response = await GET(req);
    expect(response.status).toBe(200);
  });

  test("GET lists without detail", async () => {
    const mockSearchParams = reqWithoutDetails.nextUrl.searchParams;
    mockSearchParams.append("page", testPageID);
    mockSearchParams.append("id", testIDStr);
    mockSearchParams.append("status", testStatus);
    mockSearchParams.append("bank-type-code", testBankID);
    mockSearchParams.append("recipient-company-code", testRecipientCode);

    // uses timestamp as input
    mockSearchParams.append("created-before", TOMORROW.toString());
    mockSearchParams.append("created-after", YESTERDAY.toString());
    mockSearchParams.append("updated-before", DAY_AFTER_TOMORROW.toString());
    mockSearchParams.append("updated-after", DAY_BEFORE_YESTERDAY.toString());

    await GET(reqWithoutDetails);

    const eqCalls = mockSupabase.eq.mock.calls;
    const gtCalls = mockSupabase.gt.mock.calls;
    const ltCalls = mockSupabase.lt.mock.calls;

    expect(mockSupabase.select).toHaveBeenCalledWith("*");

    for (const [expectedKey, expectedValue] of expectedEqCalls) {
      const found = eqCalls.some(
        ([actualKey, actualValue]) =>
          actualKey === expectedKey && actualValue === expectedValue
      );
      expect(found).toBe(true);
    }

    for (const [expectedKey, expectedValue] of expectedGtCalls) {
      const found = gtCalls.some(
        ([actualKey, actualValue]) =>
          actualKey === expectedKey && actualValue === expectedValue
      );
      expect(found).toBe(true);
    }

    for (const [expectedKey, expectedValue] of expectedLtCalls) {
      const found = ltCalls.some(
        ([actualKey, actualValue]) =>
          actualKey === expectedKey && actualValue === expectedValue
      );
      expect(found).toBe(true);
    }
  });

  test("GET a list with detail", async () => {
    const mockSearchParams = reqWithDetails.nextUrl.searchParams;
    mockSearchParams.append("page", testPageID);
    mockSearchParams.append("id", testIDStr);
    mockSearchParams.append("status", testStatus);
    mockSearchParams.append("bank-type-code", testBankID);
    mockSearchParams.append("with-notes", "true");
    mockSearchParams.append("recipient-company-code", testRecipientCode);

    // uses timestamp as input
    mockSearchParams.append("created-before", TOMORROW.toString());
    mockSearchParams.append("created-after", YESTERDAY.toString());
    mockSearchParams.append("updated-before", DAY_AFTER_TOMORROW.toString());
    mockSearchParams.append("updated-after", DAY_BEFORE_YESTERDAY.toString());

    await GET(reqWithDetails);

    const eqCalls = mockSupabase.eq.mock.calls;
    const gtCalls = mockSupabase.gt.mock.calls;
    const ltCalls = mockSupabase.lt.mock.calls;

    const paginationSize = 100;

    expect(mockSupabase.range).toHaveBeenCalledWith(
      (Number.parseInt(testPageID) - 1) * paginationSize,
      Number.parseInt(testPageID) * paginationSize
    );

    expect(mockSupabase.select).toHaveBeenCalledWith(
      "*, reimbursement_items(*)"
    );

    for (const [expectedKey, expectedValue] of expectedEqCalls) {
      const found = eqCalls.some(
        ([actualKey, actualValue]) =>
          actualKey === expectedKey && actualValue === expectedValue
      );
      expect(found).toBe(true);
    }

    for (const [expectedKey, expectedValue] of expectedGtCalls) {
      const found = gtCalls.some(
        ([actualKey, actualValue]) =>
          actualKey === expectedKey && actualValue === expectedValue
      );
      expect(found).toBe(true);
    }

    for (const [expectedKey, expectedValue] of expectedLtCalls) {
      const found = ltCalls.some(
        ([actualKey, actualValue]) =>
          actualKey === expectedKey && actualValue === expectedValue
      );
      expect(found).toBe(true);
    }
  });

  test("GET normally but with error in database", async () => {
    const mockError = Error();
    mockSupabase.then.mockImplementation((onFulfilled) => {
      onFulfilled({ data: null, error: mockError });
    });
    const response = await GET(req);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: mockError.message });
  });
});
