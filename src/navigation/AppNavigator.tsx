import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddTaskScreen } from '../screens/AddTaskScreen';
import { Header } from '../components/Header';
import { TaskDetailsScreen } from '../screens/TaskDetailsScreen';
import { TaskListScreen } from '../screens/TaskListScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { colors } from '../constants/colors';
import { RootStackParamList } from '../types/navigation';
import { SuggestedTask, Task, TaskFormData } from '../types/task';

type AppNavigatorProps = {
  tasks: Task[];
  suggestedTasks: SuggestedTask[];
  isLoadingSuggestions: boolean;
  suggestionsError: string;
  hasStartedApp: boolean;
  onCompleteWelcome: () => Promise<void>;
  onAddTask: (taskData: TaskFormData) => Promise<Task>;
  onUpdateTask: (taskId: string, taskData: TaskFormData) => Promise<void>;
  onToggleTask: (taskId: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onDeleteAllTasks: () => Promise<void>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = ({
  tasks,
  suggestedTasks,
  isLoadingSuggestions,
  suggestionsError,
  hasStartedApp,
  onCompleteWelcome,
  onAddTask,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  onDeleteAllTasks,
}: AppNavigatorProps) => {
  return (
    <Stack.Navigator
      initialRouteName={hasStartedApp ? 'TaskList' : 'Welcome'}
      screenOptions={{
        animation: 'slide_from_right',
        header: (props) => <Header {...props} />,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Welcome"
        options={{
          animation: 'fade',
        }}
      >
        {(props) => <WelcomeScreen {...props} onCompleteWelcome={onCompleteWelcome} />}
      </Stack.Screen>
      <Stack.Screen name="TaskList">
        {(props) => (
          <TaskListScreen
            {...props}
            tasks={tasks}
            suggestedTasks={suggestedTasks}
            isLoadingSuggestions={isLoadingSuggestions}
            suggestionsError={suggestionsError}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onDeleteAllTasks={onDeleteAllTasks}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddTask">
        {(props) => (
          <AddTaskScreen
            {...props}
            tasks={tasks}
            onAddTask={onAddTask}
            onUpdateTask={onUpdateTask}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="TaskDetails">
        {(props) => (
          <TaskDetailsScreen
            {...props}
            tasks={tasks}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
