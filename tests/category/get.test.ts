import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase, testingGlobalVars } from "../__mocks__/supabase.mock";
import { GET } from "@/app/api/v1/categories/route";
import { NextRequest } from "next/server";

vitest.mock("@supabase-config", () => {
  return {
    supabase: mockSupabase,
  };
});

beforeEach(() => {
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
  paginationSizeStr: "50",
  paginationSizeNum: 50,
  nameStr: "abc",
  fieldsStr: "inReimbursementNoteID,inRecipientCompanyCode",
  isAlphabeticalStr: "true",
  selectAllStr: "*",
};

const mockParams = {
  paginationPage: urlParams.pageIDStr,
  paginationSize: urlParams.paginationSizeStr,
  fields: urlParams.fieldsStr,
  name: urlParams.nameStr,
  isAlphabetical: urlParams.isAlphabeticalStr,
  createdBefore: TOMORROW,
  createdAfter: YESTERDAY,
  updatedBefore: DAY_AFTER_TOMORROW,
  updatedAfter: DAY_BEFORE_YESTERDAY,
};

// question mark for easy concaternation
const url = "localhost:3000?";
const req = new NextRequest(url);
const urlParamString = new URLSearchParams(mockParams).toString();
const reqWithParams = new NextRequest(url + urlParamString);

const expectedGtCalls = [
  ["daCreatedAt", YESTERDAY],
  ["daUpdatedAt", DAY_BEFORE_YESTERDAY],
];

const expectedLtCalls = [
  ["daCreatedAt", TOMORROW],
  ["daUpdatedAt", DAY_AFTER_TOMORROW],
];

const mockError = Error();

describe("GET /categories successes", () => {
  test("GET without parameters", async () => {
    const response = await GET(req);
    expect(response.status).toBe(200);
  });

  test("GET with url parameters and correct pagination", async () => {
    const response = await GET(reqWithParams);
    expect(response.status).toBe(200);

    const responseData = await response.json();
    const metadata = responseData["meta"];

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
    const response = await GET(reqWithParams);
    expect(response.status).toBe(200);

    expect(mockSupabase.select).toHaveBeenCalledWith(urlParams.fieldsStr, {
      count: "exact",
    });

    expect(mockSupabase.range).toHaveBeenCalledWith(
      (urlParams.pageIDNum - 1) * urlParams.paginationSizeNum,
      urlParams.pageIDNum * urlParams.paginationSizeNum
    );
    expect(mockSupabase.order).toHaveBeenCalledWith("txCategoryName", {
      ascending: true,
    });

    // checks if within the eq, lt and gt chain
    // contains the desired parameters (order doesn't matter)

    const ilikeCalls = mockSupabase.ilike.mock.calls;
    const gtCalls = mockSupabase.gt.mock.calls;
    const ltCalls = mockSupabase.lt.mock.calls;

    const hasExpectedCall = ilikeCalls.some(
      ([key, value]) => key === "txCategoryName" && value === "abc"
    );
    expect(hasExpectedCall).toBe(true);

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
});

describe("GET /categories failures", () => {
  test("GET with unregistered user", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({
      data: {
        user: null,
      },
    });
    const response = await GET(req);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "401 Unauthorized",
    });
  });

  test("GET normally but with error in database", async () => {
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: null, error: mockError });
    });
    const response = await GET(req);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: mockError.message });
  });
});
