import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../../__mocks__/supabase.mock";
import { POST } from "@/app/api/v1/auth/logout/route";

vitest.mock("@supabase-config", () => {
  return {
    supabase: mockSupabase,
  };
});

beforeEach(() => {
  vitest.clearAllMocks();
});

const mockError = Error();

describe("Test Logout", () => {
  test("Successful Logout Case", async () => {
    const response = await POST();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toStrictEqual({ message: "Logged Out Successfully!" });
  });

  test("Failed Logout Case (general issues)", async () => {
    mockSupabase.auth.signOut.mockImplementation(() => {
      return Promise.resolve({ data: null, error: mockError });
    });

    const response = await POST();
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: mockError.message });
  });
});
