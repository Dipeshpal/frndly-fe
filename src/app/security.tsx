import { Redirect } from 'expo-router';

export default function Security() {
  return <Redirect href="/(auth)/login" />;
}
