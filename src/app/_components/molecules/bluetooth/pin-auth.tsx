import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";

import { BlueTooth } from "~/app/_components/atoms/assets/icons";
import BigButton from "~/app/_components/atoms/big-button";
import { ThemedText } from "~/app/_components/atoms/themed";
import ActionSheet from "~/app/_components/molecules/action-sheet";
import PinCode from "~/app/_components/molecules/pin-code";

interface BlePinAuthProps {
  deviceName: string;
  handleSubmit: (pin: string) => void;
  isVisible: boolean;
  initialPin?: string | undefined;
  waiting?: boolean;
}

export default function BLEPinAuth({
  deviceName,
  handleSubmit,
  isVisible,
  initialPin,
  waiting,
}: BlePinAuthProps) {
  const [pin, setPin] = useState<string>(initialPin ?? "");

  return (
    <ActionSheet isVisible={isVisible} onClose={() => router.back()}>
      <View className="p-4">
        <ThemedText className="mb-4 text-2xl font-bold text-white">
          {deviceName}
        </ThemedText>
        <ThemedText className="font-montserrat_light mb-4 text-xl text-white">
          Please enter the device PIN code found on the smartboard within the
          device.
        </ThemedText>
        <View className="mb-2 py-2">
          <ThemedText>Pin code</ThemedText>
          <PinCode
            onPinChange={setPin}
            length={4}
            isAlphanumeric={true}
            initialPin={pin}
          />
        </View>
        <BigButton
          label="Connect"
          icon={<BlueTooth size={16} color="#ffffff" />}
          onPress={() => handleSubmit(pin.toLowerCase())}
          isLoading={waiting}
          disabled={waiting}
        />
      </View>
    </ActionSheet>
  );
}
