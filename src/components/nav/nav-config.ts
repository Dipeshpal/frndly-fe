import type { Href } from 'expo-router';

export interface NavItem {
  /** group segment used for active matching, e.g. "(dashboard)" */
  segment: string;
  label: string;
  icon: string;
  iconActive: string;
  route: Href;
}

export const NAV_ITEMS: NavItem[] = [
  { segment: '(dashboard)', label: 'Home', icon: 'house', iconActive: 'house.fill', route: '/(tabs)/(dashboard)' },
  { segment: '(clipboard)', label: 'Clipboard', icon: 'doc.on.clipboard', iconActive: 'doc.on.clipboard.fill', route: '/(tabs)/(clipboard)' },
  { segment: '(vault)', label: 'Vault', icon: 'lock', iconActive: 'lock.fill', route: '/(tabs)/(vault)' },
  { segment: '(notes)', label: 'Notes', icon: 'note.text', iconActive: 'note.text.badge.plus', route: '/(tabs)/(notes)' },
  { segment: '(alerts)', label: 'Alerts', icon: 'bell', iconActive: 'bell.fill', route: '/(tabs)/(alerts)' },
  { segment: '(devices)', label: 'Devices', icon: 'desktopcomputer', iconActive: 'desktopcomputer', route: '/(tabs)/(devices)' },
  { segment: '(settings)', label: 'Settings', icon: 'gear', iconActive: 'gearshape.fill', route: '/(tabs)/(settings)' },
];
