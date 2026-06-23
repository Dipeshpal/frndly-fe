import { View, Pressable, ViewStyle, Text } from 'react-native';
import { Image } from 'expo-image';
import { useState } from 'react';
import { FormField } from './form-field';
import { useTheme } from '@/hooks/use-theme';
import type { TextInputProps } from 'react-native';

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function PasswordInput({ label, error, containerStyle, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();

  return (
    <View style={[{ position: 'relative' }, containerStyle]}>
      <FormField
        {...props}
        label={label}
        error={error}
        secureTextEntry={!visible}
        style={{ paddingRight: 48 }}
      />
      <Pressable
        onPress={() => setVisible((v) => !v)}
        style={{ position: 'absolute', right: 12, bottom: error ? 24 : 10, padding: 4 }}
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
      >
        {process.env.EXPO_OS === 'web' ? (
          <Text style={{ fontSize: 20, color: colors.muted, lineHeight: 20 }}>
            {visible ? '🙈' : '👁'}
          </Text>
        ) : (
          <Image
            source={`sf:${visible ? 'eye.slash' : 'eye'}`}
            style={{ width: 20, height: 20, tintColor: colors.muted }}
            contentFit="contain"
          />
        )}
      </Pressable>
    </View>
  );
}
