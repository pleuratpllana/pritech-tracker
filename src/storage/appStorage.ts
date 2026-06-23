import AsyncStorage from '@react-native-async-storage/async-storage';

const HAS_STARTED_APP_KEY = '@pritech_has_started_app';

export const loadHasStartedApp = async () => {
  const storedValue = await AsyncStorage.getItem(HAS_STARTED_APP_KEY);
  return storedValue === 'true';
};

export const saveHasStartedApp = async () => {
  await AsyncStorage.setItem(HAS_STARTED_APP_KEY, 'true');
};
