import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../../__mocks__/supabase.mock";
import { PUT } from "@/app/api/v1/reimbursements/[id]/route";
import { NextRequest } from "next/server";
import { createMockRequestWithBody } from "../../__helpers__/lib";

vitest.mock("@supabase-config", () => {
  return {
    supabase: mockSupabase,
  };
});

beforeEach(() => {
  vitest.clearAllMocks();
});

const idParam = "1";
const mockPayloadObject = {
  description: "Sample Description",
};
const mockMalformedPayload = {
  description: false,
};

const mockProps = {
  params: Promise.resolve({ id: idParam }),
};

const mockError = Error();

const req = new NextRequest("localhost:3000");

const mockResponseObject = {};

describe("PUT /reimbursements success cases", () => {
  test("PUT with ID parameter", async () => {
    const mockRequest = createMockRequestWithBody("PUT", mockPayloadObject);
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: mockResponseObject, error: null });
      return Promise.resolve({ data: mockResponseObject, error: null });
    });
    const response = await PUT(mockRequest, mockProps);
    const body = await response.json();

    expect(mockSupabase.update).toHaveBeenCalledWith({
      txDescriptionDetails: mockPayloadObject.description,
    });
    expect(mockSupabase.eq).toHaveBeenCalledWith(
      "txReimbursementNoteID",
      idParam
    );
    expect(response.status).toBe(200);
    expect(body).toEqual({
      message: "Data Successfully Updated!",
      data: mockResponseObject,
    });
  });
});

describe("PUT /reimbursements failure cases", () => {
  test("PUT without body", async () => {
    const response = await PUT(req, mockProps);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "400 Bad Request : Invalid JSON Payload" });
  });
  test("PUT with malformed request ", async () => {
    const mockRequest = createMockRequestWithBody("PUT", mockMalformedPayload);
    const response = await PUT(mockRequest, mockProps);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain("400 Bad Request :");
  });
  test("PUT but there is an error in the database", async () => {
    const mockRequest = createMockRequestWithBody("PUT", mockPayloadObject);
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: null, error: mockError });
      return Promise.resolve({ data: null, error: mockError });
    });
    const response = await PUT(mockRequest, mockProps);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: mockError.message });
  });
});
