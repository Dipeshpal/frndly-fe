import { View, Text, TextInput, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { useState } from 'react';

interface FormFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function FormField({ label, error, containerStyle, ...props }: FormFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[{ gap: Spacing.xs }, containerStyle]}>
      {label && (
        <Text style={{ ...Typography.labelCaps, color: colors.body, textTransform: 'uppercase' }}>
          {label}
        </Text>
      )}
      <TextInput
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        placeholderTextColor={colors.muted}
        style={[
          {
            height: 44,
            backgroundColor: '#0c0c0c',
            borderRadius: 12,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: error ? colors.error : focused ? '#4d8eff' : '#262626',
            paddingHorizontal: Spacing.md,
            ...Typography.bodyLg,
            color: colors.ink,
          },
          props.style,
        ]}
        accessibilityLabel={label}
      />
      {error && <Text style={{ ...Typography.bodySm, color: colors.error }}>{error}</Text>}
    </View>
  );
}
