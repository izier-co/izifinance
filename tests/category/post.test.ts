import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../__mocks__/supabase.mock";
import { createMockRequestWithBody } from "../__helpers__/lib";
import { POST } from "@/app/api/v1/category/route";
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

const mockPayload = {
  txCategoryName: "Mock Category",
  txCategoryDescription: "Mock Description",
};

describe("POST /categories successes", () => {
  test("POST without txCategoryDesciption", async () => {
    const payload = {
      txCategoryName: mockPayload.txCategoryName,
      txCategoryDescription: null,
    };
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: payload, error: null });
    });

    const mockRequest = createMockRequestWithBody("POST", payload);
    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      data: payload,
      message: "Data Successfully Inserted!",
    });
  });

  test("POST normally", async () => {
    const mockRequest = createMockRequestWithBody("POST", mockPayload);
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: mockPayload, error: null });
    });

    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(mockSupabase.insert);
    expect(body).toEqual({
      data: mockPayload,
      message: "Data Successfully Inserted!",
    });
  });
});

describe("POST /categories failures", () => {
  test("POST without authorization", async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: null,
      },
      error: new AuthError("Mock Auth Error"),
    });
    const response = await POST(req);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "401 Unauthorized",
    });
  });
  test("POST with unregistered user", async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: null,
      },
      error: null,
    });
    const response = await POST(req);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body).toEqual({
      error: "401 Unauthorized",
    });
  });
  test("POST without parameters", async () => {
    const response = await POST(req);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "400 Bad Request : Invalid JSON Payload",
    });
  });

  test("POST without txCategoryName", async () => {
    const payload = {
      txCategoryDescription: mockPayload.txCategoryDescription,
    };
    const mockRequest = createMockRequestWithBody("POST", payload);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain("400 Bad Request");
  });

  test("POST normally but with error in database", async () => {
    const mockError = Error();
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: null, error: mockError });
    });
    const mockRequest = createMockRequestWithBody("POST", mockPayload);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: mockError.message });
  });
});
