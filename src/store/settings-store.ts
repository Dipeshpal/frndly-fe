import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/react';
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
      storage: createJSONStorage(() => ({
        getItem: async (key) => {
          const value = await storage.get(key);
          return value ? value : null;
        },
        setItem: async (key, value) => {
          await storage.set(key, value);
        },
        removeItem: async (key) => {
          await storage.delete(key);
        },
      })),
      partialize: (state) => ({
        darkMode: state.darkMode,
        notifications: state.notifications,
        clipboardAutoSync: state.clipboardAutoSync,
      }),
    }
  )
);
