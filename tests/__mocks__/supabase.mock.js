import { vitest } from "vitest";

export const mockSupabase = {
  from: vitest.fn().mockReturnThis(),
  select: vitest.fn().mockReturnThis(),
  insert: vitest.fn().mockReturnThis(),
  update: vitest.fn().mockReturnThis(),
  eq: vitest.fn().mockReturnThis(),
  lt: vitest.fn().mockReturnThis(),
  gt: vitest.fn().mockReturnThis(),
  order: vitest.fn().mockReturnThis(),
  single: vitest.fn().mockResolvedValue(),
  then: vitest.fn().mockImplementation((onFulfilled, onRejected) => {
    onFulfilled({ data: null, error: null });
    return Promise.resolve({ data: null, error: null });
  }),
};
