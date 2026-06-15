import { View, ActivityIndicator, Text, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export function LoadingState({ message, style }: LoadingStateProps) {
  const { colors } = useTheme();

  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md }, style]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={{ ...Typography.bodySm, color: colors.muted }}>{message}</Text>}
    </View>
  );
}
