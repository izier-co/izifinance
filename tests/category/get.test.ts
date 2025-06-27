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

const SECONDS_IN_DAY = 60 * 60 * 24;
const YESTERDAY = Date.now() - SECONDS_IN_DAY;
const TOMORROW = Date.now() + SECONDS_IN_DAY;
const DAY_BEFORE_YESTERDAY = Date.now() - SECONDS_IN_DAY;
const DAY_AFTER_TOMORROW = Date.now() + SECONDS_IN_DAY;

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
    const pageIDStr = "2";
    const mockSearchParams = req.nextUrl.searchParams;
    mockSearchParams.append("page", pageIDStr);
    mockSearchParams.append("name", "abc");
    mockSearchParams.append("is-alphabetical", "true");

    // uses timestamp as input
    mockSearchParams.append("created-before", TOMORROW.toString());
    mockSearchParams.append("created-after", YESTERDAY.toString());
    mockSearchParams.append("updated-before", DAY_AFTER_TOMORROW.toString());
    mockSearchParams.append("updated-after", DAY_BEFORE_YESTERDAY.toString());

    const response = await GET(req);
    const paginationSize = 100;

    expect(mockSupabase.range).toHaveBeenCalledWith(
      (Number.parseInt(pageIDStr) - 1) * paginationSize,
      Number.parseInt(pageIDStr) * paginationSize
    );
    expect(mockSupabase.order).toHaveBeenCalledWith("txCategoryName", {
      ascending: true,
    });

    // checks if within the eq, lt and gt chain
    // contains the desired parameters (order doesn't matter)

    const eqCalls = mockSupabase.eq.mock.calls;
    const gtCalls = mockSupabase.gt.mock.calls;
    const ltCalls = mockSupabase.lt.mock.calls;

    const hasExpectedCall = eqCalls.some(
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
