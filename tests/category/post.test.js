import { describe, test, expect, vitest } from "vitest";

import { mockSupabase } from "../__mocks__/supabase.mock";
import { POST } from "@/app/api/v1/category/route";
import { NextRequest } from "next/server";

vitest.mock("@supabase-config", () => {
  return {
    supabase: mockSupabase,
  };
});

const url = "localhost:3000";

const req = new NextRequest(url);

const mockPayload = {
  txCategoryName: "Mock Category",
  txCategoryDescription: "Mock Description",
};

function createMockRequestWithBody(method, body) {
  const request = new Request(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return new NextRequest(request);
}

describe("POST /categories tests", () => {
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

  test("POST without txCategoryDesciption", async () => {
    const payload = {
      txCategoryName: mockPayload.txCategoryName,
      txCategoryDescription: null,
    };
    const mockRequest = createMockRequestWithBody("POST", payload);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual({ message: "Data Successfully Inserted!" });
  });

  test("POST normally", async () => {
    const mockRequest = createMockRequestWithBody("POST", mockPayload);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(mockSupabase.insert);
    expect(body).toEqual({ message: "Data Successfully Inserted!" });
  });

  test("POST normally but with error in database", async () => {
    const mockError = Error();
    mockSupabase.then.mockImplementation((onFulfilled) => {
      onFulfilled({ data: null, error: mockError });
    });
    const mockRequest = createMockRequestWithBody("POST", mockPayload);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: mockError.message });
  });
});
