import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

type StatusPillProps = {
  completed: boolean;
};

const StatusPillComponent = ({ completed }: StatusPillProps) => {
  return (
    <View style={[styles.pill, completed ? styles.completed : styles.pending]}>
      <Text style={[styles.label, completed ? styles.completedText : styles.pendingText]}>
        {completed ? 'Completed' : 'Pending'}
      </Text>
    </View>
  );
};

export const StatusPill = memo(StatusPillComponent);

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  completed: {
    backgroundColor: 'rgba(34, 197, 94, 0.14)',
  },
  pending: {
    backgroundColor: 'rgba(59, 130, 246, 0.14)',
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
  },
  completedText: {
    color: colors.success,
  },
  pendingText: {
    color: colors.primary,
  },
});
