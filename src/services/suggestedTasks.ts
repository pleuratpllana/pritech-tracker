import { SuggestedTask } from '../types/task';

const SUGGESTED_TASKS_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=6';

export const fetchSuggestedTasks = async (): Promise<SuggestedTask[]> => {
  const response = await fetch(SUGGESTED_TASKS_URL);

  if (!response.ok) {
    throw new Error('Unable to load suggested tasks.');
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((item): item is SuggestedTask => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      const suggestedTask = item as SuggestedTask;
      return (
        typeof suggestedTask.id === 'number' &&
        typeof suggestedTask.title === 'string' &&
        typeof suggestedTask.completed === 'boolean'
      );
    })
    .slice(0, 6);
};
