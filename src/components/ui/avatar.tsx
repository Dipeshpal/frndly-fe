import { View, Text, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Radius } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

interface AvatarProps {
  name: string;
  size?: number;
  style?: ViewStyle;
}

const ACCENT_COLORS = ['#ff4d8b', '#1a3a3a', '#b8a4ed', '#ffb084', '#e8b94a', '#a4d4c5'];

function getColor(name: string): string {
  const idx = name.charCodeAt(0) % ACCENT_COLORS.length;
  return ACCENT_COLORS[idx];
}

export function Avatar({ name, size = 40, style }: AvatarProps) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const bg = getColor(name);
  const fontSize = size * 0.38;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: Radius.full,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text style={{ ...Typography.titleSm, fontSize, color: '#ffffff' }}>{initials}</Text>
    </View>
  );
}
