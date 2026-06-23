import { View, Text, StyleSheet } from 'react-native';
import { LandingShell, C, T, s } from '@/components/web/landing-shell';

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    body: `By creating a Frndly account or using any Frndly service, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.\n\nThese terms apply to all users, including visitors, registered users, and contributors of content.`,
  },
  {
    title: 'Use of the Service',
    body: `You may use Frndly solely for lawful purposes and in accordance with these terms. You agree not to use the service to store, transmit, or distribute content that is illegal, harmful, or infringes on the rights of others.\n\nYou are responsible for maintaining the security of your account credentials. Frndly cannot recover your master password or decrypt your data on your behalf.`,
  },
  {
    title: 'Account Registration',
    body: `You must provide accurate information when creating an account. You may not impersonate another person or use a name you are not authorized to use.\n\nYou must be at least 13 years of age to use Frndly. Users under 18 must have parental consent.`,
  },
  {
    title: 'Intellectual Property',
    body: `The Frndly application, brand, and all associated intellectual property are owned by Frndly and protected by applicable copyright and trademark law.\n\nYou retain full ownership of all content you store within Frndly. By using the service, you grant Frndly a limited license to store and transmit your encrypted data solely for the purpose of providing the service.`,
  },
  {
    title: 'Service Availability',
    body: `We aim for high availability but do not guarantee uninterrupted access to the service. Frndly may undergo maintenance, experience outages, or be modified at any time without prior notice.\n\nWe are not liable for any loss of data or business impact resulting from service unavailability.`,
  },
  {
    title: 'Termination',
    body: `You may delete your account at any time from account settings. Upon deletion, all your data will be permanently purged from our servers within 30 days.\n\nFrndly reserves the right to suspend or terminate accounts that violate these terms, with or without notice.`,
  },
  {
    title: 'Limitation of Liability',
    body: `Frndly is provided "as is" without warranties of any kind. To the maximum extent permitted by law, Frndly shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.\n\nOur total liability for any claim shall not exceed the amount you paid to Frndly in the 12 months preceding the claim.`,
  },
  {
    title: 'Changes to Terms',
    body: `We may update these terms at any time. We will notify you of material changes via email at least 30 days before they take effect. Continued use after the effective date constitutes acceptance.\n\nThese terms were last updated in June 2026.`,
  },
];

export default function TermsPage() {
  return (
    <LandingShell>
      <View style={[s.section, { paddingVertical: 80 }]}>
        <View style={[s.chip, { backgroundColor: C.violet + '18', borderWidth: 1, borderColor: C.violet + '40', marginBottom: 24 }]}>
          <Text style={[T.caps, { color: C.violet }]}>LEGAL</Text>
        </View>
        <Text style={[T.display, { color: C.text, maxWidth: 700 }]}>Terms of Service</Text>
        <Text style={[T.body, { color: C.textMuted, marginTop: 16, maxWidth: 600 }]}>
          These terms govern your use of Frndly. Please read them carefully before using the service.
        </Text>
        <Text style={[T.caps, { color: C.textDim, marginTop: 8 }]}>Last updated: June 2026</Text>

        <View style={styles.content}>
          {SECTIONS.map((sec, i) => (
            <View key={i} style={styles.section}>
              <Text style={[T.h3, { color: C.text }]}>{sec.title}</Text>
              <Text style={[T.body, { color: C.textMuted, marginTop: 12, lineHeight: 28 }]}>{sec.body}</Text>
            </View>
          ))}
        </View>
      </View>
    </LandingShell>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 56,
    maxWidth: 720,
    gap: 0,
  },
  section: {
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
});
