import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockSupabase } from "../__mocks__/supabase.mock";
import { authorizeAdmin } from "@/lib/lib";

vitest.mock("@supabase-config", () => {
  return {
    supabase: mockSupabase,
  };
});

beforeEach(() => {
  vitest.clearAllMocks();
});

const mockUserObject = [{ user: "Username" }];
const mockError = Error("Mock Error");

describe("Admin Authorization Tests", () => {
  test("Successful Authorization should return no response", async () => {
    mockSupabase.then.mockImplementation((onFullfilled) => {
      onFullfilled({ data: mockUserObject, error: null });
    });
    const response = await authorizeAdmin();
    expect(response).toBeNull();
  });
  test("Lack of User should give Unauthorized error", async () => {
    mockSupabase.auth.getUser.mockImplementationOnce((onFullfilled) => {
      return Promise.resolve({ data: { user: null } });
    });
    const response = await authorizeAdmin();
    const body = await response?.json();
    expect(response?.status).toBe(401);
    expect(body).toEqual({
      error: "401 Unauthorized",
    });
  });
  test("Lack of priviliges should give Forbidden error", async () => {
    mockSupabase.then.mockImplementation((onFullfilled) => {
      onFullfilled({ data: [], error: null });
    });
    const response = await authorizeAdmin();
    const body = await response?.json();
    expect(response?.status).toBe(403);
    expect(body).toEqual({
      error: "403 Forbidden",
    });
  });
  test("Error in Supabase should give Internal Server Error", async () => {
    mockSupabase.then.mockImplementation((onFullfilled) => {
      onFullfilled({ data: null, error: mockError });
    });
    const response = await authorizeAdmin();
    const body = await response?.json();
    expect(response?.status).toBe(500);
    expect(body).toEqual({
      error: mockError.message,
    });
  });
});
