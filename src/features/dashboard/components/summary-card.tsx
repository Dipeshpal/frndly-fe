import { Text, Pressable, View, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  onPress?: () => void;
  statusLabel?: string;
  statusColor?: string;
}

export function SummaryCard({ title, value, icon, color, onPress, statusLabel, statusColor }: SummaryCardProps) {
  const { colors } = useTheme();
  const isWeb = Platform.OS === 'web';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }: any) => ({
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 150,
        maxWidth: isWeb ? 350 : '48%',
        minWidth: 150,
        backgroundColor: colors.surfaceCard,
        borderRadius: 12,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: hovered ? color : colors.border,
        padding: Spacing.md,
        overflow: 'hidden',
        opacity: pressed ? 0.85 : 1,
      })}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${value}`}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm }}>
        <View style={{ padding: 8, backgroundColor: `${color}1A`, borderRadius: 8 }}>
          {!isWeb ? (
            <Image source={`sf:${icon}`} style={{ width: 20, height: 20, tintColor: color }} contentFit="contain" />
          ) : (
            <Text style={{ fontSize: 20 }}>{icon}</Text>
          )}
        </View>
        {statusLabel && (
          <Text style={{ fontSize: 12, color: statusColor || colors.muted, fontWeight: '500' }}>{statusLabel}</Text>
        )}
      </View>
      <Text style={{ ...Typography.labelCaps, color: colors.body, textTransform: 'uppercase' }}>{title}</Text>
      <Text style={{ ...Typography.statNumber, color: colors.ink, marginTop: 4 }} selectable>
        {value}
      </Text>
      
      {/* Decorative bottom bar mimicking the design */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: `${color}33` }}>
        <View style={{ height: '100%', backgroundColor: color, width: '60%' }} />
      </View>
    </Pressable>
  );
}
