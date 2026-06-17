import { Platform, View, Text } from 'react-native';
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
  const isWeb = Platform.OS === 'web';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, paddingVertical: Spacing.md }}>
      {!isWeb && (
        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${iconColor}19`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Image source={`sf:${icon}`} style={{ width: 16, height: 16, tintColor: iconColor }} contentFit="contain" />
        </View>
      )}
      <View style={{ flex: 1, gap: Spacing.xs }}>
        <Text style={{ ...Typography.bodyLg, color: colors.ink }}>{title}</Text>
        <Text style={{ ...Typography.bodySm, color: colors.body }}>{subtitle}</Text>
      </View>
      <Text style={{ ...Typography.labelCaps, color: colors.muted, textTransform: 'uppercase', fontSize: 10 }}>{formatDate(timestamp)}</Text>
    </View>
  );
}
