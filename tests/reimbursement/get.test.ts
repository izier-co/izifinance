import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase, testingGlobalVars } from "../__mocks__/supabase.mock";
import { mockDrizzle } from "../__mocks__/drizzle.mock";
import { GET } from "@/app/api/v1/reimbursement/route";
import { NextRequest } from "next/server";
import { AuthError } from "@supabase/supabase-js";
import { afterEach } from "node:test";

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

afterEach(() => {
  vitest.clearAllMocks();
});

const MILISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
const NOW = Date.now();
const YESTERDAY = new Date(NOW - MILISECONDS_IN_DAY).toISOString();
const TOMORROW = new Date(NOW + MILISECONDS_IN_DAY).toISOString();
const DAY_BEFORE_YESTERDAY = new Date(NOW - MILISECONDS_IN_DAY).toISOString();
const DAY_AFTER_TOMORROW = new Date(NOW + MILISECONDS_IN_DAY).toISOString();

const urlParams = {
  pageIDStr: "2",
  pageIDNum: 2,
  reimbursementIDStr: "1",
  reimbursementIDNum: 1,
  paginationSizeStr: "50",
  paginationSizeNum: 50,
  status: "Pending",
  bankIDStr: "123456",
  bankIDNum: 123456,
  recipientCodeStr: "98765",
  recipientCodeNum: 98765,
  fieldsStr: "inReimbursementNoteID,inRecipientCompanyCode",
  selectAllFieldsStr: "*",
};

const mockParams = {
  paginationPage: urlParams.pageIDStr,
  paginationSize: urlParams.paginationSizeStr,
  id: urlParams.reimbursementIDStr,
  status: urlParams.status,
  bankTypeCode: urlParams.bankIDStr,
  recipientCompanyCode: urlParams.recipientCodeStr,
  fields: urlParams.fieldsStr,
  createdBefore: TOMORROW,
  createdAfter: YESTERDAY,
  updatedBefore: DAY_AFTER_TOMORROW,
  updatedAfter: DAY_BEFORE_YESTERDAY,
};

// question mark for easy concaternation
const url = "localhost:3000?";
const req = new NextRequest(url);

// use toString for generating URL params dynamically
const urlParamString = new URLSearchParams(mockParams).toString();
const reqWithoutDetails = new NextRequest(url + urlParamString);
const urlParamsWithDetails = new URLSearchParams({
  id: urlParams.reimbursementIDStr,
  withNotes: "true",
}).toString();
const reqWithDetails = new NextRequest(url + urlParamsWithDetails);

const expectedEqCalls = [
  ["inReimbursementNoteID", urlParams.reimbursementIDNum],
  ["txStatus", urlParams.status],
  ["inBankTypeCode", urlParams.bankIDNum],
  ["inRecipientCompanyCode", urlParams.recipientCodeNum],
];

const expectedGtCalls = [
  ["daCreatedAt", YESTERDAY],
  ["daUpdatedAt", DAY_BEFORE_YESTERDAY],
];

const expectedLtCalls = [
  ["daCreatedAt", TOMORROW],
  ["daUpdatedAt", DAY_AFTER_TOMORROW],
];

describe("GET /reimbursement success cases", () => {
  test("GET without parameters", async () => {
    const response = await GET(req);
    expect(response.status).toBe(200);
  });

  test("GET with url parameters and correct pagination", async () => {
    const response = await GET(reqWithoutDetails);

    const responseData = await response.json();
    const metadata = responseData["meta"];

    expect(response.status).toBe(200);
    expect(metadata["isFirstPage"]).toBe(urlParams.pageIDNum === 1);
    expect(metadata["isLastPage"]).toBe(
      metadata["dataCount"] < urlParams.paginationSizeNum
    );
    expect(metadata["dataCount"]).toBe(responseData["data"].length);
    expect(metadata["totalDataCount"]).toBe(testingGlobalVars.MOCK_COUNT);
    expect(metadata["pageCount"]).toBe(
      testingGlobalVars.MOCK_COUNT / urlParams.paginationSizeNum
    );
    expect(metadata["offset"]).toBe(
      (urlParams.pageIDNum - 1) * urlParams.paginationSizeNum
    );
    expect(metadata["pageNumber"]).toBe(urlParams.pageIDNum);
    expect(metadata["paginationSize"]).toBe(urlParams.paginationSizeNum);
  });

  test("GET lists with correct Supabase function parameters", async () => {
    const response = await GET(reqWithoutDetails);

    const eqCalls = mockSupabase.eq.mock.calls;
    const gtCalls = mockSupabase.gt.mock.calls;
    const ltCalls = mockSupabase.lt.mock.calls;

    expect(response.status).toBe(200);

    expect(mockSupabase.select).toHaveBeenCalledWith(urlParams.fieldsStr, {
      count: "exact",
    });

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

  test("GET a list with detail given", async () => {
    const response = await GET(reqWithDetails);

    expect(response.status).toBe(200);
    expect(mockSupabase.select).toHaveBeenCalledWith(
      "*, reimbursement_items(*)",
      {
        count: "exact",
      }
    );
  });
});

describe("GET /reimbursement failure cases", () => {
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
