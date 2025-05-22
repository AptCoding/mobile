import React from "react";
import { View } from "react-native";
import { router } from "expo-router";

import { ArrowRight, Socket, Zap } from "../../atoms/assets/icons";
import BigButton from "../../atoms/big-button";
import { ThemedText } from "../../atoms/themed";
import { useBleConnection } from "../../organisms/bluetooth/ble-connection-provider";

export default function BLECompleteConfiguration() {
  const { setMode } = useBleConnection();

  return (
    <View className="flex-1">
      <View className="flex-row items-center gap-2 pt-7">
        <ThemedText className="text-4xl">Configured</ThemedText>
      </View>

      <View className="flex-1 flex-row items-center justify-center">
        <Socket color="white" size={180} />
      </View>

      <View className="p-4">
        <ThemedText className="mb-2 text-2xl font-bold">
          Configuration Complete
        </ThemedText>
        <ThemedText className="font-montserrat_light mb-12 text-lg opacity-70">
          If your chargepoint needs to reboot, it should do so automatically.
          After this, you need to test all connectors or quickly configure
          another chargepoint with the same settings.
        </ThemedText>
        <BigButton
          onPress={() => setMode("TEST")}
          label="Test Connectors Now"
          icon={<Zap size={16} color="white" />}
        />
        <BigButton
          onPress={() => router.back()}
          label="Configure Next Chargepoint"
          icon={<ArrowRight size={16} color="white" />}
          variant="outline"
        />
      </View>
    </View>
  );
}
