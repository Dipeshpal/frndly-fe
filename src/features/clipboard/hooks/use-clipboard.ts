import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clipboardApi } from '@/api/clipboard';
import { QueryKeys } from '@/utils/query-keys';
import { getDeviceId } from '@/utils/secure-storage';
import { extractErrorMessage } from '@/api/client';
import { useState } from 'react';

export function useClipboardList(search?: string) {
  return useQuery({
    queryKey: QueryKeys.clipboard(1, search),
    queryFn: () => clipboardApi.list({ page: 1, per_page: 50, search }),
  });
}

export function usePushClipboard() {
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const deviceId = await getDeviceId();
      return clipboardApi.create({ content, device_name: deviceId });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clipboard'] }),
    onError: (e) => setError(extractErrorMessage(e)),
  });

  return { push: mutation.mutate, loading: mutation.isPending, error };
}

export function useDeleteClipboardItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clipboardApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clipboard'] }),
  });
}
