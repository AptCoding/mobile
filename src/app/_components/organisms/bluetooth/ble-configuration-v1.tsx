import { View } from "react-native";
import { router } from "expo-router";

import { useBleConnection } from "~/app/_components/organisms/bluetooth/ble-connection-provider";
import schema from "~/utils/schemas/v1/v4/schema";
import { Socket } from "../../atoms/assets/icons";
import BigButton from "../../atoms/big-button";
import ProgressBar from "../../atoms/progress-bar";
import { ThemedText } from "../../atoms/themed";
import BLEConfigurationForm from "./ble-configuration-form";
import BLEConnectionHeader from "./ble-connection-header";

export default function BLEConfigurationV1() {
  const {
    connected,
    authenticated,
    hasFetchedConfig,
    deviceConfig,
    progress,
    handleRead,
  } = useBleConnection();

  if (!connected && !authenticated) return null;

  if (!hasFetchedConfig)
    return (
      <View className="flex-1">
        <BLEConnectionHeader onBack={() => router.back()} />
        <View className="flex-row items-center gap-2 pt-7">
          <ThemedText className="text-4xl">Connecting</ThemedText>
        </View>

        <View className="flex-1 flex-row items-center justify-center">
          <Socket color="white" size={180} />
        </View>

        <View className="p-4">
          <View className="pb-8">
            <ProgressBar progress={progress} />
          </View>
          <ThemedText className="mb-2 text-2xl font-bold">
            Connecting to the chargepoint
          </ThemedText>
          <ThemedText className="font-montserrat_light mb-12 text-xl opacity-50">
            Ensure the chargepoint is powered on and Bluetooth is enabled on
            your device.
          </ThemedText>
          <BigButton
            label="Connect"
            onPress={() => handleRead("Get OCPP URL")}
          />
        </View>
      </View>
    );

  if (deviceConfig.length)
    return (
      <View className="flex-1">
        <BLEConfigurationForm schema={schema} />
      </View>
    );
}
