import { Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Spinner } from '@/components/ui/spinner';
import { Radius, Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'blue' | 'outline';
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
    blue: isDisabled ? colors.primaryDisabled : colors.brandBlue,
    outline: 'transparent',
  };

  const textMap: Record<Variant, string> = {
    primary: isDisabled ? colors.muted : colors.onPrimary,
    secondary: colors.ink,
    ghost: colors.ink,
    destructive: '#ffffff',
    blue: '#ffffff',
    outline: colors.ink,
  };

  const borderMap: Record<Variant, string | undefined> = {
    primary: undefined,
    secondary: colors.hairline,
    ghost: undefined,
    destructive: undefined,
    blue: undefined,
    outline: colors.hairline,
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
    <PressableScale
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={label}
    >
      {loading ? (
        <Spinner size={20} color={textMap[variant]} />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </PressableScale>
  );
}
