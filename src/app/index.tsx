import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, Stack } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

import Signin from "./_components/signin";

export default function Index() {
  const user = useUser();

  if (user.isSignedIn) return <Redirect href="/installer" />;

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Signin />
    </SafeAreaView>
  );
}
