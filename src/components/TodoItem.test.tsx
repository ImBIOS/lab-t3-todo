import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "./TodoItem";
import { type Todo } from "@prisma/client";

// Mock the API module
const mockMutate = vi.fn();

vi.mock("~/utils/api", () => ({
  default: {
    api: {
      todo: {
        toggleComplete: {
          useMutation: () => ({
            mutate: mockMutate,
          }),
        },
        update: {
          useMutation: () => ({
            mutate: mockMutate,
          }),
        },
        delete: {
          useMutation: () => ({
            mutate: mockMutate,
          }),
        },
      },
    },
  },
}));

describe("TodoItem", () => {
  const mockTodo: Todo = {
    id: "1",
    text: "Test todo",
    completed: false,
    dueDate: new Date("2024-01-01"),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1",
  };

  const mockHandlers = {
    onDelete: vi.fn(),
    onUpdate: vi.fn(),
  };

  it("renders todo text and due date", () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);
    expect(screen.getByText("Test todo")).toBeInTheDocument();
    expect(screen.getByText(/Due: /)).toBeInTheDocument();
  });

  it("shows edit form when edit button is clicked", () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByDisplayValue("Test todo")).toBeInTheDocument();
  });

  it("shows completed status correctly", () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} {...mockHandlers} />);
    const textElement = screen.getByText("Test todo");
    expect(textElement).toHaveClass("text-gray-500");
    expect(textElement).toHaveClass("line-through");
  });
});