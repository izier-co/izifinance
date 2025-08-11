import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockCreateClient, mockSupabase } from "../__mocks__/supabase.mock";
import { mockDrizzle, mockNestedDrizzle } from "../__mocks__/drizzle.mock";
import { createMockRequestWithBody } from "../__helpers__/lib";
import { POST } from "@/app/api/v1/reimbursements/route";
import { NextRequest } from "next/server";

vitest.mock("@/app/api/supabase_server.config", () => {
  return {
    createClient: mockCreateClient,
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
  txDescriptionDetails?: string;
  txRecipientAccount: string;
  inBankTypeCode: number;
  inRecipientCompanyCode: number;
  txBankAccountCode: string;
  txChangeReason: string;
  txEmployeeCode: string;
  txApprovedBy?: string;
  inCategoryID: number;
  dcNominalReimbursement: number;
  reimbursement_items: Array<ReimbursementItems>;
};

type ReimbursementItems = {
  txName?: string;
  inQuantity: number;
  deIndividualPrice: number;
  deTotalPrice: number;
  txCurrency: string;
};

const extraHeader = { "Idempotency-Key": "abcdef" };

const reimbursementPayload: ReimbursementPayload = {
  txDescriptionDetails: "",
  txRecipientAccount: "0987654321",
  inBankTypeCode: 2,
  inRecipientCompanyCode: 1,
  txBankAccountCode: "09876543210987654321",
  txChangeReason: "",
  txEmployeeCode: "P00012000",
  inCategoryID: 1,
  dcNominalReimbursement: 120000,
  reimbursement_items: [
    {
      txName: "Big Mac",
      inQuantity: 1,
      deIndividualPrice: 20000,
      deTotalPrice: 20000,
      txCurrency: "IDR",
    },
    {
      txName: "Coca Cola",
      inQuantity: 10,
      deIndividualPrice: 10000,
      deTotalPrice: 100000,
      txCurrency: "IDR",
    },
  ],
};

const randomInvalidPayload = {
  random: 123,
};

describe("POST /reimbursements success cases", () => {
  test("POST with correct data", async () => {
    const mockRequest = createMockRequestWithBody(
      "POST",
      reimbursementPayload,
      extraHeader
    );

    // simulating the returned object as an array
    mockNestedDrizzle.execute.mockResolvedValueOnce([]);

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
      uiIdempotencyKey: extraHeader["Idempotency-Key"],
      txDescriptionDetails: reimbursementPayload.txDescriptionDetails,
      inCategoryID: reimbursementPayload.inCategoryID,
      txRecipientAccount: reimbursementPayload.txRecipientAccount,
      inBankTypeCode: reimbursementPayload.inBankTypeCode,
      inRecipientCompanyCode: reimbursementPayload.inRecipientCompanyCode,
      txBankAccountCode: reimbursementPayload.txBankAccountCode,
      txChangeReason: reimbursementPayload.txChangeReason,
      txEmployeeCode: reimbursementPayload.txEmployeeCode,
      txApprovedBy: reimbursementPayload.txApprovedBy,
    });

    const returnedResults = mockNestedDrizzle.returning.mock.results[0].value;
    const returnedValue = await returnedResults.inReimbursementNoteID;
    let totalPrice = 0;

    for (let i = 0; i < reimbursementItemsArray.length; i++) {
      // + 2 because the 1st one is for the reimbursement note
      expect(mockNestedDrizzle.values).toHaveBeenNthCalledWith(i + 2, {
        txReimbursementNoteID: returnedValue,
        txName: reimbursementItemsArray[i].txName,
        inQuantity: reimbursementItemsArray[i].inQuantity,
        deIndividualPrice:
          reimbursementItemsArray[i].deIndividualPrice.toFixed(2),
        deTotalPrice: reimbursementItemsArray[i].deTotalPrice.toFixed(2),
        txCurrency: reimbursementItemsArray[i].txCurrency,
      });
      totalPrice += reimbursementItemsArray[i].deTotalPrice;
    }
    expect(mockNestedDrizzle.set).toBeCalledWith({
      dcNominalReimbursement: totalPrice.toFixed(2),
    });
    expect(response.status).toBe(201);
    expect(body).toEqual({
      data: reimbursementPayload,
      message: "Data Successfully Inserted!",
    });
  });
});

describe("POST /reimbursements failure cases", () => {
  test("POST without parameters", async () => {
    const response = await POST(req);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "400 Bad Request : Invalid JSON Payload",
    });
  });

  test("POST without idempotency key", async () => {
    const mockRequest = createMockRequestWithBody("POST", reimbursementPayload);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "400 Bad Request : Missing Idempotency Key",
    });
  });

  test("POST with random JSON body", async () => {
    const mockRequest = createMockRequestWithBody("POST", randomInvalidPayload);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain("400 Bad Request :");
  });

  test("POST without reimbursement items", async () => {
    const standardPayload = structuredClone(reimbursementPayload);
    const { reimbursement_items, ...payloadWithoutItems } = standardPayload;
    const mockRequest = createMockRequestWithBody("POST", payloadWithoutItems);
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain("400 Bad Request :");
  });

  test("POST with malformed reimbursement data", async () => {
    const malformedPayload = structuredClone(reimbursementPayload);
    delete malformedPayload.txDescriptionDetails;

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
    const mockRequest = createMockRequestWithBody(
      "POST",
      reimbursementPayload,
      extraHeader
    );
    const response = await POST(mockRequest);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body.error).toContain("500 Internal Server Error :");
  });
});
