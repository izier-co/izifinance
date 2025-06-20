import { beforeEach, vitest } from "vitest";

beforeEach(() => {
  vi.clearAllMocks();
});

export const mockSupabase = {
  from: vitest.fn().mockReturnThis(),
  select: vitest.fn().mockReturnThis(),
  insert: vitest.fn().mockReturnThis(),
  update: vitest.fn().mockReturnThis(),
  eq: vitest.fn().mockReturnThis(),
  lt: vitest.fn().mockReturnThis(),
  gt: vitest.fn().mockReturnThis(),
  order: vitest.fn().mockReturnThis(),
  range: vitest.fn().mockReturnThis(),
  single: vitest.fn().mockResolvedValue(),
  then: vitest.fn().mockImplementation((onFulfilled, onRejected) => {
    onFulfilled({ data: null, error: null });
    return Promise.resolve({ data: null, error: null });
  }),
};
