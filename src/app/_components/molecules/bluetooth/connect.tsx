import { View } from "react-native";

import { BlueTooth, Socket } from "~/app/_components/atoms/assets/icons";
import BigButton from "~/app/_components/atoms/big-button";
import { ThemedText } from "~/app/_components/atoms/themed";

interface BleConnectProps {
  handleConnect: () => void;
  scanning: boolean;
}

export default function BLEConnect({
  handleConnect,
  scanning,
}: BleConnectProps) {
  return (
    <>
      <View className="flex-row items-center gap-2 pt-7">
        <ThemedText className="text-4xl">Connect to Device</ThemedText>
      </View>

      <View className="flex-1 flex-row items-center justify-center">
        <Socket color="white" size={180} />
      </View>

      <View className="p-4">
        <ThemedText className="mb-2 text-2xl">
          Stand Close to the Chargepoint
        </ThemedText>
        <ThemedText className="font-montserrat_light mb-12 text-lg opacity-70">
          Ensure the chargepoint is powered on and Bluetooth is enabled on your
          device.
        </ThemedText>
        <BigButton
          label="Connect"
          icon={<BlueTooth size={16} color="#ffffff" />}
          onPress={handleConnect}
          isLoading={scanning}
        />
      </View>
    </>
  );
}
