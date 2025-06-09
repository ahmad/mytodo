import { useState, useEffect } from 'react';
import { Todo, Filter, TodoStats } from '@/types/todo';
import { todoApi } from '@/lib/api';

interface UseTodosReturn {
  todos: Todo[];
  stats: TodoStats;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  editTodo: (id: string, newText: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await todoApi.getAll();
      setTodos(data);
    } catch {
      setError('Failed to fetch todos');
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (text: string) => {
    setIsSubmitting(true);
    setError(null);

    // Optimistic update
    const tempId = Date.now().toString();
    const newTodo: Todo = {
      _id: tempId,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);

    try {
      const savedTodo = await todoApi.create({ text: text.trim() });
      setTodos(prev => prev.map(t => t._id === tempId ? savedTodo : t));
    } catch {
      setError('Failed to create todo');
      setTodos(prev => prev.filter(t => t._id !== tempId));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t._id === id);
    if (!todo) return;

    // Optimistic update
    const updatedTodo = { ...todo, completed: !todo.completed };
    setTodos(prev => prev.map(t => t._id === id ? updatedTodo : t));

    try {
      const savedTodo = await todoApi.update(id, { completed: !todo.completed });
      setTodos(prev => prev.map(t => t._id === id ? savedTodo : t));
    } catch {
      setError('Failed to update todo');
      setTodos(prev => prev.map(t => t._id === id ? todo : t));
    }
  };

  const editTodo = async (id: string, newText: string) => {
    const todo = todos.find(t => t._id === id);
    if (!todo || todo.text === newText) return;

    // Optimistic update
    const updatedTodo = { ...todo, text: newText };
    setTodos(prev => prev.map(t => t._id === id ? updatedTodo : t));

    try {
      const savedTodo = await todoApi.update(id, { text: newText });
      setTodos(prev => prev.map(t => t._id === id ? savedTodo : t));
    } catch {
      setError('Failed to update todo');
      setTodos(prev => prev.map(t => t._id === id ? todo : t));
    }
  };

  const deleteTodo = async (id: string) => {
    const todo = todos.find(t => t._id === id);
    if (!todo) return;

    // Optimistic update
    setTodos(prev => prev.filter(t => t._id !== id));

    try {
      await todoApi.delete(id);
    } catch {
      setError('Failed to delete todo');
      setTodos(prev => [...prev, todo]);
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);
    if (completedTodos.length === 0) return;

    // Optimistic update
    setTodos(prev => prev.filter(t => !t.completed));

    try {
      await todoApi.deleteMany(completedTodos.map(t => t._id));
    } catch {
      setError('Failed to clear completed todos');
      setTodos(prev => [...prev, ...completedTodos]);
    }
  };

  // Memoize filtered todos and stats
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats: TodoStats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  return {
    todos: filteredTodos,
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
  };
} 