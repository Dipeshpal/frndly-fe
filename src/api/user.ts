import { apiClient } from './client';
import type { User } from '@/types/auth.types';

export const userApi = {
  updateProfile: (data: { name?: string; email?: string }) =>
    apiClient.put<User>('/users/profile', data).then((r) => r.data),
};
