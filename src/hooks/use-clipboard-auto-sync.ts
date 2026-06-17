import { Platform } from 'react-native';
import { useEffect, useRef } from 'react';
import * as Clipboard from 'expo-clipboard';

type PushFn = (content: string, callbacks?: { onSuccess?: () => void; onError?: () => void }) => void;

export function useClipboardAutoSync(push: PushFn) {
  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const lastPushed = useRef<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isNative) return;

    const subscription = Clipboard.addClipboardListener(({ contentTypes }) => {
      if (!contentTypes.includes(Clipboard.ContentType.PLAIN_TEXT)) return;

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(async () => {
        try {
          const text = await Clipboard.getStringAsync();
          if (!text || text === lastPushed.current) return;
          lastPushed.current = text;
          push(text);
        } catch {
          // silently ignore clipboard read errors
        }
      }, 500);
    });

    return () => {
      subscription.remove();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [isNative, push]);
}
