import { apiClient } from './client';
import type { Note, CreateNoteInput, UpdateNoteInput, NoteListResponse } from '@/types/note.types';

export const notesApi = {
  list: (params?: { page?: number; per_page?: number; search?: string; tag?: string; folder_id?: string; all_notes?: boolean }) =>
    apiClient.get<NoteListResponse>('/notes', { params }).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Note>(`/notes/${id}`).then((r) => r.data),

  create: (data: CreateNoteInput) =>
    apiClient.post<Note>('/notes', data).then((r) => r.data),

  update: (id: string, data: UpdateNoteInput) =>
    apiClient.put<Note>(`/notes/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/notes/${id}`).then((r) => r.data),
};
