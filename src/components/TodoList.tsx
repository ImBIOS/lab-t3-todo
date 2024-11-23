import { useState } from "react";
import { api } from "~/utils/api";
import { TodoItem } from "./TodoItem";

export function TodoList() {
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoDueDate, setNewTodoDueDate] = useState("");

  const utils = api.useUtils();
  const todos = api.todo.getAll.useQuery();

  const createTodo = api.todo.create.useMutation({
    onSuccess: () => {
      setNewTodoText("");
      setNewTodoDueDate("");
      void utils.todo.getAll.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTodo.mutate({
      text: newTodoText,
      dueDate: newTodoDueDate ? new Date(newTodoDueDate) : undefined,
    });
  };

  const handleUpdate = () => {
    void utils.todo.getAll.invalidate();
  };

  if (!todos.data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 rounded border border-gray-300 px-2 py-1"
          required
        />
        <input
          type="date"
          value={newTodoDueDate}
          onChange={(e) => setNewTodoDueDate(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1"
        />
        <button
          type="submit"
          className="rounded bg-green-500 px-4 py-1 text-white hover:bg-green-600"
        >
          Add
        </button>
      </form>

      <div className="space-y-2 rounded border">
        {todos.data.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={handleUpdate}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
}