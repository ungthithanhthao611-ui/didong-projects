import { Redirect } from "expo-router";

export default function Index() {
  // Logic sau này: if (isFirstTime) return <Redirect href="/onboarding" />;
  // if (!isLoggedIn) return <Redirect href="/(auth)/login" />;
  return <Redirect href="/onboarding" />;
}
