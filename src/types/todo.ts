export interface Todo {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export type Filter = 'all' | 'active' | 'completed';

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

export interface TodoFormData {
  text: string;
}

export interface TodoUpdateData {
  text?: string;
  completed?: boolean;
} 