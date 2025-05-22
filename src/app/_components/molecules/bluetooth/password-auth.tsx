import { useState } from "react";
import { TextInput, View } from "react-native";
import { router } from "expo-router";

import { BlueTooth } from "~/app/_components/atoms/assets/icons";
import BigButton from "~/app/_components/atoms/big-button";
import { ThemedText } from "~/app/_components/atoms/themed";
import ActionSheet from "~/app/_components/molecules/action-sheet";

interface BlePasswordAuthProps {
  deviceName: string;
  handleSubmit: (pin: string) => void;
  isVisible: boolean;
  initialPin?: string | undefined;
  waiting?: boolean;
}

export default function BLEPasswordAuth({
  deviceName,
  handleSubmit,
  isVisible,
  initialPin,
  waiting,
}: BlePasswordAuthProps) {
  const [password, setPassword] = useState<string>(initialPin ?? "");

  return (
    <ActionSheet isVisible={isVisible} onClose={() => router.back()}>
      <View className="p-4">
        <ThemedText className="font-montserrat_semibold mb-4 text-2xl">
          {deviceName}
        </ThemedText>
        <ThemedText className="font-montserrat_light mb-4 text-lg opacity-60">
          Please enter the device password found on the smartboard within the
          device.
        </ThemedText>
        <View className="mb-2 py-2">
          <ThemedText>Password</ThemedText>

          {/* Input field for email address */}
          <TextInput
            className="font-montserrat rounded-lg border border-gray-500 p-4 text-xl dark:text-white"
            value={password}
            onChangeText={(e) => setPassword(e)}
          />
        </View>
        <BigButton
          label="Connect"
          icon={<BlueTooth size={16} color="#ffffff" />}
          onPress={() => handleSubmit(password)}
          isLoading={waiting}
          disabled={waiting}
        />
      </View>
    </ActionSheet>
  );
}
