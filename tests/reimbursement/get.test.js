import { describe, test, expect, vitest } from "vitest";

import { mockSupabase } from "../__mocks__/supabase.mock";
import { mockDrizzle } from "../__mocks__/drizzle.mock";
import { GET } from "@/app/api/v1/reimbursement/route";
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
  test("GET without parameters", async () => {
    const response = await GET(req);
    expect(response.status).toBe(200);
  });

  test("GET lists without detail", async () => {
    reqWithoutDetails.nextUrl.searchParams.append("page", testPageID);
    reqWithoutDetails.nextUrl.searchParams.append("id", testIDStr);
    reqWithoutDetails.nextUrl.searchParams.append("status", testStatus);
    reqWithoutDetails.nextUrl.searchParams.append("bank-type-code", testBankID);
    reqWithoutDetails.nextUrl.searchParams.append(
      "recipient-company-code",
      testRecipientCode
    );

    // uses timestamp as input
    reqWithoutDetails.nextUrl.searchParams.append("created-before", TOMORROW);
    reqWithoutDetails.nextUrl.searchParams.append("created-after", YESTERDAY);
    reqWithoutDetails.nextUrl.searchParams.append(
      "updated-before",
      DAY_AFTER_TOMORROW
    );
    reqWithoutDetails.nextUrl.searchParams.append(
      "updated-after",
      DAY_BEFORE_YESTERDAY
    );

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
    reqWithDetails.nextUrl.searchParams.append("page", testPageID);
    reqWithDetails.nextUrl.searchParams.append("id", testIDStr);
    reqWithDetails.nextUrl.searchParams.append("status", testStatus);
    reqWithDetails.nextUrl.searchParams.append("bank-type-code", testBankID);
    reqWithDetails.nextUrl.searchParams.append("with-notes", "true");
    reqWithDetails.nextUrl.searchParams.append(
      "recipient-company-code",
      testRecipientCode
    );

    // uses timestamp as input
    reqWithDetails.nextUrl.searchParams.append("created-before", TOMORROW);
    reqWithDetails.nextUrl.searchParams.append("created-after", YESTERDAY);
    reqWithDetails.nextUrl.searchParams.append(
      "updated-before",
      DAY_AFTER_TOMORROW
    );
    reqWithDetails.nextUrl.searchParams.append(
      "updated-after",
      DAY_BEFORE_YESTERDAY
    );
    await GET(reqWithDetails);

    const eqCalls = mockSupabase.eq.mock.calls;
    const gtCalls = mockSupabase.gt.mock.calls;
    const ltCalls = mockSupabase.lt.mock.calls;

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
