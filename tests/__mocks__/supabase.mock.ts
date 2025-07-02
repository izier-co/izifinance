import { beforeEach, vitest } from "vitest";

beforeEach(() => {
  vitest.clearAllMocks();
});

export const testingGlobalVars = {
  MOCK_COUNT: 100,
  authReturnObject: {
    data: {
      user: "Mock User",
      session: {
        access_token: "blablabla",
        refresh_token: "blahblahblah",
        expires_at: "123456",
      },
    },
    error: null,
  },
  emptyObject: {},
  emptyArray: [],
  authSessionData: { session: "abc" },
};

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
  single: vitest.fn().mockResolvedValue(testingGlobalVars.emptyObject), // sample overrideable value
  ilike: vitest.fn().mockReturnThis(),
  auth: {
    signInWithPassword: vitest.fn().mockImplementation(() => {
      return testingGlobalVars.authReturnObject;
    }),
    getSession: vitest.fn().mockResolvedValue({
      data: testingGlobalVars.authSessionData,
      error: null,
    }),
    signOut: vitest.fn().mockResolvedValue(Promise.resolve({ error: null })),
    then: vitest.fn().mockImplementation((onFulfilled) => {
      onFulfilled({ data: null, error: null });
      return Promise.resolve({ data: null, error: null });
    }),
  },
  then: vitest.fn().mockImplementation((onFulfilled) => {
    onFulfilled({
      data: testingGlobalVars.emptyArray,
      count: testingGlobalVars.MOCK_COUNT,
      error: null,
    });
    return Promise.resolve({
      data: testingGlobalVars.emptyArray,
      count: testingGlobalVars.MOCK_COUNT,
      error: null,
    });
  }),
};
