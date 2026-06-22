import Constants from 'expo-constants';

function getApiUrl(): string {
  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const host = hostUri.split(':')[0];
      const url = `http://${host}:8004`;
      console.log('[API] base URL:', url);
      return url;
    }
  }
  const url = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8004';
  console.log('[API] base URL:', url);
  return url;
}

export const API_URL = getApiUrl();
export const API_VERSION = '/api/v1';
export const BASE_URL = `${API_URL}${API_VERSION}`;
