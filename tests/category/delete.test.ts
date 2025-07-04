import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../__mocks__/supabase.mock";
import { DELETE } from "@/app/api/v1/category/route";
import { NextRequest } from "next/server";

vitest.mock("@supabase-config", () => {
  return {
    supabase: mockSupabase,
  };
});

beforeEach(() => {
  vitest.clearAllMocks();
});

const req = new NextRequest("localhost:3000");
const reqWithParams = new NextRequest("localhost:3000");

const mockPayload = {
  txCategoryName: "Mock Category",
  txCategoryDescription: "Mock Description",
};

describe("DELETE /categories successes", () => {
  test("DELETE with ID parameter", async () => {
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: mockPayload, error: null });
    });
    const idParam = "1";
    reqWithParams.nextUrl.searchParams.append("id", idParam);

    const response = await DELETE(reqWithParams);
    const body = await response.json();

    expect(mockSupabase.eq).toHaveBeenCalledWith(
      "inCategoryID",
      Number.parseInt(idParam)
    );
    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: mockPayload,
      message: "Data Successfully Deleted!",
    });
  });
});

describe("DELETE /categories failures", () => {
  test("DELETE with unregistered user", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({
      data: {
        user: null,
      },
    });
    const response = await DELETE(req);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "401 Unauthorized",
    });
  });
  test("DELETE without parameters", async () => {
    const response = await DELETE(req);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "400 Bad Request : id parameter is required",
    });
  });

  test("DELETE with ID parameter but there is an error", async () => {
    const mockError = Error();
    mockSupabase.then.mockImplementation((onFulfilled) => {
      onFulfilled({ data: null, error: mockError });
    });
    req.nextUrl.searchParams.append("id", "1");
    const response = await DELETE(req);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: mockError.message });
  });
});
