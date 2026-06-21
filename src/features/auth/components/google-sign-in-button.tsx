import { View, Text, Alert } from 'react-native';
import { useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Spinner } from '@/components/ui/spinner';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { useGoogleLogin } from '@/features/auth/hooks/use-google-login';

export function GoogleSignInButton() {
  const { colors } = useTheme();
  const { trigger, loading, error } = useGoogleLogin();

  useEffect(() => {
    if (error) Alert.alert('Google sign-in failed', error);
  }, [error]);

  return (
    <PressableScale
      onPress={trigger}
      disabled={loading}
      accessibilityLabel="Sign in with Google"
      style={{
        height: 52,
        backgroundColor: colors.surfaceCard,
        borderRadius: Radius.md,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: colors.hairline,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? (
        <Spinner size={20} color={colors.ink} />
      ) : (
        <>
          <MaterialCommunityIcons name="google" size={20} color="#4285F4" />
          <Text style={{ ...Typography.button, color: colors.ink }}>Continue with Google</Text>
        </>
      )}
    </PressableScale>
  );
}
