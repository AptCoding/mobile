import { Pressable, View } from "react-native";

import {
  BlueTooth,
  ChevronLeft,
  QuestionIcon,
} from "~/app/_components/atoms/assets/icons";
import { ThemedText } from "~/app/_components/atoms/themed";
import { useBleConnection } from "./ble-connection-provider";

interface BleConnectionHeaderProps {
  onBack: () => void;
  device?: string;
}

export default function BLEConnectionHeader({
  onBack,
  device,
}: BleConnectionHeaderProps) {
  const { connected, deviceName } = useBleConnection();

  return (
    <View className="flex-row items-center justify-between gap-2">
      <View className="flex-row items-center">
        <Pressable className="p-4" onPress={onBack}>
          <ChevronLeft size={16} color="#ffffff" />
        </Pressable>
        <View className="flex-row items-center gap-2">
          <ThemedText className="p-0 pt-1 text-xl leading-tight dark:text-gray-500">
            {deviceName || device}
          </ThemedText>
          {connected && <BlueTooth size={16} color="#00AEEF" />}
        </View>
      </View>
      <Pressable
        className="p-4"
        onPress={() => {
          console.log("Question click");
        }}
      >
        <QuestionIcon size={24} />
      </Pressable>
    </View>
  );
}
