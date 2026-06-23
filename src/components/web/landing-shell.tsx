import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

export const C = {
  bg: '#11131c',
  surface: '#1d1f29',
  surfaceHigh: '#282933',
  surfaceBright: '#373943',
  border: '#424754',
  borderSoft: '#32343e',
  text: '#e1e1ef',
  textMuted: '#c2c6d6',
  textDim: '#8c909f',
  blue: '#4d8eff',
  blueDim: '#adc6ff',
  violet: '#d0bcff',
  violetDim: '#571bc1',
  emerald: '#4edea3',
  emeraldDim: '#00a572',
};

export const T = {
  display: { fontFamily: 'system-ui, sans-serif', fontSize: 52, fontWeight: '700' as const, lineHeight: 60, letterSpacing: -1 },
  h1: { fontFamily: 'system-ui, sans-serif', fontSize: 40, fontWeight: '700' as const, lineHeight: 48, letterSpacing: -0.5 },
  h2: { fontFamily: 'system-ui, sans-serif', fontSize: 28, fontWeight: '600' as const, lineHeight: 36 },
  h3: { fontFamily: 'system-ui, sans-serif', fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontFamily: 'system-ui, sans-serif', fontSize: 16, fontWeight: '400' as const, lineHeight: 26 },
  sm: { fontFamily: 'system-ui, sans-serif', fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  caps: { fontFamily: 'system-ui, sans-serif', fontSize: 11, fontWeight: '700' as const, lineHeight: 16, letterSpacing: 1.2 },
};

export function useIsMobile() {
  return useWindowDimensions().width < 768;
}

export function useSection() {
  const isMobile = useIsMobile();
  return {
    paddingHorizontal: isMobile ? 20 : 40,
    paddingVertical: isMobile ? 40 : 72,
    maxWidth: 1280,
    alignSelf: 'center' as const,
    width: '100%' as const,
  };
}

const NAV_LINKS = [
  { label: 'Vault', href: '/vault' },
  { label: 'Clipboard', href: '/clipboard' },
  { label: 'Notes', href: '/notes' },
  { label: 'Notifications', href: '/notifications' },
  { label: 'Extension', href: '/extension' },
];

const FOOTER_LINKS = {
  PLATFORM: [
    { label: 'Chrome Extension', href: '/extension' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Security Whitepaper', href: '/security' },
  ],
};

export function NavBar() {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <View style={[s.nav, { paddingHorizontal: isMobile ? 20 : 40 }]}>
      <View style={s.navInner}>
        <Pressable onPress={() => router.push('/')}>
          <Text style={[T.h3, { color: C.blue }]}>Frndly</Text>
        </Pressable>
        {!isMobile && (
          <View style={s.navLinks}>
            {NAV_LINKS.map((l) => (
              <Pressable key={l.label} onPress={() => router.push(l.href as any)}>
                <Text style={[T.sm, { color: C.textMuted }]}>{l.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
        <View style={{ flexDirection: 'row', gap: isMobile ? 8 : 12, alignItems: 'center', marginLeft: isMobile ? 'auto' : 0 }}>
          {!isMobile && (
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={[T.sm, { color: C.textMuted }]}>Login</Text>
            </Pressable>
          )}
          <Pressable onPress={() => router.push('/(auth)/signup')} style={s.btnPrimary}>
            <Text style={[T.sm, { color: '#fff', fontWeight: '600' }]}>Get Started</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function Footer() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const sec = useSection();

  return (
    <View style={[sec, { borderTopWidth: 1, borderColor: C.border }]}>
      <View style={[s.footerRow, { flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 32 : 60 }]}>
        <View style={{ maxWidth: isMobile ? undefined : 260 }}>
          <Text style={[T.h3, { color: C.blue }]}>Frndly</Text>
          <Text style={[T.sm, { color: C.textDim, marginTop: 12, lineHeight: 22 }]}>
            Building the future of personal data sovereignty. Unified, encrypted, and accessible anywhere.
          </Text>
        </View>
        <View style={[s.footerLinks, { justifyContent: isMobile ? 'flex-start' : 'flex-end' }]}>
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <View key={section} style={{ gap: 12, minWidth: 140 }}>
              <Text style={[T.caps, { color: C.textDim }]}>{section}</Text>
              {links.map((l) => (
                <Pressable key={l.label} onPress={() => router.push(l.href as any)}>
                  <Text style={[T.sm, { color: C.textMuted }]}>{l.label}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </View>
      <View style={{ marginTop: 40, borderTopWidth: 1, borderColor: C.border, paddingTop: 24 }}>
        <Text style={[T.sm, { color: C.textDim }]}>© 2026 Frndly Secure Ecosystem. All rights reserved.</Text>
      </View>
    </View>
  );
}

interface LandingShellProps {
  children: React.ReactNode;
}

export function LandingShell({ children }: LandingShellProps) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <NavBar />
      {children}
      <Footer />
    </ScrollView>
  );
}

export const s = StyleSheet.create({
  nav: {
    borderBottomWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bg + 'ee',
    paddingVertical: 16,
  },
  navInner: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    gap: 32,
  },
  navLinks: {
    flex: 1,
    flexDirection: 'row',
    gap: 28,
  },
  btnPrimary: {
    backgroundColor: C.blue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnPrimaryLg: {
    backgroundColor: C.blue,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnOutlineLg: {
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  section: {
    paddingHorizontal: 40,
    paddingVertical: 72,
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 40,
  },
  featureCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 24,
  },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: C.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 60,
    flexWrap: 'wrap',
  },
  footerLinks: {
    flex: 1,
    flexDirection: 'row',
    gap: 48,
    flexWrap: 'wrap',
  },
  ctaBanner: {
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
});
