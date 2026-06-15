import { View, Text, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: { label: string; onPress: () => void };
  style?: ViewStyle;
}

export function EmptyState({ icon, title, description, action, style }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl, gap: Spacing.md }, style]}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surfaceCard, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={`sf:${icon}`} style={{ width: 28, height: 28, tintColor: colors.muted }} contentFit="contain" />
      </View>
      <View style={{ gap: Spacing.xs, alignItems: 'center' }}>
        <Text style={{ ...Typography.titleMd, color: colors.ink, textAlign: 'center' }}>{title}</Text>
        <Text style={{ ...Typography.bodySm, color: colors.muted, textAlign: 'center', maxWidth: 260 }}>{description}</Text>
      </View>
      {action && (
        <Button label={action.label} onPress={action.onPress} variant="secondary" />
      )}
    </View>
  );
}
