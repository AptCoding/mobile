import React from "react";
import { View } from "react-native";

import { ArrowRight, Socket } from "../../atoms/assets/icons";
import BigButton from "../../atoms/big-button";
import { ThemedText } from "../../atoms/themed";

export default function BLEConfirmConfiguration({
  onSubmit,
}: {
  onSubmit: () => void;
}) {
  return (
    <View className="flex-1">
      <View className="flex-row items-center gap-2 pt-7">
        <ThemedText className="text-4xl">Configuration</ThemedText>
      </View>

      <View className="flex-1 flex-row items-center justify-center">
        <Socket color="white" size={180} />
      </View>

      <View className="p-4">
        <ThemedText className="mb-2 text-2xl font-bold">
          Stand Close to the chargepoint
        </ThemedText>
        <ThemedText className="font-montserrat_light mb-12 text-lg opacity-70">
          Ensure the chargepoint is powered on and Bluetooth is enabled on your
          device. Don't move away from the chargepoint until configuration has
          finished.{" "}
        </ThemedText>
        <BigButton
          onPress={onSubmit}
          label="Push Configuration"
          icon={<ArrowRight size={16} color="white" />}
        />
      </View>
    </View>
  );
}
