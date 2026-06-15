import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { formatDate } from '@/utils/format';

interface ActivityItemProps {
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  timestamp: string;
}

export function ActivityItem({ icon, iconColor, title, subtitle, timestamp }: ActivityItemProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, borderCurve: 'continuous', backgroundColor: `${iconColor}18`, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={`sf:${icon}`} style={{ width: 16, height: 16, tintColor: iconColor }} contentFit="contain" />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ ...Typography.titleSm, color: colors.ink }}>{title}</Text>
        <Text style={{ ...Typography.caption, color: colors.muted }}>{subtitle}</Text>
      </View>
      <Text style={{ ...Typography.caption, color: colors.mutedSoft }}>{formatDate(timestamp)}</Text>
    </View>
  );
}
