import { memo } from "react";
import { StyleSheet } from "react-native";

import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { Button } from "./Button";

type FloatingActionButtonProps = {
  onPress: () => void;
};

const FloatingActionButtonComponent = ({
  onPress,
}: FloatingActionButtonProps) => {
  return (
    <Button
      title="+"
      accessibilityLabel="Add task"
      onPress={onPress}
      size="icon"
      style={styles.button}
      pressedStyle={styles.pressed}
      textStyle={styles.icon}
    />
  );
};

export const FloatingActionButton = memo(FloatingActionButtonComponent);

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.primary,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  icon: {
    color: colors.primaryText,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "600",
  },
});
