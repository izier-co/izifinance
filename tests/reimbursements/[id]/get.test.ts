import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockCreateClient, mockSupabase } from "../../__mocks__/supabase.mock";
import { GET } from "@/app/api/v1/reimbursements/[id]/route";
import { NextRequest } from "next/server";

vitest.mock("@/app/api/supabase_server.config", () => {
  return {
    createClient: mockCreateClient,
    supabase: mockSupabase,
  };
});

beforeEach(() => {
  vitest.clearAllMocks();
});

const req = new NextRequest("localhost:3000");

const idParam = "1";

const mockProps = {
  params: Promise.resolve({ id: idParam }),
};

const mockError = Error();

const fieldsName = "txStatus,txNotes";

const tableQueryString = "*";

describe("GET /reimbursements/id successes", () => {
  test("GET without parameters", async () => {
    const response = await GET(req, mockProps);
    expect(mockSupabase.select).toHaveBeenCalledWith(tableQueryString);
    expect(response.status).toBe(200);
  });

  test("GET with fields", async () => {
    req.nextUrl.searchParams.append("fields", fieldsName);
    const response = await GET(req, mockProps);
    expect(mockSupabase.select).toHaveBeenCalledWith(fieldsName);
    expect(mockSupabase.eq).toHaveBeenCalledWith(
      "txReimbursementNoteID",
      idParam
    );
    expect(response.status).toBe(200);
  });
});

describe("GET /reimbursements/id failures", () => {
  test("GET normally but with error in database", async () => {
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: null, error: mockError });
    });
    const response = await GET(req, mockProps);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: mockError.message });
  });
});
