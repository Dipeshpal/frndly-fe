import { View, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { Radius } from '@/theme/spacing';

type CardVariant = 'default' | 'pink' | 'teal' | 'lavender' | 'peach' | 'ochre';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: number;
  style?: ViewStyle;
  shadow?: boolean;
  leftBorderColor?: string;
}

export function Card({ children, variant = 'default', padding = 16, style, shadow = false, leftBorderColor }: CardProps) {
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
          borderRadius: 12,
          borderCurve: 'continuous',
          padding,
          borderWidth: 1,
          borderColor: variant === 'default' ? colors.border : 'transparent',
          ...(leftBorderColor && { borderLeftWidth: 4, borderLeftColor: leftBorderColor }),
          ...(shadow && { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
