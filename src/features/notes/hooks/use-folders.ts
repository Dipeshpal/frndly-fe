import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foldersApi } from '@/api/folders';
import { QueryKeys } from '@/utils/query-keys';
import type { CreateFolderInput, UpdateFolderInput } from '@/types/folder.types';

export function useFolders() {
  return useQuery({
    queryKey: QueryKeys.folders,
    queryFn: foldersApi.list,
  });
}

export function useCreateFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFolderInput) => foldersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QueryKeys.folders }),
  });
}

export function useUpdateFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFolderInput }) => foldersApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QueryKeys.folders }),
  });
}

export function useDeleteFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => foldersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QueryKeys.folders });
      qc.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}
