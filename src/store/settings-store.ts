import { create } from 'zustand';
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

export const useSettingsStore = create<SettingsState>((set, get) => ({
  darkMode: true,
  notifications: true,
  clipboardAutoSync: false,

  setDarkMode: (darkMode) => {
    set({ darkMode });
    persistSettings(get());
  },

  setNotifications: (notifications) => {
    set({ notifications });
    persistSettings(get());
  },

  setClipboardAutoSync: (clipboardAutoSync) => {
    set({ clipboardAutoSync });
    persistSettings(get());
  },

  initialize: async () => {
    try {
      const stored = await storage.get('frndly-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          darkMode: parsed.darkMode ?? true,
          notifications: parsed.notifications ?? true,
          clipboardAutoSync: parsed.clipboardAutoSync ?? false,
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  },
}));

async function persistSettings(state: SettingsState) {
  const data = {
    darkMode: state.darkMode,
    notifications: state.notifications,
    clipboardAutoSync: state.clipboardAutoSync,
  };
  try {
    await storage.set('frndly-settings', JSON.stringify(data));
  } catch (err) {
    console.error('Failed to persist settings:', err);
  }
}
