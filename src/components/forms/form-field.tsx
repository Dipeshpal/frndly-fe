import { View, Text, TextInput, TextInputProps, ViewStyle, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { Platform } from 'react-native';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { useState } from 'react';

interface FormFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function FormField({ label, error, containerStyle, secureTextEntry, ...props }: FormFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isPassword = secureTextEntry === true;

  return (
    <View style={[{ gap: Spacing.xs }, containerStyle]}>
      {label && (
        <Text style={{ ...Typography.labelCaps, color: colors.body, textTransform: 'uppercase' }}>
          {label}
        </Text>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBackground, borderRadius: 12, borderCurve: 'continuous', borderWidth: 1, borderColor: error ? colors.error : focused ? colors.brandBlue : colors.inputBorder, paddingHorizontal: Spacing.md }}>
        <TextInput
          {...props}
          secureTextEntry={isPassword && !revealed}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          placeholderTextColor={colors.body}
          style={[
            {
              height: 44,
              flex: 1,
              ...Typography.bodyLg,
              color: colors.ink,
            },
            props.style,
          ]}
          accessibilityLabel={label}
        />
        {isPassword && (
          <Pressable onPress={() => setRevealed(!revealed)} style={{ padding: Spacing.xs }}>
            {process.env.EXPO_OS === 'web' ? (
              <Text style={{ fontSize: 18, color: colors.muted, lineHeight: 18 }}>
                {revealed ? '🙈' : '👁'}
              </Text>
            ) : (
              <Image source={`sf:${revealed ? 'eye.slash' : 'eye'}`} style={{ width: 18, height: 18, tintColor: colors.muted }} contentFit="contain" />
            )}
          </Pressable>
        )}
      </View>
      {error && <Text style={{ ...Typography.bodySm, color: colors.error }}>{error}</Text>}
    </View>
  );
}
