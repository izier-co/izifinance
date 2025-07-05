import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../__mocks__/supabase.mock";
import { mockDrizzle, mockNestedDrizzle } from "../__mocks__/drizzle.mock";
import { createMockRequestWithBody } from "../__helpers__/lib";
import { POST } from "@/app/api/v1/reimbursements/route";
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

const url = "localhost:3000";
const req = new NextRequest(url);

// optional properties for deletion purposes
type ReimbursementPayload = {
  txStatus?: string;
  txNotes: string;
  txRecipientAccount: string;
  inBankTypeCode: number;
  inRecipientCompanyCode: number;
  txBankAccountCode: string;
  txChangeReason: string;
  reimbursement_items: Array<ReimbursementItems>;
};

type ReimbursementItems = {
  txName?: string;
  inQuantity: number;
  deIndividualPrice: number;
  deTotalPrice: number;
  txCurrency: string;
  inCategoryID: number;
};

const reimbursementPayload: ReimbursementPayload = {
  txStatus: "Pending",
  txNotes: "",
  txRecipientAccount: "0987654321",
  inBankTypeCode: 2,
  inRecipientCompanyCode: 1,
  txBankAccountCode: "09876543210987654321",
  txChangeReason: "",
  reimbursement_items: [
    {
      txName: "Big Mac",
      inQuantity: 1,
      deIndividualPrice: 20000,
      deTotalPrice: 20000,
      txCurrency: "IDR",
      inCategoryID: 5,
    },
    {
      txName: "Coca Cola",
      inQuantity: 10,
      deIndividualPrice: 10000,
      deTotalPrice: 100000,
      txCurrency: "IDR",
      inCategoryID: 5,
    },
  ],
};

describe("POST /reimbursements success cases", () => {
  test("POST with correct data", async () => {
    const mockRequest = createMockRequestWithBody("POST", reimbursementPayload);

    // simulating the returned object as an array
    mockNestedDrizzle.returning
      .mockResolvedValueOnce([reimbursementPayload])
      .mockResolvedValueOnce([reimbursementPayload.reimbursement_items[0]])
      .mockResolvedValueOnce([reimbursementPayload.reimbursement_items[1]]);

    const response = await POST(mockRequest);
    const body = await response.json();
    const reimbursementItemsArray = reimbursementPayload.reimbursement_items;

    expect(mockDrizzle.transaction).toHaveBeenCalled();
    expect(mockNestedDrizzle.insert).toHaveBeenCalledTimes(
      1 + reimbursementItemsArray.length
    );
    expect(mockNestedDrizzle.values).toHaveBeenCalledTimes(
      1 + reimbursementItemsArray.length
    );
    expect(mockNestedDrizzle.values).toHaveBeenNthCalledWith(1, {
      txStatus: reimbursementPayload.txStatus,
      txNotes: reimbursementPayload.txNotes,
      txRecipientAccount: reimbursementPayload.txRecipientAccount,
      inBankTypeCode: reimbursementPayload.inBankTypeCode,
      inRecipientCompanyCode: reimbursementPayload.inRecipientCompanyCode,
      txBankAccountCode: reimbursementPayload.txBankAccountCode,
      txChangeReason: reimbursementPayload.txChangeReason,
    });

    const returnedResults = mockNestedDrizzle.returning.mock.results[0];
    const returnedValue = await returnedResults.value[0].inReimbursementNoteID;

    for (let i = 0; i < reimbursementItemsArray.length; i++) {
      // + 2 because the 1st one is for the reimbursement note
      expect(mockNestedDrizzle.values).toHaveBeenNthCalledWith(i + 2, {
        inReimbursementNoteID: returnedValue,
        txName: reimbursementItemsArray[i].txName,
        inQuantity: reimbursementItemsArray[i].inQuantity,
        deIndividualPrice:
          reimbursementItemsArray[i].deIndividualPrice.toFixed(2),
        deTotalPrice: reimbursementItemsArray[i].deTotalPrice.toFixed(2),
        txCurrency: reimbursementItemsArray[i].txCurrency,
        inCategoryID: reimbursementItemsArray[i].inCategoryID,
      });
    }
    expect(response.status).toBe(201);
    expect(body).toEqual({
      data: reimbursementPayload,
      message: "Data Successfully Inserted!",
    });
  });
});

describe("POST /reimbursements failure cases", () => {
  test("POST with unregistered user", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({
      data: {
        user: null,
      },
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

  test("POST with random JSON body", async () => {
    const randomPayload = {
      random: 123,
    };
    const mockRequest = createMockRequestWithBody("POST", randomPayload);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain("400 Bad Request :");
  });

  test("POST without reimbursement items", async () => {
    const standardPayload = structuredClone(reimbursementPayload);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { reimbursement_items, ...payloadWithoutItems } = standardPayload;
    const mockRequest = createMockRequestWithBody("POST", payloadWithoutItems);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "400 Bad Request : Invalid JSON Payload",
    });
  });

  test("POST with malformed reimbursement data", async () => {
    const malformedPayload = structuredClone(reimbursementPayload);
    delete malformedPayload.txStatus;

    const mockRequest = createMockRequestWithBody("POST", malformedPayload);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain("400 Bad Request :");
  });

  test("POST with malformed reimbursement items", async () => {
    const malformedPayload = structuredClone(reimbursementPayload);
    delete malformedPayload.reimbursement_items[1].txName;
    
    const mockRequest = createMockRequestWithBody("POST", malformedPayload);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain("400 Bad Request :");
  });

  test("POST with correct data but with error in database", async () => {
    mockDrizzle.transaction.mockImplementation(() => {
      throw new Error();
    });
    const mockRequest = createMockRequestWithBody("POST", reimbursementPayload);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body.error).toContain("500 Internal Server Error :");
  });
});
