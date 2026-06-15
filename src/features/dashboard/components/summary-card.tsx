import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Shadows } from '@/theme/shadows';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  onPress?: () => void;
}

export function SummaryCard({ title, value, icon, color, onPress }: SummaryCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: colors.canvas,
        borderRadius: Radius.lg,
        borderCurve: 'continuous',
        padding: Spacing.md,
        gap: Spacing.sm,
        borderWidth: 1,
        borderColor: colors.hairline,
        boxShadow: Shadows.soft,
        opacity: pressed ? 0.85 : 1,
      })}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${value}`}
    >
      <View style={{ width: 36, height: 36, borderRadius: 10, borderCurve: 'continuous', backgroundColor: `${color}18`, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={`sf:${icon}`} style={{ width: 18, height: 18, tintColor: color }} contentFit="contain" />
      </View>
      <Text style={{ ...Typography.displaySm, color: colors.ink, fontVariant: ['tabular-nums'] }} selectable>
        {value}
      </Text>
      <Text style={{ ...Typography.caption, color: colors.muted }}>{title}</Text>
    </Pressable>
  );
}
