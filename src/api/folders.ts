import { apiClient } from './client';
import type { Folder, CreateFolderInput, UpdateFolderInput } from '@/types/folder.types';

export const foldersApi = {
  list: () =>
    apiClient.get<Folder[]>('/folders').then((r) => r.data),

  create: (data: CreateFolderInput) =>
    apiClient.post<Folder>('/folders', data).then((r) => r.data),

  update: (id: string, data: UpdateFolderInput) =>
    apiClient.put<Folder>(`/folders/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/folders/${id}`).then((r) => r.data),
};
