import { View, TextInput, Pressable, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search…', style }: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surfaceCard,
          borderRadius: Radius.md,
          borderCurve: 'continuous',
          paddingHorizontal: Spacing.sm,
          height: 44,
          borderWidth: 1,
          borderColor: colors.hairline,
          gap: Spacing.xs,
        },
        style,
      ]}
    >
      <Image source="sf:magnifyingglass" style={{ width: 16, height: 16, tintColor: colors.muted }} contentFit="contain" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedSoft}
        style={{ flex: 1, ...Typography.bodyMd, color: colors.ink }}
        accessibilityLabel="Search"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} accessibilityLabel="Clear search">
          <Image source="sf:xmark.circle.fill" style={{ width: 16, height: 16, tintColor: colors.mutedSoft }} contentFit="contain" />
        </Pressable>
      )}
    </View>
  );
}
