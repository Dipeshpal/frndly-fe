import { Pressable, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  onPress,
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  fullWidth = false,
}: ButtonProps) {
  const { colors } = useTheme();

  const isDisabled = disabled || loading;

  const heights: Record<Size, number> = { sm: 36, md: 44, lg: 52 };
  const pads: Record<Size, number> = { sm: Spacing.sm, md: Spacing.md, lg: Spacing.lg };

  const bgMap: Record<Variant, string> = {
    primary: isDisabled ? colors.primaryDisabled : colors.primary,
    secondary: colors.surfaceCard,
    ghost: 'transparent',
    destructive: '#ef4444',
  };

  const textMap: Record<Variant, string> = {
    primary: isDisabled ? colors.muted : colors.onPrimary,
    secondary: colors.ink,
    ghost: colors.ink,
    destructive: '#ffffff',
  };

  const borderMap: Record<Variant, string | undefined> = {
    primary: undefined,
    secondary: colors.hairline,
    ghost: undefined,
    destructive: undefined,
  };

  const containerStyle: ViewStyle = {
    height: heights[size],
    backgroundColor: bgMap[variant],
    borderRadius: Radius.md,
    borderCurve: 'continuous',
    paddingHorizontal: pads[size],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    ...(borderMap[variant] && {
      borderWidth: 1,
      borderColor: borderMap[variant],
    }),
    opacity: isDisabled ? 0.7 : 1,
    ...style,
  };

  const textStyle: TextStyle = {
    ...Typography.button,
    color: textMap[variant],
  };

  return (
    <Pressable
      style={({ pressed }) => [containerStyle, { opacity: pressed && !isDisabled ? 0.8 : containerStyle.opacity }]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textMap[variant]} />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </Pressable>
  );
}
