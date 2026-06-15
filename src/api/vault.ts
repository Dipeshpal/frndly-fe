import { apiClient } from './client';
import type { Secret, CreateSecretInput, UpdateSecretInput } from '@/types/vault.types';

export const vaultApi = {
  list: (params?: { search?: string; category?: string }) =>
    apiClient.get<Secret[]>('/secrets', { params }).then((r) => r.data),

  create: (data: CreateSecretInput) =>
    apiClient.post<Secret>('/secrets', data).then((r) => r.data),

  update: (id: string, data: UpdateSecretInput) =>
    apiClient.put<Secret>(`/secrets/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/secrets/${id}`).then((r) => r.data),
};
