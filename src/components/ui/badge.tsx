import { View, Text, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  const { colors } = useTheme();

  const bgMap: Record<BadgeVariant, string> = {
    default: colors.surfaceCard,
    success: '#dcfce7',
    warning: '#fef9c3',
    error: '#fee2e2',
    info: '#dbeafe',
  };

  const textMap: Record<BadgeVariant, string> = {
    default: colors.muted,
    success: '#166534',
    warning: '#854d0e',
    error: '#991b1b',
    info: '#1e40af',
  };

  return (
    <View
      style={[
        {
          backgroundColor: bgMap[variant],
          borderRadius: Radius.pill,
          paddingHorizontal: Spacing.sm,
          paddingVertical: Spacing.xxs,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text style={{ ...Typography.caption, color: textMap[variant] }}>{label}</Text>
    </View>
  );
}
