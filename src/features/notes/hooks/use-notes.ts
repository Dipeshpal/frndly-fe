import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { notesApi } from '@/api/notes';
import { QueryKeys } from '@/utils/query-keys';
import { extractErrorMessage } from '@/api/client';
import type { CreateNoteInput, UpdateNoteInput } from '@/types/note.types';

export function useNoteList(
  search?: string,
  tag?: string,
  folderId?: string | null,
  allNotes?: boolean,
) {
  return useQuery({
    queryKey: QueryKeys.notes(1, search, tag, folderId, allNotes),
    queryFn: () => notesApi.list({
      page: 1,
      per_page: 50,
      search,
      tag,
      folder_id: allNotes ? undefined : folderId ?? undefined,
      all_notes: allNotes,
    }),
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: QueryKeys.note(id),
    queryFn: () => notesApi.get(id),
    enabled: !!id,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: CreateNoteInput) => notesApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notes'] }); setError(null); },
    onError: (e) => setError(extractErrorMessage(e)),
  });

  return { create: mutation.mutate, loading: mutation.isPending, error, data: mutation.data };
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteInput }) => notesApi.update(id, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      qc.setQueryData(QueryKeys.note(updated.id), updated);
    },
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
}
