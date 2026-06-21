import { useEffect, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '@/store/auth-store';
import { extractErrorMessage } from '@/api/client';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleLogin() {
  const googleLogin = useAuthStore((s) => s.googleLogin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    responseType: ResponseType.IdToken,
    scopes: ['openid', 'email', 'profile'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.params?.id_token;
      if (!idToken) {
        setError('Google sign-in did not return an ID token.');
        return;
      }
      setError(null);
      setLoading(true);
      googleLogin(idToken)
        .catch((e) => setError(extractErrorMessage(e)))
        .finally(() => setLoading(false));
    } else if (response?.type === 'error') {
      setError(response.error?.message ?? 'Google sign-in failed.');
    }
  }, [response, googleLogin]);

  const trigger = () => {
    promptAsync();
  };

  return { trigger, loading: loading || !request, error };
}
