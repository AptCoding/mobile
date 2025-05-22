import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import BleConnectionProvider from "~/app/_components/organisms/bluetooth/ble-connection-provider";
import BLEDiscover from "../_components/organisms/bluetooth/ble-discover";

export default function InstallerDiscover() {
  return (
    <SafeAreaView className="bg-background">
      <View className="items h-full w-full flex-col bg-background p-4">
        <Stack.Screen
          name="installer/discover"
          options={{
            headerShown: false,
          }}
        />

        <BleConnectionProvider>
          <BLEDiscover />
        </BleConnectionProvider>
      </View>
    </SafeAreaView>
  );
}
