import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../../../__mocks__/supabase.mock";
import { GET } from "@/app/api/v1/reimbursements/[id]/notes/route";
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

const mockProps = {
  params: Promise.resolve({ id: 1 }),
};

const mockError = Error();

const noteFieldsName = "txStatus,txNotes";
const itemFieldsName = "txName,inQuantity";
let tableQueryString = "*, reimbursement_items(*)";

describe("GET /reimbursements/id successes", () => {
  test("GET without parameters", async () => {
    const response = await GET(req, mockProps);
    expect(response.status).toBe(200);
  });

  test("GET with fields", async () => {
    req.nextUrl.searchParams.append("noteFields", noteFieldsName);
    req.nextUrl.searchParams.append("itemFields", itemFieldsName);

    const response = await GET(req, mockProps);
    tableQueryString = `${noteFieldsName}, reimbursement_items(${itemFieldsName})`;

    expect(mockSupabase.select).toHaveBeenCalledWith(tableQueryString);
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
