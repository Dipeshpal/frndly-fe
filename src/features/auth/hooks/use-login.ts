import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { extractErrorMessage } from '@/api/client';
import type { LoginInput } from '@/types/auth.types';

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (data: LoginInput) => {
    setError(null);
    setLoading(true);
    try {
      await login(data);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return { submit, error, loading };
}
