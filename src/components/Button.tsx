import { memo } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/typography";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "surface"
  | "dangerSubtle"
  | "ghost";

export type ButtonSize = "md" | "sm" | "icon";

export type ButtonProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  icon?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
};

const ButtonComponent = ({
  title,
  onPress,
  icon,
  accessibilityLabel,
  disabled = false,
  variant = "primary",
  size = "md",
  style,
  textStyle,
  iconStyle,
  pressedStyle,
}: ButtonProps) => {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isDangerSubtle = variant === "dangerSubtle";

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[size],
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        pressed && !disabled && pressedStyle,
        style,
      ]}
    >
      {icon ? (
        <Text
          style={[
            styles.iconLabel,
            styles[`${size}Text`],
            isPrimary && styles.primaryText,
            isSecondary && styles.secondaryText,
            isDangerSubtle && styles.dangerText,
            iconStyle,
          ]}
        >
          {icon}
        </Text>
      ) : null}
      <Text
        style={[
          styles.text,
          styles[`${size}Text`],
          isPrimary && styles.primaryText,
          isSecondary && styles.secondaryText,
          isDangerSubtle && styles.dangerText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export const Button = memo(ButtonComponent);

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    paddingHorizontal: spacing.md,
  },

  md: {
    minHeight: 52,
  },

  sm: {
    minHeight: 40,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
  },

  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 0,
  },

  primary: {
    backgroundColor: colors.primary,
  },

  secondary: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  danger: {
    backgroundColor: colors.danger,
  },

  surface: {
    backgroundColor: colors.surface,
  },

  dangerSubtle: {
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.35)",
    backgroundColor: "rgba(239, 68, 68, 0.08)",
  },

  ghost: {
    backgroundColor: "transparent",
  },

  disabled: {
    opacity: 0.45,
  },

  pressed: {
    opacity: 0.82,
  },

  text: {
    color: colors.textPrimary,
    fontWeight: "700",
  },

  iconLabel: {
    color: colors.textPrimary,
    fontWeight: "700",
  },

  mdText: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },

  smText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },

  iconText: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "700",
  },

  primaryText: {
    color: colors.primaryText,
  },

  secondaryText: {
    color: colors.textSecondary,
  },

  dangerText: {
    color: colors.danger,
  },
});
