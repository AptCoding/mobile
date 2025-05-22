import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";

import ScannerQR from "../_components/organisms/scanner-qr";

export default function InstallerScan() {
  const { type } = useLocalSearchParams<{ type: "EVO" | "V1" }>();

  return (
    <SafeAreaView className="bg-background">
      <View className="items h-full w-full flex-col bg-background p-4">
        <Stack.Screen
          name="installer/scan"
          options={{
            headerShown: false,
          }}
        />

        <ScannerQR productType={type} />
      </View>
    </SafeAreaView>
  );
}
