import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { TaskFilter } from '../types/task';
import { Button } from './Button';
import { Card } from './Card';

const filters: { label: string; value: TaskFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
];

type FilterTabsProps = {
  activeFilter: TaskFilter;
  onChangeFilter: (filter: TaskFilter) => void;
};

const FilterTabsComponent = ({ activeFilter, onChangeFilter }: FilterTabsProps) => {
  return (
    <Card style={styles.container}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <Button
            title={filter.label}
            key={filter.value}
            onPress={() => onChangeFilter(filter.value)}
            size="sm"
            variant={isActive ? 'surface' : 'ghost'}
            style={[styles.tab, isActive && styles.activeTab]}
            textStyle={[styles.label, isActive && styles.activeLabel]}
          />
        );
      })}
    </Card>
  );
};

export const FilterTabs = memo(FilterTabsComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    minHeight: 38,
    borderRadius: 12,
    paddingHorizontal: spacing.xs,
  },
  activeTab: {
    backgroundColor: colors.surface,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  activeLabel: {
    color: colors.textPrimary,
  },
});
