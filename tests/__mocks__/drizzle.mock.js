import { vitest } from "vitest";

export const mockDrizzle = {
  transaction: vitest.fn(),
  insert: vitest.fn().mockReturnThis(),
  values: vitest.fn().mockReturnThis(),
  returning: vitest.fn().mockImplementation((onFulfilled, onRejected) => {
    onFulfilled({ data: null });
    return Promise.resolve({ data: null });
  }),
  then: vitest.fn().mockImplementation((onFulfilled, onRejected) => {
    onFulfilled(null);
    return Promise.resolve(null);
  }),
};
