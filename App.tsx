import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import {
  DefaultTheme,
  InitialState,
  NavigationContainer,
  NavigationState,
  PartialState,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { Footer } from './src/components/Footer';
import { Toast } from './src/components/Toast';
import { colors } from './src/constants/colors';
import { fetchSuggestedTasks } from './src/services/suggestedTasks';
import { loadHasStartedApp, saveHasStartedApp } from './src/storage/appStorage';
import { loadNavigationState, saveNavigationState } from './src/storage/navigationStorage';
import { createLocalTaskId, loadTasks, saveTasks } from './src/storage/taskStorage';
import { SuggestedTask, Task, TaskFormData } from './src/types/task';
import { showToast } from './src/utils/toast';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.primary,
  },
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [suggestionsError, setSuggestionsError] = useState('');
  const [hasStartedApp, setHasStartedApp] = useState(false);
  const [initialNavigationState, setInitialNavigationState] = useState<InitialState | undefined>();
  const tasksRef = useRef<Task[]>([]);

  useEffect(() => {
    const hydrateApp = async () => {
      try {
        const [storedTasks, storedHasStartedApp, storedNavigationState] = await Promise.all([
          loadTasks(),
          loadHasStartedApp(),
          loadNavigationState(),
        ]);
        tasksRef.current = storedTasks;
        setTasks(storedTasks);
        setHasStartedApp(storedHasStartedApp);
        setInitialNavigationState(storedNavigationState);
      } finally {
        setIsLoading(false);
      }
    };

    hydrateApp();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSuggestedTasks = async () => {
      try {
        const nextSuggestions = await fetchSuggestedTasks();
        if (isMounted) {
          setSuggestedTasks(nextSuggestions.slice(0, 6));
        }
      } catch {
        if (isMounted) {
          setSuggestionsError('Suggested tasks are unavailable right now.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingSuggestions(false);
        }
      }
    };

    loadSuggestedTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistTasks = useCallback(async (nextTasks: Task[]) => {
    const previousTasks = tasksRef.current;
    tasksRef.current = nextTasks;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(nextTasks);

    try {
      await saveTasks(nextTasks);
    } catch {
      tasksRef.current = previousTasks;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTasks(previousTasks);
      showToast('Unable to save task');
      throw new Error('Unable to save tasks.');
    }
  }, []);

  const completeWelcome = useCallback(async () => {
    setHasStartedApp(true);
    try {
      await saveHasStartedApp();
    } catch {
      showToast('Unable to save preference');
    }
  }, []);

  const addTask = useCallback(
    async ({ title, description, category }: TaskFormData) => {
      const nextTask: Task = {
        id: createLocalTaskId(),
        title: title.trim(),
        description: description.trim(),
        category,
        completed: false,
        createdAt: new Date().toISOString(),
        source: 'local',
      };

      await persistTasks([nextTask, ...tasksRef.current]);
      showToast('Task created');
      return nextTask;
    },
    [persistTasks],
  );

  const updateTask = useCallback(
    async (taskId: string, updates: TaskFormData) => {
      const didUpdateTask = tasksRef.current.some((task) => task.id === taskId);
      if (!didUpdateTask) {
        return;
      }

      const nextTasks = tasksRef.current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: updates.title.trim(),
              description: updates.description.trim(),
              category: updates.category,
            }
          : task,
      );

      await persistTasks(nextTasks);
      showToast('Task updated');
    },
    [persistTasks],
  );

  const toggleTask = useCallback(
    async (taskId: string) => {
      const didUpdateTask = tasksRef.current.some((task) => task.id === taskId);
      const nextTasks = tasksRef.current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task,
      );

      if (didUpdateTask) {
        await persistTasks(nextTasks);
        showToast('Task updated');
      }
    },
    [persistTasks],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      const nextTasks = tasksRef.current.filter((task) => task.id !== taskId);
      if (nextTasks.length !== tasksRef.current.length) {
        await persistTasks(nextTasks);
        showToast('Task deleted');
      }
    },
    [persistTasks],
  );

  const deleteAllTasks = useCallback(async () => {
    if (tasksRef.current.length === 0) {
      return;
    }

    await persistTasks([]);
    showToast('All tasks deleted');
  }, [persistTasks]);

  const handleNavigationStateChange = useCallback(
    (state: NavigationState | PartialState<NavigationState> | undefined) => {
      void saveNavigationState(state as InitialState | undefined);
    },
    [],
  );

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        initialState={initialNavigationState}
        onStateChange={handleNavigationStateChange}
        theme={navigationTheme}
      >
        <StatusBar style="light" />
        <View style={styles.appShell}>
          <View style={styles.navigator}>
            <AppNavigator
              tasks={tasks}
              suggestedTasks={suggestedTasks}
              isLoadingSuggestions={isLoadingSuggestions}
              suggestionsError={suggestionsError}
              hasStartedApp={hasStartedApp}
              onCompleteWelcome={completeWelcome}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onDeleteAllTasks={deleteAllTasks}
            />
          </View>
          <Footer />
          <Toast />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navigator: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
