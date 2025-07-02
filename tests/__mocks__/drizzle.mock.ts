import { vitest, beforeEach } from "vitest";

beforeEach(() => {
  vitest.clearAllMocks();
});

export const mockNestedDrizzle = {
  insert: vitest.fn().mockReturnThis(),
  values: vitest.fn().mockReturnThis(),
  returning: vitest.fn(),
  then: vitest.fn().mockImplementation((onFulfilled) => {
    onFulfilled(null);
    return Promise.resolve(null);
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
