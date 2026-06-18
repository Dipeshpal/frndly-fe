import { apiClient } from './client';
import type { Secret, FolderInfo, CreateSecretInput, UpdateSecretInput } from '@/types/vault.types';

export interface SecretPreview {
  id: string;
  name: string;
  category: string;
}

export const vaultApi = {
  folders: () =>
    apiClient.get<FolderInfo[]>('/secrets/folders').then((r) => r.data),

  previewFolder: (folderName: string) =>
    apiClient.get<SecretPreview[]>(`/secrets/folders/${encodeURIComponent(folderName)}/preview`).then((r) => r.data),

  deleteFolder: (folderName: string) =>
    apiClient.delete(`/secrets/folders/${encodeURIComponent(folderName)}`).then((r) => r.data),

  list: (params?: { search?: string; category?: string; folder?: string }) =>
    apiClient.get<Secret[]>('/secrets', { params }).then((r) => r.data),

  create: (data: CreateSecretInput) =>
    apiClient.post<Secret>('/secrets', data).then((r) => r.data),

  update: (id: string, data: UpdateSecretInput) =>
    apiClient.put<Secret>(`/secrets/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/secrets/${id}`).then((r) => r.data),
};
