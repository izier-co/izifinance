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
  auth: {
    signInWithPassword: vitest.fn().mockImplementation(() => {
      return {
        data: {
          user: "Mock User",
          session: {
            access_token: "blablabla",
            refresh_token: "blahblahblah",
            expires_at: "123456",
          },
        },
        error: null,
      };
    }),
    getSession: vitest.fn().mockResolvedValue(
      Promise.resolve({
        data: {
          session: "abc",
        },
        error: null,
      })
    ),
    signOut: vitest.fn().mockResolvedValue(Promise.resolve({ error: null })),
    then: vitest.fn().mockImplementation((onFulfilled, onRejected) => {
      onFulfilled({ data: null, error: null });
      return Promise.resolve({ data: null, error: null });
    }),
  },
  then: vitest.fn().mockImplementation((onFulfilled, onRejected) => {
    onFulfilled({ data: null, error: null });
    return Promise.resolve({ data: null, error: null });
  }),
};
