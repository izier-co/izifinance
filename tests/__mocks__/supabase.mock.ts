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
  authUserData: { user: "abc" },
};

export const mockSupabase = {
  from: vitest.fn(),
  select: vitest.fn(),
  insert: vitest.fn(),
  update: vitest.fn(),
  eq: vitest.fn(),
  lt: vitest.fn(),
  gt: vitest.fn(),
  order: vitest.fn(),
  range: vitest.fn(),
  single: vitest.fn().mockResolvedValue(testingGlobalVars.emptyObject), // sample overrideable value
  ilike: vitest.fn(),
  auth: {
    signInWithPassword: vitest.fn().mockImplementation(() => {
      return testingGlobalVars.authReturnObject;
    }),
    getSession: vitest.fn().mockResolvedValue({
      data: testingGlobalVars.authSessionData,
      error: null,
    }),
    getUser: vitest.fn().mockResolvedValue({
      data: testingGlobalVars.authUserData,
      error: null,
    }),
    signOut: vitest.fn().mockResolvedValue(Promise.resolve({ error: null })),
    setSession: vitest.fn(),
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

export const mockServerSupabase = {
  auth: {
    signInWithPassword: vitest.fn().mockImplementation(() => {
      return testingGlobalVars.authReturnObject;
    }),
    setSession: vitest.fn(),
    signOut: vitest.fn().mockResolvedValue(Promise.resolve({ error: null })),
    then: vitest.fn().mockImplementation((onFulfilled) => {
      onFulfilled({ data: null, error: null });
      return Promise.resolve({ data: null, error: null });
    }),
  },
};
export const mockHandleSession = vitest
  .fn()
  .mockResolvedValue({ supabase: mockSupabase });

export const mockCreateClient = vitest.fn().mockResolvedValue(mockSupabase);
