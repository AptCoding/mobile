import { Text, View } from "react-native";
import { StyleSheet } from "react-native-css-interop";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import BrandLogo from "../_components/atoms/assets/brand-logo";

export default function Index() {
  return (
    <SafeAreaView className="bg-background">
      <View className="items h-full w-full flex-col bg-background p-4">
        <Stack.Screen
          name="homeIndex"
          options={{
            headerShown: false,
          }}
        />

        <View
          className="relative flex items-center justify-center"
          style={styles.logo}
        >
          <BrandLogo />
        </View>

        <Text>Home Index</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: "17%",
    transform: [{ scale: 0.7 }],
  },
});
