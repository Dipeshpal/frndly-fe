import { View, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme/spacing';
import { Shadows } from '@/theme/shadows';

type CardVariant = 'default' | 'pink' | 'teal' | 'lavender' | 'peach' | 'ochre';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: number;
  style?: ViewStyle;
  shadow?: boolean;
}

export function Card({ children, variant = 'default', padding = Spacing.md, style, shadow = false }: CardProps) {
  const { colors } = useTheme();

  const bgMap: Record<CardVariant, string> = {
    default: colors.surfaceCard,
    pink: colors.brandPink,
    teal: colors.brandTeal,
    lavender: colors.brandLavender,
    peach: colors.brandPeach,
    ochre: colors.brandOchre,
  };

  return (
    <View
      style={[
        {
          backgroundColor: bgMap[variant],
          borderRadius: Radius.lg,
          borderCurve: 'continuous',
          padding,
          ...(shadow && { boxShadow: Shadows.soft }),
          borderWidth: variant === 'default' ? 1 : 0,
          borderColor: colors.hairline,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
