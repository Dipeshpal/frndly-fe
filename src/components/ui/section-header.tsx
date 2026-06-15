import { View, Text, Pressable, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
  style?: ViewStyle;
}

export function SectionHeader({ title, action, style }: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md }, style]}>
      <Text style={{ ...Typography.captionUppercase, color: colors.muted }}>{title.toUpperCase()}</Text>
      {action && (
        <Pressable onPress={action.onPress} accessibilityRole="button">
          <Text style={{ ...Typography.bodySm, color: colors.brandPink }}>{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}
