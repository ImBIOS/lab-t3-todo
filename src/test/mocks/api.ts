import { vi } from "vitest";

export const mockApi = {
  api: {
    todo: {
      toggleComplete: {
        useMutation: () => ({
          mutate: vi.fn(),
        }),
      },
      update: {
        useMutation: () => ({
          mutate: vi.fn(),
        }),
      },
      delete: {
        useMutation: () => ({
          mutate: vi.fn(),
        }),
      },
      getAll: {
        useQuery: () => ({
          data: [
            {
              id: "1",
              text: "Test todo",
              completed: false,
              dueDate: new Date("2024-01-01"),
              createdAt: new Date(),
              updatedAt: new Date(),
              userId: "user1",
            },
          ],
        }),
      },
      create: {
        useMutation: () => ({
          mutate: vi.fn(),
        }),
      },
    },
    useUtils: () => ({
      todo: {
        getAll: {
          invalidate: vi.fn(),
        },
      },
    }),
  },
};