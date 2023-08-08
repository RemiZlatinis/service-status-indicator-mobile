import AsyncStorage from '@react-native-async-storage/async-storage';

export * as settingsStorage from "./settingsStorage"

export async function isFirstLaunch(): Promise<boolean> {
  const KEY = "LAUNCHED"

  try {
    if (await AsyncStorage.getItem(KEY) === null) {
      await AsyncStorage.setItem(KEY, 'true');
      return true
    }
  } catch (error) {
    console.error('Error checking first launch:', error);
  }

  return false;
} 