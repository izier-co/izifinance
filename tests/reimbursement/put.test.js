import { describe, test, expect, vitest } from "vitest";

import { mockSupabase } from "../__mocks__/supabase.mock";
import { mockDrizzle } from "../__mocks__/drizzle.mock";
import { PUT } from "@/app/api/v1/reimbursement/route";
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

const req = new NextRequest("localhost:3000");
const idParam = "1";

describe("PUT /reimbursement tests", () => {
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
      onFulfilled({ data: null, error: null });
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
    expect(body).toEqual({ message: "Data Successfully Updated!" });

    vi.useRealTimers();
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
