import { vitest, beforeEach } from "vitest";

beforeEach(() => {
  vitest.clearAllMocks();
});

export const mockNestedDrizzle = {
  select: vitest.fn().mockReturnThis(),
  from: vitest.fn().mockReturnThis(),
  where: vitest.fn().mockReturnThis(),
  eq: vitest.fn(),
  execute: vitest.fn(),
  insert: vitest.fn().mockReturnThis(),
  values: vitest.fn().mockReturnThis(),
  update: vitest.fn().mockReturnThis(),
  set: vitest.fn(),
  returning: vitest.fn(),
  then: vitest.fn().mockImplementation((onFulfilled) => {
    onFulfilled([]);
    return Promise.resolve([]);
  }),
};

export const mockDrizzle = {
  transaction: vitest.fn().mockImplementation((callback) => {
    return callback(mockNestedDrizzle);
  }),
  insert: vitest.fn().mockReturnThis(),
  values: vitest.fn().mockReturnThis(),
  returning: vitest.fn().mockImplementation((onFulfilled) => {
    onFulfilled([{ inReimbursementNoteID: 1 }]);
    return Promise.resolve([{ inReimbursementNoteID: 1 }]);
  }),
  then: vitest.fn().mockImplementation((onFulfilled) => {
    onFulfilled(null);
    return Promise.resolve(null);
  }),
};
