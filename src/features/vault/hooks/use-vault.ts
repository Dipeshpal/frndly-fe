import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vaultApi } from '@/api/vault';
import { QueryKeys } from '@/utils/query-keys';
import { extractErrorMessage } from '@/api/client';
import { useState } from 'react';
import type { CreateSecretInput, UpdateSecretInput } from '@/types/vault.types';

export function useSecretList(search?: string, category?: string) {
  return useQuery({
    queryKey: QueryKeys.secrets(search, category),
    queryFn: () => vaultApi.list({ search, category }),
  });
}

export function useCreateSecret() {
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: CreateSecretInput) => vaultApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['secrets'] }); setError(null); },
    onError: (e) => setError(extractErrorMessage(e)),
  });

  return { create: mutation.mutate, loading: mutation.isPending, error };
}

export function useUpdateSecret() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSecretInput }) => vaultApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['secrets'] }),
  });
}

export function useDeleteSecret() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vaultApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['secrets'] }),
  });
}
