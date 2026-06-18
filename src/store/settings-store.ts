import { create } from 'zustand';
import { persist } from 'zustand';
import { storage } from '@/utils/secure-storage';

interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  clipboardAutoSync: boolean;
  setDarkMode: (v: boolean) => void;
  setNotifications: (v: boolean) => void;
  setClipboardAutoSync: (v: boolean) => void;
  initialize: () => Promise<void>;
}

const storageAdapter = {
  getItem: async (key: string) => {
    const value = await storage.get(key);
    return value ? value : null;
  },
  setItem: async (key: string, value: string) => {
    await storage.set(key, value);
  },
  removeItem: async (key: string) => {
    await storage.delete(key);
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: true,
      notifications: true,
      clipboardAutoSync: false,
      setDarkMode: (darkMode) => set({ darkMode }),
      setNotifications: (notifications) => set({ notifications }),
      setClipboardAutoSync: (clipboardAutoSync) => set({ clipboardAutoSync }),
      initialize: async () => {
        const stored = await storage.get('frndly-settings');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            set(parsed);
          } catch (err) {
            console.error('Failed to parse stored settings:', err);
          }
        }
      },
    }),
    {
      name: 'frndly-settings',
      storage: storageAdapter as any,
      partialize: (state) => ({
        darkMode: state.darkMode,
        notifications: state.notifications,
        clipboardAutoSync: state.clipboardAutoSync,
      }),
    }
  )
);
