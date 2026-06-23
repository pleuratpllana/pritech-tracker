import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/typography";

export const Footer = () => {
  return (
    <SafeAreaView style={styles.footer} edges={["bottom"]}>
      <Text style={styles.notice}>© 2026 – Pleurat Pllana.</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  notice: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
});
