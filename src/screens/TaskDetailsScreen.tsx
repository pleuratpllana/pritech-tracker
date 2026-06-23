import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StatusPill } from '../components/StatusPill';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { RootStackParamList } from '../types/navigation';
import { Task } from '../types/task';
import { formatDate } from '../utils/date';

const completeIcon = '\u2713';
const editIcon = '\u270E';
const trashIcon = '\u{1F5D1}';

type TaskDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'TaskDetails'> & {
  tasks: Task[];
  onToggleTask: (taskId: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
};

export const TaskDetailsScreen = ({
  navigation,
  route,
  tasks,
  onToggleTask,
  onDeleteTask,
}: TaskDetailsScreenProps) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const task = useMemo(
    () => tasks.find((item) => item.id === route.params.taskId),
    [route.params.taskId, tasks],
  );

  const handleBackToTasks = useCallback(() => {
    navigation.navigate('TaskList');
  }, [navigation]);

  const handleToggle = useCallback(() => {
    if (task) {
      void onToggleTask(task.id);
    }
  }, [onToggleTask, task]);

  const handleEdit = useCallback(() => {
    if (task) {
      navigation.navigate('AddTask', { taskId: task.id });
    }
  }, [navigation, task]);

  const handleRequestDelete = useCallback(() => {
    setIsConfirmingDelete(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmingDelete(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!task) {
      return;
    }

    await onDeleteTask(task.id);
    setIsConfirmingDelete(false);
    navigation.navigate('TaskList');
  }, [navigation, onDeleteTask, task]);

  const handleConfirmDeletePress = useCallback(() => {
    void handleConfirmDelete();
  }, [handleConfirmDelete]);

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.missingWrap}>
          <EmptyState
            title="Task not found"
            description="This task may have been removed."
            ctaLabel="Back to tasks"
            onPressCta={handleBackToTasks}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card radius="lg" padding="lg" style={styles.heroCard}>
          <View style={styles.heroTop}>
            <StatusPill completed={task.completed} />
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{task.category}</Text>
            </View>
          </View>
          <Text style={styles.title}>{task.title}</Text>
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Created</Text>
              <Text style={styles.metaValue}>{formatDate(task.createdAt)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Status</Text>
              <Text style={styles.metaValue}>{task.completed ? 'Completed' : 'Pending'}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {task.description || 'No description was added for this task.'}
          </Text>
        </Card>

        <View style={styles.actions}>
          <Button title="Edit todo" icon={editIcon} variant="secondary" onPress={handleEdit} />
          <Button
            title={task.completed ? 'Reopen todo' : 'Complete todo'}
            icon={task.completed ? '+' : completeIcon}
            onPress={handleToggle}
          />
          <Button
            title="Delete todo"
            icon={trashIcon}
            variant="danger"
            onPress={handleRequestDelete}
          />
        </View>
      </ScrollView>
      <ConfirmDeleteModal
        visible={isConfirmingDelete}
        title="Delete todo?"
        description="This will remove the todo from your list and local storage."
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDeletePress}
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
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  missingWrap: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  heroCard: {
    gap: spacing.md,
  },
  heroTop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    backgroundColor: colors.surface,
  },
  categoryText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  card: {
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaItem: {
    flex: 1,
    gap: spacing.xxs,
    borderRadius: 14,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  metaValue: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.sm,
  },
});
