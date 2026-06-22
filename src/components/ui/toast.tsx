import { createContext, use, useCallback, useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { View, Text, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

type ToastVariant = 'default' | 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastVariant, string> = {
  default: 'bell.fill',
  success: 'checkmark.circle.fill',
  error: 'xmark.circle.fill',
  info: 'info.circle.fill',
};

function AnimatedToast({ t, accentMap }: { t: ToastItem; accentMap: Record<ToastVariant, string> }) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, damping: 16, useNativeDriver: true }).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ translateY }],
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        maxWidth: 420,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.pill,
        borderCurve: 'continuous',
        backgroundColor: colors.surfaceStrong,
        borderWidth: 1,
        borderColor: colors.hairline,
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      }}
    >
      <Image source={`sf:${ICONS[t.variant]}`} style={{ width: 18, height: 18, tintColor: accentMap[t.variant] }} contentFit="contain" />
      <Text style={{ ...Typography.titleSm, color: colors.ink }}>{t.message}</Text>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const show = useCallback((message: string, variant: ToastVariant = 'default') => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  const accentMap: Record<ToastVariant, string> = {
    default: colors.brandBlue,
    success: colors.success,
    error: colors.error,
    info: colors.brandBlue,
  };

  return (
    <ToastContext value={{ show }}>
      {children}
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: insets.bottom + Spacing.xl,
          alignItems: 'center',
          gap: Spacing.xs,
        }}
      >
        {toasts.map((t) => (
          <AnimatedToast key={t.id} t={t} accentMap={accentMap} />
        ))}
      </View>
    </ToastContext>
  );
}

export function useToast(): ToastContextValue {
  const ctx = use(ToastContext);
  if (!ctx) return { show: () => {} };
  return ctx;
}
