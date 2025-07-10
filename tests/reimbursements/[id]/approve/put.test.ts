import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../../../__mocks__/supabase.mock";
import { mockDrizzle } from "../../../__mocks__/drizzle.mock";
import { PUT } from "@/app/api/v1/reimbursements/[id]/approve/route";
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

beforeEach(() => {
  vitest.clearAllMocks();
});

const idParam = "1";

const mockProps = {
  params: Promise.resolve({ id: idParam }),
};

const mockError = Error();

const req = new NextRequest("localhost:3000");

const mockResponseObject = [
  {
    uiReimbursementID: "some-id",
    daCreatedAt: new Date().toISOString(),
    daUpdatedAt: new Date().toISOString(),
    inReimbursementNoteID: 123,
    txStatus: "Void",
    txNotes: "Mock Reason",
    txRecipientAccount: "1234567890",
    inBankTypeCode: 1,
    inRecipientCompanyCode: 1,
    txBankAccountCode: "12345678901234567890",
    txChangeReason: null,
  },
];

describe("PUT /reimbursements success cases", () => {
  test("PUT with ID parameter", async () => {
    vitest.useFakeTimers();
    vitest.setSystemTime(new Date()); // fixes the time

    mockSupabase.then.mockImplementation((onFulfilled) => {
      onFulfilled({ data: mockResponseObject, error: null });
    });

    const response = await PUT(req, mockProps);
    const body = await response.json();
    const params = await mockProps.params;

    expect(mockSupabase.update).toHaveBeenCalledWith({
      txStatus: "Approved",
      daUpdatedAt: new Date().toISOString(),
    });
    expect(mockSupabase.eq).toHaveBeenCalledWith(
      "txReimbursementNoteID",
      params.id
    );
    expect(response.status).toBe(200);
    expect(body).toEqual({
      message: "Data Successfully Updated!",
      data: mockResponseObject,
    });

    vitest.useRealTimers();
  });
});

describe("PUT /reimbursements failure cases", () => {
  test("PUT but there is an error in the database", async () => {
    mockSupabase.then.mockImplementationOnce((onFulfilled) => {
      onFulfilled({ data: null, error: mockError });
    });
    const response = await PUT(req, mockProps);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: mockError.message });
  });
});
