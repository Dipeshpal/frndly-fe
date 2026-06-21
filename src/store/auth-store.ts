import { create } from 'zustand';
import { authApi } from '@/api/auth';
import { getToken, setToken, deleteToken } from '@/utils/secure-storage';
import type { User, LoginInput, SignupInput } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (data: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      const token = await getToken();
      if (token) {
        set({ token, isAuthenticated: true, isLoading: false });
        // Fetch user in background — don't block startup
        authApi.me().then((user) => set({ user })).catch(() => {});
      } else {
        set({ isLoading: false });
      }
    } catch {
      await deleteToken();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (data) => {
    const res = await authApi.login(data);
    await setToken(res.access_token);
    set({ user: res.user, token: res.access_token, isAuthenticated: true });
  },

  signup: async (data) => {
    const res = await authApi.signup({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    await setToken(res.access_token);
    set({ user: res.user, token: res.access_token, isAuthenticated: true });
  },

  googleLogin: async (idToken) => {
    const res = await authApi.googleLogin(idToken);
    await setToken(res.access_token);
    set({ user: res.user, token: res.access_token, isAuthenticated: true });
  },

  logout: async () => {
    await deleteToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),

  clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
}));
