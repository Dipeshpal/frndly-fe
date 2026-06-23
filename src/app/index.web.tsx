import { View, Text, Pressable, StyleSheet, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { LandingShell, C, T, s, useIsMobile, useSection } from '@/components/web/landing-shell';

function MockUI() {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -14, duration: 2200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
      <View style={styles.phoneGlow} />
      <Image
        source={require('../../assets/images/Mobile Screen.png')}
        style={styles.mockImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

function HeroContent({ goSignup, isMobile }: { goSignup: () => void; isMobile: boolean }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      { flex: isMobile ? undefined : 1 },
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
    ]}>
      <View style={[s.chip, { backgroundColor: C.emerald + '18', borderWidth: 1, borderColor: C.emerald + '40' }]}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.emerald }} />
        <Text style={[T.caps, { color: C.emerald }]}>END-TO-END ENCRYPTED</Text>
      </View>
      <Text style={[T.display, {
        color: C.text,
        marginTop: 20,
        fontSize: isMobile ? 32 : 52,
        lineHeight: isMobile ? 40 : 60,
      }]}>
        {'Your Entire Digital\n'}
        <Text style={{ color: C.blue }}>Ecosystem</Text>
        {', Unified\nand Secure.'}
      </Text>
      <Text style={[T.body, { color: C.textMuted, marginTop: 16, maxWidth: isMobile ? undefined : 420 }]}>
        Vault your secrets, sync your notes, and bridge your devices with military-grade encryption. The ultimate digital fortress built for power users.
      </Text>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
        <Pressable onPress={goSignup} style={[s.btnPrimaryLg, isMobile && { flex: 1, alignItems: 'center' }]}>
          <Text style={[T.body, { color: '#fff', fontWeight: '600' }]}>Get Started for Free</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const FEATURES = [
  { icon: '🔐', title: 'The Secure Vault', desc: 'Store API keys, passwords, and sensitive documents with peace of mind. Zero-knowledge architecture ensures only you have access.' },
  { icon: '📝', title: 'Synchronized Notes', desc: 'Rich text and full markdown support. Organize your thoughts and documentation across all your mobile and desktop devices.' },
  { icon: '📋', title: 'Smart Clipboard', desc: 'Instantly push text, code snippets, and verified links between connected nodes. No more emailing yourself links.' },
  { icon: '🖥️', title: 'Live Device Sync', desc: 'Monitor and manage your entire ecosystem in real-time. See exactly which nodes are connected and active at any moment.' },
];

const STATS = [
  { value: '4.2ms', label: 'REQUEST SPEED', color: C.blueDim },
  { value: '∞', label: 'ENCRYPTED VAULTS PER USER', color: C.violet },
  { value: '0', label: 'NOTIFICATIONS MISSED', color: C.emerald },
];

const PLATFORMS = ['iOS', 'Android', 'Chrome Extension'];

export default function LandingPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const sec = useSection();
  const isAuthenticated = useAuthStore((st) => st.isAuthenticated);
  const isLoading = useAuthStore((st) => st.isLoading);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/(tabs)/(dashboard)');
  }, [isAuthenticated, isLoading, router]);

  const goSignup = () => router.push('/(auth)/signup');

  return (
    <LandingShell>
      {/* Hero */}
      <View style={styles.heroWrapper}>
        {/* decorative orbs */}
        <View style={[styles.orb, { top: -80, right: '10%', width: 400, height: 400, backgroundColor: C.blue + '14' }]} />
        <View style={[styles.orb, { top: 120, left: '-5%', width: 280, height: 280, backgroundColor: C.violet + '10' }]} />
        <View style={[styles.orb, { bottom: -40, right: '30%', width: 200, height: 200, backgroundColor: C.emerald + '0c' }]} />

        <View style={[styles.hero, {
          flexDirection: isMobile ? 'column' : 'row',
          paddingHorizontal: isMobile ? 20 : 40,
          paddingVertical: isMobile ? 48 : 80,
          gap: isMobile ? 32 : 60,
        }]}>
          <HeroContent goSignup={goSignup} isMobile={isMobile} />
          {!isMobile && <MockUI />}
        </View>
      </View>

      {/* Features */}
      <View style={sec}>
        <Text style={[T.h2, { color: C.text, textAlign: 'center' }]}>Engineered for Absolute Sovereignty</Text>
        <Text style={[T.body, { color: C.textMuted, textAlign: 'center', marginTop: 12, maxWidth: 480, alignSelf: 'center' }]}>
          Frndly combines industrial-strength security with a seamless user experience to bring all your digital assets under one roof.
        </Text>
        <View style={s.featureGrid}>
          {FEATURES.map((f) => (
            <View key={f.title} style={s.featureCard}>
              <View style={s.featureIconWrap}>
                <Text style={{ fontSize: 24 }}>{f.icon}</Text>
              </View>
              <Text style={[T.h3, { color: C.text, marginTop: 16 }]}>{f.title}</Text>
              <Text style={[T.sm, { color: C.textMuted, marginTop: 8, lineHeight: 22 }]}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={[sec, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border }]}>
        <View style={{ flexDirection: isMobile ? 'column' : 'row' }}>
          {STATS.map((st, i) => (
            <View key={i} style={[
              styles.statItem,
              !isMobile && i < STATS.length - 1 && { borderRightWidth: 1, borderColor: C.border },
              isMobile && i < STATS.length - 1 && { borderBottomWidth: 1, borderColor: C.border },
            ]}>
              <Text style={[T.display, { color: st.color, fontSize: isMobile ? 32 : 44 }]}>{st.value}</Text>
              <Text style={[T.caps, { color: C.textDim, marginTop: 8 }]}>{st.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Split */}
      <View style={[sec, { flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 0 }]}>
        <View style={[s.featureCard, { flex: 1, marginRight: isMobile ? 0 : 8, padding: isMobile ? 24 : 40 }]}>
          <Text style={[T.h2, { color: C.text }]}>Cross-Platform Unity</Text>
          <Text style={[T.body, { color: C.textMuted, marginTop: 12 }]}>
            Native apps on iOS and Android. Our Chrome Extension brings the same experience to any desktop browser.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
            {PLATFORMS.map((p) => (
              <View key={p} style={styles.platformChip}>
                <Text style={[T.sm, { color: C.textMuted }]}>{p}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={[s.featureCard, { flex: 1, marginLeft: isMobile ? 0 : 8, padding: isMobile ? 24 : 40 }]}>
          <View style={styles.securityIconWrap}>
            <Text style={{ fontSize: 32 }}>🛡️</Text>
          </View>
          <Text style={[T.h3, { color: C.blueDim, marginTop: 16 }]}>AES-256 Bit</Text>
          <Text style={[T.sm, { color: C.textMuted, marginTop: 8 }]}>Your data is encrypted before it ever leaves your device.</Text>
          <View style={{ marginTop: 32, borderTopWidth: 1, borderColor: C.border, paddingTop: 24 }}>
            <Text style={[T.h2, { color: C.text }]}>Military-Grade Security</Text>
            <Text style={[T.body, { color: C.textMuted, marginTop: 12 }]}>
              We utilize the same standards trusted by global financial institutions and defense organizations to protect your digital life.
            </Text>
          </View>
        </View>
      </View>

      {/* CTA Banner */}
      <View style={sec}>
        <View style={[s.ctaBanner, {
          backgroundColor: C.blue + 'cc',
          borderColor: C.blue + '60',
          padding: isMobile ? 32 : 60,
        }]}>
          <Text style={[T.h1, { color: '#fff', textAlign: 'center', fontSize: isMobile ? 28 : 40 }]}>Be Among the First.</Text>
          <Text style={[T.body, { color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 12, maxWidth: 400 }]}>
            Frndly is just getting started. Sign up now for early access and help shape the future of personal data sovereignty.
          </Text>
          <Pressable onPress={goSignup} style={[s.btnPrimaryLg, { marginTop: 28, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }]}>
            <Text style={[T.body, { color: '#fff', fontWeight: '600' }]}>Get Started for Free</Text>
          </Pressable>
        </View>
      </View>
    </LandingShell>
  );
}

const styles = StyleSheet.create({
  heroWrapper: {
    overflow: 'hidden',
    position: 'relative',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  hero: {
    alignItems: 'center',
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
  },
  mockImage: {
    width: 300,
    height: 580,
  },
  phoneGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: C.blue + '20',
    alignSelf: 'center',
    top: '50%',
    marginTop: -150,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  platformChip: {
    backgroundColor: C.surfaceHigh,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  securityIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: C.blue + '22',
    borderWidth: 1,
    borderColor: C.blue + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
