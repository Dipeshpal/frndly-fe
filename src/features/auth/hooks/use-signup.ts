import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { extractErrorMessage } from '@/api/client';
import type { SignupInput } from '@/types/auth.types';

export function useSignup() {
  const signup = useAuthStore((s) => s.signup);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (data: SignupInput) => {
    setError(null);
    setLoading(true);
    try {
      await signup(data);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return { submit, error, loading };
}
