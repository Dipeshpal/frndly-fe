import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/user';
import { useAuthStore } from '@/store/auth-store';
import { extractErrorMessage } from '@/api/client';
import { useState } from 'react';

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: { name?: string; email?: string }) => userApi.updateProfile(data),
    onSuccess: (user) => { setUser(user); setError(null); },
    onError: (e) => setError(extractErrorMessage(e)),
  });

  return { update: mutation.mutate, loading: mutation.isPending, error };
}
