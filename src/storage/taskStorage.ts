import AsyncStorage from '@react-native-async-storage/async-storage';

import { Task, TaskCategory } from '../types/task';

const TASKS_STORAGE_KEY = '@pritech_tasks';
const LOCAL_TASK_ID_PREFIX = 'local-';
const fallbackCategory: TaskCategory = 'Personal';

export const createLocalTaskId = () => `${LOCAL_TASK_ID_PREFIX}${Date.now()}`;

const isLocalTaskId = (id: string) => id.startsWith(LOCAL_TASK_ID_PREFIX) || /^\d{13,}$/.test(id);

const isTask = (value: unknown): value is Task => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const task = value as Task;
  const hasValidCategory =
    task.category === 'Work' || task.category === 'Personal' || task.category === 'Urgent';

  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    (typeof task.category === 'undefined' || hasValidCategory) &&
    typeof task.completed === 'boolean' &&
    typeof task.createdAt === 'string' &&
    (typeof task.source === 'undefined' || task.source === 'local')
  );
};

const isPersistableLocalTask = (task: Task) => task.source === 'local' || isLocalTaskId(task.id);

const normalizeLocalTask = (task: Task): Task => ({
  ...task,
  category: task.category || fallbackCategory,
  source: 'local',
});

export const loadTasks = async (): Promise<Task[]> => {
  const rawTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

  if (!rawTasks) {
    return [];
  }

  try {
    const parsedTasks: unknown = JSON.parse(rawTasks);
    return Array.isArray(parsedTasks)
      ? parsedTasks.filter(isTask).filter(isPersistableLocalTask).map(normalizeLocalTask)
      : [];
  } catch {
    return [];
  }
};

export const saveTasks = async (tasks: Task[]) => {
  const localTasks = tasks.filter(isPersistableLocalTask).map(normalizeLocalTask);

  if (tasks.length > 0 && localTasks.length === 0) {
    throw new Error('Refusing to overwrite local tasks with API-loaded tasks.');
  }

  await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(localTasks));
};
