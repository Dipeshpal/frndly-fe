import { View, Text, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export function ErrorState({ message = 'Something went wrong', onRetry, style }: ErrorStateProps) {
  const { colors } = useTheme();

  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl, gap: Spacing.md }, style]}>
      <Image source="sf:exclamationmark.triangle.fill" style={{ width: 32, height: 32, tintColor: colors.error }} contentFit="contain" />
      <Text style={{ ...Typography.bodyMd, color: colors.muted, textAlign: 'center' }}>{message}</Text>
      {onRetry && <Button label="Try again" onPress={onRetry} variant="secondary" />}
    </View>
  );
}
