import { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { RootStackParamList } from '../types/navigation';
import { Task, TaskCategory, TaskFormData } from '../types/task';

const completeIcon = '\u2713';

type AddTaskScreenProps = NativeStackScreenProps<RootStackParamList, 'AddTask'> & {
  tasks: Task[];
  onAddTask: (taskData: TaskFormData) => Promise<Task>;
  onUpdateTask: (taskId: string, taskData: TaskFormData) => Promise<void>;
};

const categories: TaskCategory[] = ['Work', 'Personal', 'Urgent'];

export const AddTaskScreen = ({
  navigation,
  route,
  tasks,
  onAddTask,
  onUpdateTask,
}: AddTaskScreenProps) => {
  const taskToEdit = useMemo(
    () => tasks.find((task) => task.id === route.params?.taskId),
    [route.params?.taskId, tasks],
  );
  const isEditing = Boolean(taskToEdit);
  const [title, setTitle] = useState(taskToEdit?.title ?? '');
  const [description, setDescription] = useState(taskToEdit?.description ?? '');
  const [category, setCategory] = useState<TaskCategory | null>(taskToEdit?.category ?? null);
  const [hasTouchedTitle, setHasTouchedTitle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTitleValid = title.trim().length > 0;
  const showTitleError = hasTouchedTitle && !isTitleValid;
  const isMissingTaskToEdit = Boolean(route.params?.taskId && !taskToEdit);

  const handleSubmit = useCallback(async () => {
    if (!isTitleValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData = {
        title,
        description,
        category: category ?? 'Personal',
      };

      if (taskToEdit) {
        await onUpdateTask(taskToEdit.id, taskData);
      } else {
        await onAddTask(taskData);
      }

      setIsSubmitting(false);
      navigation.goBack();
    } catch {
      setIsSubmitting(false);
    }
  }, [
    category,
    description,
    isSubmitting,
    isTitleValid,
    navigation,
    onAddTask,
    onUpdateTask,
    taskToEdit,
    title,
  ]);

  if (isMissingTaskToEdit) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.missingWrap}>
          <EmptyState
            title="Task not found"
            description="This task may have been removed."
            ctaLabel="Back to tasks"
            onPressCta={() => navigation.navigate('TaskList')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View>
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              onBlur={() => setHasTouchedTitle(true)}
              placeholder="Plan product review"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, showTitleError && styles.inputError]}
              autoFocus
            />
            {showTitleError ? <Text style={styles.errorText}>Title is required.</Text> : null}
          </View>

          <View>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryRow}>
              {categories.map((item) => {
                const isDisabled = !isTitleValid && !isEditing;
                const isActive = category === item && !isDisabled;

                return (
                  <Button
                    title={item}
                    disabled={isDisabled}
                    key={item}
                    onPress={() => setCategory(item)}
                    size="sm"
                    variant={isActive ? 'primary' : 'secondary'}
                    style={[
                      styles.categoryOption,
                      isDisabled && styles.disabledCategoryOption,
                    ]}
                    textStyle={[
                      styles.categoryLabel,
                      isActive && styles.activeCategoryLabel,
                      isDisabled && styles.disabledCategoryLabel,
                    ]}
                  />
                );
              })}
            </View>
          </View>

          <View>
            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add useful context, notes, or next steps."
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.textArea]}
              multiline
              textAlignVertical="top"
            />
          </View>

          <Button
            title={isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Create task'}
            icon={isEditing ? completeIcon : '+'}
            onPress={() => {
              void handleSubmit();
            }}
            disabled={!isTitleValid || isSubmitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  missingWrap: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  input: {
    ...typography.body,
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputError: {
    borderColor: colors.danger,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  categoryOption: {
    flex: 1,
  },
  disabledCategoryOption: {
    opacity: 0.48,
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  activeCategoryLabel: {
    color: colors.primaryText,
  },
  disabledCategoryLabel: {
    color: colors.textMuted,
  },
  textArea: {
    minHeight: 150,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
