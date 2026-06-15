import { View, Text, TextInput, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { useState } from 'react';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function FormField({ label, error, containerStyle, ...props }: FormFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[{ gap: Spacing.xs }, containerStyle]}>
      <Text style={{ ...Typography.titleSm, color: colors.bodyStrong }}>{label}</Text>
      <TextInput
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        placeholderTextColor={colors.mutedSoft}
        style={[
          {
            height: 44,
            backgroundColor: colors.canvas,
            borderRadius: Radius.md,
            borderCurve: 'continuous',
            borderWidth: focused ? 1.5 : 1,
            borderColor: error ? colors.error : focused ? colors.ink : colors.hairline,
            paddingHorizontal: Spacing.md,
            ...Typography.bodyMd,
            color: colors.ink,
          },
          props.style,
        ]}
        accessibilityLabel={label}
      />
      {error && <Text style={{ ...Typography.caption, color: colors.error }}>{error}</Text>}
    </View>
  );
}
