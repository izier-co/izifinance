import { describe, test, expect, vitest, beforeEach } from "vitest";

import { mockHandleSession, mockSupabase } from "../__mocks__/supabase.mock";
import { middleware } from "@/middleware";
import { NextRequest } from "next/server";

vitest.mock("../../src/app/api/supabase_middleware.config", () => {
  return {
    handleSession: mockHandleSession,
    supabase: mockSupabase,
  };
});

beforeEach(() => {
  vitest.clearAllMocks();
});

// no port here to avoid breaking with .startsWith()
const req = new NextRequest("https://localhost/api");

const reqBlogs = new NextRequest("localhost:3000/blogs");
const reqNormal = new NextRequest("localhost:3000");

const mockError = Error();

const noLoggedInUserObject = {
  data: {
    user: null,
  },
};

const authErrorLogin = {
  data: {
    user: null,
  },
  error: mockError,
};
describe("middleware tests", () => {
  test("middleware for API should return unauthorized message", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce(noLoggedInUserObject);
    const response = await middleware(req);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body).toStrictEqual({ error: "Unauthorized" });
  });

  test("middleware for API should return unauthorized message", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce(authErrorLogin);
    const response = await middleware(req);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toStrictEqual({ error: mockError.message });
  });

  test("middleware without logged in user for non API should redirect", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce(noLoggedInUserObject);
    const response = await middleware(reqBlogs);
    expect(response.status).toBe(307);
  });

  test("middleware with user should return 200 status code", async () => {
    const response = await middleware(reqNormal);
    expect(response.status).toBe(200);
  });
});
