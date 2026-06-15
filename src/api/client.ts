import axios from 'axios';
import { router } from 'expo-router';
import { BASE_URL } from '@/constants/api';
import { getToken, deleteToken } from '@/utils/secure-storage';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await deleteToken();
      // Lazy import to avoid circular deps at module init time
      const { useAuthStore } = await import('@/store/auth-store');
      useAuthStore.getState().clearAuth();
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  },
);

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) return detail.map((e: { msg: string }) => e.msg).join(', ');
    return error.message;
  }
  return 'An unexpected error occurred';
}
