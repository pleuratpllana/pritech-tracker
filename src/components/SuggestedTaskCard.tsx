import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { SuggestedTask } from '../types/task';
import { Card } from './Card';
import { StatusPill } from './StatusPill';

type SuggestedTaskCardProps = {
  task: SuggestedTask;
};

const SuggestedTaskCardComponent = ({ task }: SuggestedTaskCardProps) => {
  return (
    <Card variant="surface" style={styles.card}>
      <StatusPill completed={task.completed} />
      <Text style={styles.title}>{task.title}</Text>
    </Card>
  );
};

export const SuggestedTaskCard = memo(SuggestedTaskCardComponent);

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
    borderRadius: 14,
  },
  title: {
    ...typography.body,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
});
