import { useState } from "react";
import { type Todo } from "@prisma/client";
import { api } from "~/utils/api";

interface TodoItemProps {
  todo: Todo;
  onDelete: () => void;
  onUpdate: () => void;
}

export function TodoItem({ todo, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [dueDate, setDueDate] = useState<string>(
    todo.dueDate ? todo.dueDate.toISOString().split("T")[0] : ""
  );

  const toggleComplete = api.todo.toggleComplete.useMutation({
    onSuccess: onUpdate,
  });

  const updateTodo = api.todo.update.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      onUpdate();
    },
  });

  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: onDelete,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTodo.mutate({
      id: todo.id,
      text,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded border border-gray-300 px-2 py-1"
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1"
        />
        <button
          type="submit"
          className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="rounded bg-gray-500 px-2 py-1 text-white hover:bg-gray-600"
        >
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete.mutate({ id: todo.id })}
        className="h-4 w-4"
      />
      <span
        className={`flex-1 ${todo.completed ? "text-gray-500 line-through" : ""}`}
      >
        {todo.text}
      </span>
      {todo.dueDate && (
        <span className="text-sm text-gray-500">
          Due: {todo.dueDate.toLocaleDateString()}
        </span>
      )}
      <button
        onClick={() => setIsEditing(true)}
        className="rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600"
      >
        Edit
      </button>
      <button
        onClick={() => deleteTodo.mutate({ id: todo.id })}
        className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}