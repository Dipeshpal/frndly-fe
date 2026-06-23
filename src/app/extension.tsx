import { Redirect } from 'expo-router';

export default function Extension() {
  return <Redirect href="/(auth)/login" />;
}
