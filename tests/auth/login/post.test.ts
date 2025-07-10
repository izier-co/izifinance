import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockCreateClient, mockSupabase } from "../../__mocks__/supabase.mock";
import { POST } from "@/app/api/v1/auth/signin/route";
import { createMockRequestWithBody } from "../../__helpers__/lib";

vitest.mock("@/app/api/supabase_server.config", () => {
  return {
    createClient: mockCreateClient,
    supabase: mockSupabase,
  };
});

beforeEach(() => {
  vitest.clearAllMocks();
});

const mockPayload = {
  email: "mock@fakewebsite.xyz",
  password: "mockpassword123",
};

const mockSuccessfulLoginBody = {
  message: "Sign In successful",
  user: "Mock User",
  accessToken: "blablabla",
  refreshToken: "blahblahblah",
  expiresAt: "123456",
};

const mockError = Error();

describe("Test Login", () => {
  test("Successful Login Case", async () => {
    const mockRequest = createMockRequestWithBody("POST", mockPayload);
    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toStrictEqual(mockSuccessfulLoginBody);
  });
  test("Failed Login Case (general issues)", async () => {
    mockSupabase.auth.signInWithPassword.mockImplementation(() => {
      return Promise.resolve({ data: null, error: mockError });
    });
    const mockRequest = createMockRequestWithBody("POST", mockPayload);

    const response = await POST(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: mockError.message });
  });
});
