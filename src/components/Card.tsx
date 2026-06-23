import { memo, ReactNode } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

type CardVariant = 'card' | 'surface';
type CardPadding = 'md' | 'lg' | 'none';
type CardRadius = 'md' | 'lg';

type CardProps = {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
};

const CardComponent = ({
  children,
  onPress,
  variant = 'card',
  padding = 'md',
  radius = 'md',
  elevated = false,
  style,
}: CardProps) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    styles[`${padding}Padding`],
    styles[`${radius}Radius`],
    elevated && styles.elevated,
    style,
  ];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={cardStyle}>
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

export const Card = memo(CardComponent);

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  card: {
    backgroundColor: colors.card,
  },
  surface: {
    backgroundColor: colors.surface,
  },
  mdPadding: {
    padding: spacing.md,
  },
  lgPadding: {
    padding: spacing.lg,
  },
  nonePadding: {
    padding: 0,
  },
  mdRadius: {
    borderRadius: 16,
  },
  lgRadius: {
    borderRadius: 18,
  },
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 2,
  },
});
