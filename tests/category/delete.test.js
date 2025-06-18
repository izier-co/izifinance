import { describe, test, expect, vitest } from "vitest";

import mockSupabase from "../__mocks__/supabase.mock";
import DELETE from "../../src/app/api/v1/category/route";

vitest.mock("@supabase-config", () => {
  return {
    supabase: mockSupabase,
  };
});

describe("DELETE /categories tests", () => {
  test("DELETE without parameters", async () => {
    const response = await DELETE(null);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual({
      error: "400 Bad Request : id parameter is required",
    });
  });

  test("DELETE with ID parameter", () => {});
});
