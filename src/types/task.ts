export type TaskCategory = 'Work' | 'Personal' | 'Urgent';

export type Task = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  completed: boolean;
  createdAt: string;
  source?: 'local';
};

export type TaskFormData = {
  title: string;
  description: string;
  category: TaskCategory;
};

export type SuggestedTask = {
  id: number;
  title: string;
  completed: boolean;
};

export type TaskFilter = 'all' | 'completed' | 'pending';
