import { Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";

const backIcon = "\u2039";

export const Header = ({ navigation }: NativeStackHeaderProps) => {
  const canGoBack = navigation.canGoBack();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.side}>
          {canGoBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={navigation.goBack}
              hitSlop={spacing.xs}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={styles.backIcon}>{backIcon}</Text>
            </Pressable>
          ) : null}
        </View>

        <View pointerEvents="none" style={styles.logoWrap}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>PriTech Tracker</Text>
          </View>
        </View>

        <View style={styles.side} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  container: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
  },
  side: {
    width: 72,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  logoWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  pressedButton: {
    backgroundColor: colors.surface,
  },
  backIcon: {
    color: colors.textPrimary,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "500",
  },
});
