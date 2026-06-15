import { create } from 'zustand';

interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  clipboardAutoSync: boolean;
  setDarkMode: (v: boolean) => void;
  setNotifications: (v: boolean) => void;
  setClipboardAutoSync: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  darkMode: true,
  notifications: true,
  clipboardAutoSync: false,
  setDarkMode: (darkMode) => set({ darkMode }),
  setNotifications: (notifications) => set({ notifications }),
  setClipboardAutoSync: (clipboardAutoSync) => set({ clipboardAutoSync }),
}));
