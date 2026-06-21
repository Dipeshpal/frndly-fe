import { apiClient } from './client';
import type { LoginInput, SignupInput, AuthResponse, User } from '@/types/auth.types';

export const authApi = {
  login: (data: LoginInput) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  signup: (data: Omit<SignupInput, 'confirm_password'>) =>
    apiClient.post<AuthResponse>('/auth/signup', data).then((r) => r.data),

  me: () => apiClient.get<User>('/auth/me').then((r) => r.data),

  googleLogin: (idToken: string) =>
    apiClient.post<AuthResponse>('/auth/google', { id_token: idToken }).then((r) => r.data),
};
