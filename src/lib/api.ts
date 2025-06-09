import { Todo, TodoFormData, TodoUpdateData } from '@/types/todo';

const API_BASE = '/api/todos';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'Failed to perform operation');
  }
  return response.json();
}

export const todoApi = {
  // Fetch all todos
  getAll: async (): Promise<Todo[]> => {
    const response = await fetch(API_BASE);
    return handleResponse<Todo[]>(response);
  },

  // Create a new todo
  create: async (data: TodoFormData): Promise<Todo> => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Todo>(response);
  },

  // Update a todo
  update: async (id: string, data: TodoUpdateData): Promise<Todo> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Todo>(response);
  },

  // Delete a todo
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
  },

  // Delete multiple todos
  deleteMany: async (ids: string[]): Promise<void> => {
    await Promise.all(ids.map(id => todoApi.delete(id)));
  },
}; 