import { create } from 'zustand';

interface UIState {
  drawerOpen: boolean;
  sidebarCollapsed: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  drawerOpen: false,
  sidebarCollapsed: false,
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));
