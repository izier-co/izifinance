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

const MILISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
const NOW = Date.now();
const YESTERDAY = new Date(NOW - MILISECONDS_IN_DAY).toISOString();
const TOMORROW = new Date(NOW + MILISECONDS_IN_DAY).toISOString();
const DAY_BEFORE_YESTERDAY = new Date(NOW - MILISECONDS_IN_DAY).toISOString();
const DAY_AFTER_TOMORROW = new Date(NOW + MILISECONDS_IN_DAY).toISOString();

const testPageID = "2";
const testIDStr = "1";
const paginationSize = "50";
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
    mockSearchParams.append("paginationPage", testPageID);
    mockSearchParams.append("id", testIDStr);
    mockSearchParams.append("status", testStatus);
    mockSearchParams.append("bankTypeCode", testBankID);
    mockSearchParams.append("recipientCompanyCode", testRecipientCode);

    // uses timestamp as input
    mockSearchParams.append("createdBefore", TOMORROW);
    mockSearchParams.append("createdAfter", YESTERDAY);
    mockSearchParams.append("updatedBefore", DAY_AFTER_TOMORROW);
    mockSearchParams.append("updatedAfter", DAY_BEFORE_YESTERDAY);

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
    mockSearchParams.append("paginationPage", testPageID);
    mockSearchParams.append("paginationSize", paginationSize);
    mockSearchParams.append("id", testIDStr);
    mockSearchParams.append("status", testStatus);
    mockSearchParams.append("bankTypeCode", testBankID);
    mockSearchParams.append("recipientCompanyCode", testRecipientCode);
    mockSearchParams.append("withNotes", "true");

    mockSearchParams.append("createdBefore", TOMORROW);
    mockSearchParams.append("createdAfter", YESTERDAY);
    mockSearchParams.append("updatedBefore", DAY_AFTER_TOMORROW);
    mockSearchParams.append("updatedAfter", DAY_BEFORE_YESTERDAY);

    await GET(reqWithDetails);

    const eqCalls = mockSupabase.eq.mock.calls;
    const gtCalls = mockSupabase.gt.mock.calls;
    const ltCalls = mockSupabase.lt.mock.calls;

    expect(mockSupabase.range).toHaveBeenCalledWith(
      (Number.parseInt(testPageID) - 1) * Number.parseInt(paginationSize),
      Number.parseInt(testPageID) * Number.parseInt(paginationSize)
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
