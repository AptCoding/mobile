import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";

import BleConnectionProvider from "~/app/_components/organisms/bluetooth/ble-connection-provider";
import BLEConnector from "~/app/_components/organisms/bluetooth/ble-connector";

export default function InstallerConnect() {
  // Get the device id from the slug
  const { id } = useLocalSearchParams();

  if (!id || typeof id !== "string") return null;

  // split the id into id and password here and pass to the provider
  const parts = id.split(" ");

  // Initialize id and password variables
  const deviceId = parts[0] ?? "";
  const pin: string | undefined = parts[1];

  return (
    <SafeAreaView className="bg-background">
      <View className="items h-full w-full flex-col bg-background p-4">
        <Stack.Screen
          name="installer/connect/id"
          options={{
            headerShown: false,
          }}
        />

        <BleConnectionProvider>
          {typeof id == "string" && (
            <BLEConnector deviceName={deviceId} barcodePin={pin} />
          )}
        </BleConnectionProvider>
      </View>
    </SafeAreaView>
  );
}
