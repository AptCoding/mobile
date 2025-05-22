import "@bacons/text-decoder/install";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { colorScheme, useColorScheme } from "nativewind";

import { TRPCProvider } from "~/utils/api";
import { tokenCache } from "~/utils/cache";

import "../styles.css";

import { useEffect, useState } from "react";

import Splashscreen from "./_components/splash";

colorScheme.set("dark");

export default function RootLayout() {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports */
  const [loaded] = useFonts({
    Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-ExtraBold": require("../../assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Light": require("../../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("../../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-ExtraLight": require("../../assets/fonts/Montserrat-ExtraLight.ttf"),
    "Montserrat-Black": require("../../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Thin": require("../../assets/fonts/Montserrat-Thin.ttf"),
  });
  /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports */

  const { colorScheme } = useColorScheme();
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing Clerk Publishable Key");
  }

  useEffect(() => {
    if (loaded && !isAppInitialized) {
      setIsAppInitialized(true);
    }
  }, [loaded]);

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <TRPCProvider>
          <Splashscreen
            isAppInitialized={isAppInitialized}
            onPress={() => setIsAppInitialized(true)}
          />

          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colorScheme == "dark" ? "#000000" : "#FFFFFF",
              },
              headerTitleStyle: {
                color: colorScheme == "dark" ? "#FFFFFF" : "#000000",
              },
              headerTintColor: colorScheme == "dark" ? "#FFFFFF" : "#000000",
              headerShadowVisible: false,
              contentStyle: {
                backgroundColor: colorScheme == "dark" ? "#000000" : "#FFFFFF",
              },
            }}
          >
            <Stack.Screen
              name="installer/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="installer/connect/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="installer/scan"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="installer/discover"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="home/index" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
          <StatusBar />
        </TRPCProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
