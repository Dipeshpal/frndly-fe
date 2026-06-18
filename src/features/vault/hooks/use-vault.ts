import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vaultApi } from '@/api/vault';
import { QueryKeys } from '@/utils/query-keys';
import { extractErrorMessage } from '@/api/client';
import { useState } from 'react';
import type { CreateSecretInput, UpdateSecretInput } from '@/types/vault.types';

export function useFolderList() {
  return useQuery({
    queryKey: ['vault-folders'],
    queryFn: () => vaultApi.folders(),
  });
}

export function useFolderPreview(folderName: string | null) {
  return useQuery({
    queryKey: ['vault-folder-preview', folderName],
    queryFn: () => vaultApi.previewFolder(folderName!),
    enabled: !!folderName,
    staleTime: 30_000,
  });
}

export function useDeleteFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (folderName: string) => vaultApi.deleteFolder(folderName),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secrets'] });
      qc.invalidateQueries({ queryKey: ['vault-folders'] });
    },
  });
}

export function useSecretList(search?: string, category?: string, folder?: string) {
  return useQuery({
    queryKey: QueryKeys.secrets(search, category, folder),
    queryFn: () => vaultApi.list({ search, category, folder }),
  });
}

export function useCreateSecret() {
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: CreateSecretInput) => vaultApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secrets'] });
      qc.invalidateQueries({ queryKey: ['vault-folders'] });
      setError(null);
    },
    onError: (e) => setError(extractErrorMessage(e)),
  });

  return { create: mutation.mutate, loading: mutation.isPending, error };
}

export function useUpdateSecret() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSecretInput }) => vaultApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secrets'] });
      qc.invalidateQueries({ queryKey: ['vault-folders'] });
    },
  });
}

export function useDeleteSecret() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vaultApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['secrets'] });
      qc.invalidateQueries({ queryKey: ['vault-folders'] });
    },
  });
}
