import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { Button } from './Button';
import { Card } from './Card';

type EmptyStateProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  onPressCta?: () => void;
};

const EmptyStateComponent = ({ title, description, ctaLabel, onPressCta }: EmptyStateProps) => {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {ctaLabel && onPressCta ? (
        <Button title={ctaLabel} icon="+" onPress={onPressCta} style={styles.button} />
      ) : null}
    </Card>
  );
};

export const EmptyState = memo(EmptyStateComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
  },
});
