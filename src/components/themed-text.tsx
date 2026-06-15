import { Text, type TextProps } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Typography } from '@/theme/typography';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'code';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  const { colors } = useTheme();
  const typeStyle = type === 'title' ? Typography.titleLg : type === 'small' ? Typography.bodySm : type === 'code' ? { fontFamily: 'monospace', fontSize: 12 } : Typography.bodyMd;

  return <Text style={[{ color: colors.ink }, typeStyle, style]} {...rest} />;
}
