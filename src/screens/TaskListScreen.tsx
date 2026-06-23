import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  GestureResponderEvent,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { EmptyState } from "../components/EmptyState";
import { FilterTabs } from "../components/FilterTabs";
import { SearchBar } from "../components/SearchBar";
import { StatusPill } from "../components/StatusPill";
import { SuggestedTaskCard } from "../components/SuggestedTaskCard";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/typography";
import { RootStackParamList } from "../types/navigation";
import { SuggestedTask, Task, TaskFilter } from "../types/task";
import { formatDate } from "../utils/date";

type TaskListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "TaskList"
> & {
  tasks: Task[];
  suggestedTasks: SuggestedTask[];
  isLoadingSuggestions: boolean;
  suggestionsError: string;
  onToggleTask: (taskId: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onDeleteAllTasks: () => Promise<void>;
};

const TaskSeparator = () => <View style={styles.separator} />;

const keyExtractor = (item: Task) => item.id;
const completeIcon = "\u2713";
const editIcon = "\u270E";
const trashIcon = "\u{1F5D1}";

export const TaskListScreen = ({
  navigation,
  tasks,
  suggestedTasks,
  isLoadingSuggestions,
  suggestionsError,
  onToggleTask,
  onDeleteTask,
  onDeleteAllTasks,
}: TaskListScreenProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("all");
  const [taskIdPendingDelete, setTaskIdPendingDelete] = useState<string | null>(
    null,
  );
  const [isConfirmingDeleteAll, setIsConfirmingDeleteAll] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedQuery = searchQuery.trim();
      setDebouncedSearchQuery(trimmedQuery.length >= 2 ? trimmedQuery : "");
    }, 220);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = debouncedSearchQuery.toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(normalizedQuery);
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "completed" && task.completed) ||
        (activeFilter === "pending" && !task.completed);

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, debouncedSearchQuery, tasks]);

  const emptyStateCopy = useMemo(() => {
    if (tasks.length === 0) {
      return {
        title: "No tasks yet",
        description: "Create your first task and keep the day moving.",
        ctaLabel: "Add your first task",
      };
    }

    if (debouncedSearchQuery) {
      return {
        title: "No search results",
        description: "Try a different title or clear the search field.",
      };
    }

    if (activeFilter === "completed") {
      return {
        title: "No completed tasks",
        description: "Completed work will appear here after you mark it done.",
      };
    }

    return {
      title: "No pending tasks",
      description:
        "Everything is complete. New pending work will show up here.",
    };
  }, [activeFilter, debouncedSearchQuery, tasks.length]);

  const handleAddTask = useCallback(() => {
    navigation.navigate("AddTask");
  }, [navigation]);

  const handleOpenTask = useCallback(
    (taskId: string) => {
      navigation.navigate("TaskDetails", { taskId });
    },
    [navigation],
  );

  const handleEditTask = useCallback(
    (taskId: string) => {
      navigation.navigate("AddTask", { taskId });
    },
    [navigation],
  );

  const handleRequestDelete = useCallback((taskId: string) => {
    setTaskIdPendingDelete(taskId);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setTaskIdPendingDelete(null);
    setIsConfirmingDeleteAll(false);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (isConfirmingDeleteAll) {
      void onDeleteAllTasks();
      setIsConfirmingDeleteAll(false);
      return;
    }

    if (taskIdPendingDelete) {
      void onDeleteTask(taskIdPendingDelete);
      setTaskIdPendingDelete(null);
    }
  }, [
    isConfirmingDeleteAll,
    onDeleteAllTasks,
    onDeleteTask,
    taskIdPendingDelete,
  ]);

  const handleRequestDeleteAll = useCallback(() => {
    if (tasks.length > 0) {
      setIsConfirmingDeleteAll(true);
    }
  }, [tasks.length]);

  const renderTask = useCallback<ListRenderItem<Task>>(
    ({ item }) => {
      const handlePress = () => {
        handleOpenTask(item.id);
      };

      const handleToggle = (event: GestureResponderEvent) => {
        event.stopPropagation();
        void onToggleTask(item.id);
      };

      const handleEdit = (event: GestureResponderEvent) => {
        event.stopPropagation();
        handleEditTask(item.id);
      };

      const handleDelete = (event: GestureResponderEvent) => {
        event.stopPropagation();
        handleRequestDelete(item.id);
      };

      return (
        <Card onPress={handlePress} elevated style={styles.taskCard}>
          <View style={styles.taskCardHeader}>
            <View style={styles.pillRow}>
              <StatusPill completed={item.completed} />
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
            <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
          </View>

          <Text
            style={[styles.taskTitle, item.completed && styles.completedTitle]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text style={styles.taskDescription} numberOfLines={2}>
            {item.description || "No description added."}
          </Text>

          <View style={styles.taskActions}>
            <Button
              title={item.completed ? "Reopen" : "Complete"}
              icon={item.completed ? "+" : completeIcon}
              onPress={handleToggle}
              size="sm"
              variant="surface"
              style={styles.completeButton}
              textStyle={styles.taskActionText}
              iconStyle={styles.taskActionText}
            />
            <Button
              title="Edit"
              icon={editIcon}
              onPress={handleEdit}
              size="sm"
              variant="surface"
              style={styles.editButton}
              textStyle={styles.editText}
              iconStyle={styles.editText}
            />
            <Button
              title="Delete"
              icon={trashIcon}
              onPress={handleDelete}
              size="sm"
              variant="dangerSubtle"
              style={styles.deleteButton}
              textStyle={styles.deleteText}
              iconStyle={styles.deleteText}
            />
          </View>
        </Card>
      );
    },
    [handleEditTask, handleOpenTask, handleRequestDelete, onToggleTask],
  );

  const taskListHeader = useMemo(
    () => (
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleWrap}>
            <Text style={styles.eyebrow}>Your workspace</Text>
            <Text style={styles.title}>Today</Text>
          </View>
          <View style={styles.headerActions}>
            <Button
              title="Delete All"
              icon={trashIcon}
              disabled={tasks.length === 0}
              onPress={handleRequestDeleteAll}
              size="sm"
              variant="ghost"
              style={[
                styles.deleteAllButton,
                tasks.length === 0 && styles.disabledTextButton,
              ]}
              pressedStyle={tasks.length > 0 && styles.pressedTextButton}
              textStyle={styles.deleteAllText}
              iconStyle={styles.deleteAllText}
            />
            <Button
              title="Add Todo"
              icon="+"
              onPress={handleAddTask}
              style={styles.addTodoButton}
            />
          </View>
        </View>
        <View>
          <Text style={styles.controlLabel}>Search todos</Text>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>
        <View>
          <Text style={styles.controlLabel}>Filter by</Text>
          <FilterTabs
            activeFilter={activeFilter}
            onChangeFilter={setActiveFilter}
          />
        </View>
        <Text style={styles.controlLabel}>TODOS</Text>
      </View>
    ),
    [
      activeFilter,
      handleAddTask,
      handleRequestDeleteAll,
      searchQuery,
      tasks.length,
    ],
  );

  const taskListEmptyState = useMemo(
    () => (
      <EmptyState
        title={emptyStateCopy.title}
        description={emptyStateCopy.description}
        ctaLabel={emptyStateCopy.ctaLabel}
        onPressCta={handleAddTask}
      />
    ),
    [emptyStateCopy, handleAddTask],
  );

  const suggestedTasksContent = useMemo(
    () =>
      suggestionsError ? (
        <Text style={styles.errorText}>{suggestionsError}</Text>
      ) : (
        <View style={styles.suggestionList}>
          {suggestedTasks.map((task) => (
            <SuggestedTaskCard key={task.id} task={task} />
          ))}
        </View>
      ),
    [suggestedTasks, suggestionsError],
  );

  const taskListFooter = useMemo(
    () => (
      <View style={styles.suggestionsSection}>
        <Text style={styles.sectionTitle}>Suggested Tasks</Text>
        <Text style={styles.sectionDescription}>
          A small set of public API ideas, kept separate from your tasks.
        </Text>
        {isLoadingSuggestions ? (
          <View style={styles.suggestionState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          suggestedTasksContent
        )}
      </View>
    ),
    [isLoadingSuggestions, suggestedTasksContent],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <FlatList
        data={filteredTasks}
        keyExtractor={keyExtractor}
        renderItem={renderTask}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={TaskSeparator}
        ListHeaderComponent={taskListHeader}
        ListEmptyComponent={taskListEmptyState}
        ListFooterComponent={taskListFooter}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        removeClippedSubviews={Platform.OS === "android"}
        windowSize={5}
      />
      <ConfirmDeleteModal
        visible={taskIdPendingDelete !== null || isConfirmingDeleteAll}
        title={isConfirmingDeleteAll ? "Delete all todos?" : "Delete todo?"}
        description={
          isConfirmingDeleteAll
            ? "This will remove every todo from your list and local storage."
            : "This will remove the todo from your list and local storage."
        }
        confirmLabel={isConfirmingDeleteAll ? "Delete All" : "Delete"}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  titleWrap: {
    flex: 1,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  addTodoButton: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
  },
  deleteAllButton: {
    minHeight: 28,
    justifyContent: "center",
    paddingHorizontal: spacing.xs,
  },
  deleteAllText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: "700",
  },
  disabledTextButton: {
    opacity: 0.35,
  },
  pressedTextButton: {
    opacity: 0.7,
  },
  controlLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  separator: {
    height: spacing.sm,
  },
  taskCard: {
    gap: spacing.sm,
  },
  taskCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  pillRow: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  categoryPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    backgroundColor: colors.surface,
  },
  categoryText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  date: {
    ...typography.caption,
    color: colors.textMuted,
  },
  taskTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  completedTitle: {
    color: colors.textSecondary,
    textDecorationLine: "line-through",
  },
  taskDescription: {
    ...typography.body,
    color: colors.textSecondary,
  },
  taskActions: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  completeButton: {
    flex: 1,
  },
  editButton: {
    width: 72,
  },
  deleteButton: {
    width: 92,
  },
  taskActionText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  editText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  deleteText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: "700",
  },
  suggestionsSection: {
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  sectionDescription: {
    ...typography.body,
    color: colors.textMuted,
  },
  suggestionState: {
    paddingVertical: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.danger,
  },
  suggestionList: {
    gap: spacing.sm,
  },
});
