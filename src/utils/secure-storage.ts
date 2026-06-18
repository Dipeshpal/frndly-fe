import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'frndly_access_token';
const DEVICE_ID_KEY = 'frndly_device_id';

function webFallback() {
  return {
    get: (key: string) => Promise.resolve(localStorage.getItem(key)),
    set: (key: string, value: string) => { localStorage.setItem(key, value); return Promise.resolve(); },
    delete: (key: string) => { localStorage.removeItem(key); return Promise.resolve(); },
  };
}

export const storage = Platform.OS === 'web'
  ? webFallback()
  : {
      get: (key: string) => SecureStore.getItemAsync(key),
      set: (key: string, value: string) => SecureStore.setItemAsync(key, value),
      delete: (key: string) => SecureStore.deleteItemAsync(key),
    };

const store = storage;

export async function getToken(): Promise<string | null> {
  return store.get(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  return store.set(TOKEN_KEY, token);
}

export async function deleteToken(): Promise<void> {
  return store.delete(TOKEN_KEY);
}

export async function getDeviceId(): Promise<string> {
  const existing = await store.get(DEVICE_ID_KEY);
  if (existing) return existing;
  const id = `${Platform.OS ?? 'unknown'}-${Math.random().toString(36).slice(2, 8)}`;
  await store.set(DEVICE_ID_KEY, id);
  return id;
}
