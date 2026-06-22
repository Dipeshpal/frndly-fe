import { apiClient } from './client';
import type { ClipboardItem, CreateClipboardInput, ClipboardListResponse } from '@/types/clipboard.types';

export const clipboardApi = {
  list: (params?: { page?: number; per_page?: number; search?: string; date?: string }) =>
    apiClient.get<ClipboardListResponse>('/clipboard', { params }).then((r) => r.data),

  create: (data: CreateClipboardInput) =>
    apiClient.post<ClipboardItem>('/clipboard', data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/clipboard/${id}`).then((r) => r.data),

  devices: () =>
    apiClient.get<import('@/types/clipboard.types').Device[]>('/clipboard/devices').then((r) => r.data),
};
