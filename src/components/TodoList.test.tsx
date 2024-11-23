import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoList } from "./TodoList";
import { type Todo } from "@prisma/client";

// Mock the API module
const mockMutate = vi.fn();

vi.mock("~/utils/api", () => ({
  default: {
    api: {
      todo: {
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
            mutate: mockMutate,
          }),
        },
      },
      useUtils: () => ({
        todo: {
          getAll: {
            invalidate: mockMutate,
          },
        },
      }),
    },
  },
}));

describe("TodoList", () => {
  it("renders todo list with items", () => {
    render(<TodoList />);
    expect(screen.getByText("Test todo")).toBeInTheDocument();
  });

  it("shows add todo form", () => {
    render(<TodoList />);
    expect(screen.getByPlaceholderText("Add a new todo...")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("allows adding new todo", () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("Add a new todo...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New todo" } });
    fireEvent.click(addButton);

    expect(input).toHaveValue("");
  });
});