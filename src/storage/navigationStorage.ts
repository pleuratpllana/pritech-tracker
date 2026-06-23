import AsyncStorage from "@react-native-async-storage/async-storage";
import { InitialState } from "@react-navigation/native";

const NAVIGATION_STATE_KEY = "@pritech_navigation_state";

export const loadNavigationState = async (): Promise<
  InitialState | undefined
> => {
  const rawState = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);

  if (!rawState) {
    return undefined;
  }

  try {
    const parsedState: unknown = JSON.parse(rawState);
    return parsedState && typeof parsedState === "object"
      ? (parsedState as InitialState)
      : undefined;
  } catch {
    return undefined;
  }
};

export const saveNavigationState = async (state: InitialState | undefined) => {
  if (!state) {
    return;
  }

  await AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
};
