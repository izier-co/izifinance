import { describe, test, expect, vitest } from "vitest";

import { mockSupabase } from "../__mocks__/supabase.mock";
import { DELETE } from "@/app/api/v1/category/route";
import { NextRequest } from "next/server";
import { AuthError } from "@supabase/supabase-js";

vitest.mock("@supabase-config", () => {
  return {
    supabase: mockSupabase,
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

const req = new NextRequest("localhost:3000");

describe("DELETE /categories tests", () => {
  test("DELETE without authorization", async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: null,
      },
      error: new AuthError(),
    });
    const response = await DELETE(req);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "401 Unauthorized",
    });
  });
  test("DELETE with unregistered user", async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: null,
      },
      error: null,
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

  test("DELETE with ID parameter", async () => {
    mockSupabase.then.mockImplementation((onFulfilled) => {
      onFulfilled({ data: null, error: null });
    });
    const idParam = "1";
    req.nextUrl.searchParams.append("id", idParam);
    const response = await DELETE(req);
    const body = await response.json();
    expect(mockSupabase.eq).toHaveBeenCalledWith(
      "inCategoryID",
      Number.parseInt(idParam)
    );
    expect(response.status).toBe(200);
    expect(body).toEqual({ message: "Data Successfully Deleted!" });
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
