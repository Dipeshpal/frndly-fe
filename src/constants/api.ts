import Constants from 'expo-constants';

function getApiUrl(): string {
  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const host = hostUri.split(':')[0];
      return `http://${host}:8004`;
    }
  }
  return process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8004';
}

export const API_URL = getApiUrl();
export const API_VERSION = '/api/v1';
export const BASE_URL = `${API_URL}${API_VERSION}`;
