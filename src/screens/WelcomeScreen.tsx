import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../components/Button";
import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/typography";
import { RootStackParamList } from "../types/navigation";

type WelcomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Welcome"
> & {
  onCompleteWelcome: () => Promise<void>;
};

export const WelcomeScreen = ({
  navigation,
  onCompleteWelcome,
}: WelcomeScreenProps) => {
  const handleStart = () => {
    void onCompleteWelcome();
    navigation.replace("TaskList");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>PRITECH Tracker</Text>
          <Text style={styles.title}>A simple task manager.</Text>
          <Text style={styles.description}>
            Capture tasks, keep focus, and move through your list with a clean
            dark workspace.
          </Text>
        </View>
      </View>
      <Button
        title="Start "
        icon={"\u00e2\u2020\u2019"}
        onPress={handleStart}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    width: "100%",
    maxWidth: 420,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
    textTransform: "uppercase",
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: "center",
  },
});
