import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../__mocks__/supabase.mock";
import { createMockRequestWithBody } from "../__helpers__/lib";
import { POST } from "@/app/api/v1/categories/route";
import { NextRequest } from "next/server";

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
const mockError = Error();

const mockPayload = {
  txCategoryName: "Mock Category",
  txCategoryDescription: "Mock Description",
};
const mockPayloadArr = [mockPayload];
const payloadWithoutDesc = {
  txCategoryName: mockPayload.txCategoryName,
  txCategoryDescription: null,
};
const payloadWithoutDescArr = [payloadWithoutDesc];
const payloadWithoutName = {
  txCategoryDescription: mockPayload.txCategoryDescription,
};

describe("POST /categories successes", () => {
  test("POST without txCategoryDesciption", async () => {
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: payloadWithoutDescArr, error: null });
    });

    const mockRequest = createMockRequestWithBody("POST", payloadWithoutDesc);
    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      data: payloadWithoutDescArr,
      message: "Data Successfully Inserted!",
    });
  });

  test("POST normally", async () => {
    const mockRequest = createMockRequestWithBody("POST", mockPayload);
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: mockPayloadArr, error: null });
    });

    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(mockSupabase.insert);
    expect(body).toEqual({
      data: mockPayloadArr,
      message: "Data Successfully Inserted!",
    });
  });
});

describe("POST /categories failures", () => {
  test("POST without parameters", async () => {
    const response = await POST(req);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "400 Bad Request : Invalid JSON Payload",
    });
  });

  test("POST without txCategoryName", async () => {
    const mockRequest = createMockRequestWithBody("POST", payloadWithoutName);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain("400 Bad Request");
  });

  test("POST normally but with error in database", async () => {
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
