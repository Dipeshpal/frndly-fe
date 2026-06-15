import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  type?: 'default' | 'backgroundElement';
};

export function ThemedView({ style, type, ...otherProps }: ThemedViewProps) {
  const { colors } = useTheme();
  const bg = type === 'backgroundElement' ? colors.surfaceCard : colors.canvas;
  return <View style={[{ backgroundColor: bg }, style]} {...otherProps} />;
}
