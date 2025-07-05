import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../../__mocks__/supabase.mock";
import { DELETE } from "@/app/api/v1/categories/[id]/route";
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

const mockError = Error();

const mockProps = {
  params: Promise.resolve({ id: 1 }),
};

describe("DELETE /categories successes", () => {
  test("DELETE normally", async () => {
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: mockPayload, error: null });
    });

    const idParam = await mockProps.params;
    const response = await DELETE(reqWithParams, mockProps);
    const body = await response.json();

    expect(mockSupabase.eq).toHaveBeenCalledWith("inCategoryID", idParam.id);
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
    const response = await DELETE(req, mockProps);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "401 Unauthorized",
    });
  });

  test("DELETE but there is an error", async () => {
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: null, error: mockError });
    });
    const response = await DELETE(req, mockProps);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: mockError.message });
  });
});
