import React, { useReducer, useState } from "react";

// الـ Initial State
const initialState = {
  todos: [],
  filter: "all", // all, completed, pending
};

// الـ Reducer Function
function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false,
          },
        ],
      };

    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };

    case "CLEAR_COMPLETED":
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

export default function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [inputValue, setInputValue] = useState("");

  // Filter الـ todos حسب الـ filter الحالي
  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === "completed") return todo.completed;
    if (state.filter === "pending") return !todo.completed;
    return true; // all
  });

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch({ type: "ADD_TODO", payload: inputValue.trim() });
      setInputValue("");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Todo App
      </h2>

      {/* Add Todo Form */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTodo(e)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2 justify-center">
        {["all", "pending", "completed"].map((filter) => (
          <button
            key={filter}
            onClick={() => dispatch({ type: "SET_FILTER", payload: filter })}
            className={`px-4 py-2 rounded-lg capitalize ${
              state.filter === filter
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Todos List */}
      <div className="space-y-2 mb-6">
        {filteredTodos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {state.filter === "all"
              ? "No todos yet!"
              : `No ${state.filter} todos!`}
          </p>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                todo.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  dispatch({ type: "TOGGLE_TODO", payload: todo.id })
                }
                className="w-5 h-5"
              />
              <span
                className={`flex-1 ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() =>
                  dispatch({ type: "DELETE_TODO", payload: todo.id })
                }
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Stats & Actions */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Total: {state.todos.length} | Completed:{" "}
          {state.todos.filter((t) => t.completed).length} | Pending:{" "}
          {state.todos.filter((t) => !t.completed).length}
        </span>

        {state.todos.some((t) => t.completed) && (
          <button
            onClick={() => dispatch({ type: "CLEAR_COMPLETED" })}
            className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Clear Completed
          </button>
        )}
      </div>
    </div>
  );
}
