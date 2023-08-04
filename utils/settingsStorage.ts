import * as SecureStore from 'expo-secure-store';

import { Settings } from "../models";

export async function save(key: keyof Settings, value: string) {
  return SecureStore.setItemAsync(key, value);
}

export async function get(key: keyof Settings) {
  return SecureStore.getItemAsync(key);
}
