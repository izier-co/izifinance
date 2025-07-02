import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../../__mocks__/supabase.mock";
import { mockDrizzle } from "../../__mocks__/drizzle.mock";
import { PUT } from "@/app/api/v1/reimbursement/void/route";
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

const req = new NextRequest("localhost:3000");
const idParam = "1";

describe("PUT /reimbursement tests", () => {
  test("PUT without authorization", async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: null,
      },
      error: new AuthError("Mock Auth Error"),
    });
    const response = await PUT(req);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "401 Unauthorized",
    });
  });
  test("PUT with unregistered user", async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: null,
      },
      error: null,
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

  test("PUT with ID parameter", async () => {
    vitest.useFakeTimers();
    vitest.setSystemTime(new Date()); // fixes the time
    mockSupabase.then.mockImplementation((onFulfilled) => {
      onFulfilled({ data: {}, error: null });
    });
    req.nextUrl.searchParams.append("id", idParam);
    const response = await PUT(req);
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
    expect(body).toEqual({ message: "Data Successfully Updated!", data: {} });

    vitest.useRealTimers();
  });

  test("PUT with ID parameter but there is an error", async () => {
    const mockError = Error();
    mockSupabase.then.mockImplementation((onFulfilled) => {
      onFulfilled({ data: null, error: mockError });
    });
    req.nextUrl.searchParams.append("id", idParam);
    const response = await PUT(req);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: mockError.message });
  });
});
