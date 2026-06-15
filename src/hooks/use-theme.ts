import { useColorScheme } from 'react-native';
import { Colors } from '@/theme/colors';
import { useSettingsStore } from '@/store/settings-store';

export type AppTheme = { colors: typeof Colors.light; isDark: boolean };

export function useTheme(): AppTheme {
  const systemScheme = useColorScheme();
  const darkMode = useSettingsStore((s) => s.darkMode);
  const isDark = darkMode || systemScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  return { colors: colors as typeof Colors.light, isDark };
}
