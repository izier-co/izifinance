import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../__mocks__/supabase.mock";
import { GET } from "@/app/api/v1/category/route";
import { NextRequest } from "next/server";
import { AuthError } from "@supabase/supabase-js";

vitest.mock("@supabase-config", () => {
  return {
    supabase: mockSupabase,
  };
});

beforeEach(() => {
  vitest.clearAllMocks();
});

const url = "localhost:3000";
const req = new NextRequest(url);

const MILISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
const NOW = Date.now();
const YESTERDAY = new Date(NOW - MILISECONDS_IN_DAY).toISOString();
const TOMORROW = new Date(NOW + MILISECONDS_IN_DAY).toISOString();
const DAY_BEFORE_YESTERDAY = new Date(NOW - MILISECONDS_IN_DAY).toISOString();
const DAY_AFTER_TOMORROW = new Date(NOW + MILISECONDS_IN_DAY).toISOString();

const pageIDStr = "2";
const paginationSize = "50";

// expected to become ISO string in API
const expectedGtCalls = [
  ["daCreatedAt", new Date(YESTERDAY).toISOString()],
  ["daUpdatedAt", new Date(DAY_BEFORE_YESTERDAY).toISOString()],
];

const expectedLtCalls = [
  ["daCreatedAt", new Date(TOMORROW).toISOString()],
  ["daUpdatedAt", new Date(DAY_AFTER_TOMORROW).toISOString()],
];
describe("GET /categories tests", () => {
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

  test("GET with all parameters", async () => {
    const mockSearchParams = req.nextUrl.searchParams;
    mockSearchParams.append("paginationPage", pageIDStr);
    mockSearchParams.append("paginationSize", paginationSize);
    mockSearchParams.append("name", "abc");
    mockSearchParams.append("isAlphabetical", "true");

    mockSearchParams.append("createdBefore", TOMORROW);
    mockSearchParams.append("createdAfter", YESTERDAY);
    mockSearchParams.append("updatedBefore", DAY_AFTER_TOMORROW);
    mockSearchParams.append("updatedAfter", DAY_BEFORE_YESTERDAY);

    const response = await GET(req);

    expect(mockSupabase.range).toHaveBeenCalledWith(
      (Number.parseInt(pageIDStr) - 1) * Number.parseInt(paginationSize),
      Number.parseInt(pageIDStr) * Number.parseInt(paginationSize)
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

    expect(response.status).toBe(200);
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
