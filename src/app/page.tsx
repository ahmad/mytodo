'use client';

import { useState } from 'react';
import TodoItem from '@/components/TodoItem';
import FilterButtons from '@/components/FilterButtons';
import AddTodoPopup from '@/components/AddTodoPopup';
import { useTodos } from '@/hooks/useTodos';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const {
    todos,
    stats,
    isLoading,
    isSubmitting,
    error,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    clearCompleted,
  } = useTodos();

  return (
    <div className="relative min-h-screen pb-20">
      <h1 className="text-2xl font-medium text-center mb-8 text-gray-900">
        Todo
      </h1>
      <div className="bg-white rounded-xl">
        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-50 border-b border-red-100">
            {error}
          </div>
        )}

        {!isLoading && todos.length > 0 && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                {stats.active} items left
              </div>
              <FilterButtons currentFilter={filter} onFilterChange={setFilter} />
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-gray-700">Loading todos...</p>
          ) : todos.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-700">
              {stats.total === 0
                ? 'No todos yet. Add one above!'
                : 'No todos match the current filter'}
            </p>
          ) : (
            <>
              {todos.map((todo) => (
                <TodoItem
                  key={todo._id}
                  id={todo._id}
                  text={todo.text}
                  completed={todo.completed}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                />
              ))}
              {stats.completed > 0 && (
                <div className="p-4 flex justify-between items-center text-sm text-gray-500">
                  <span>{stats.completed} completed</span>
                  <button
                    onClick={clearCompleted}
                    className="text-blue-500 hover:text-blue-600 focus:outline-none"
                  >
                    Clear completed
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center transition-transform hover:scale-105"
        aria-label="Add new todo"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Add Todo Popup */}
      {showPopup && (
        <AddTodoPopup
          onSubmit={addTodo}
          isSubmitting={isSubmitting}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
