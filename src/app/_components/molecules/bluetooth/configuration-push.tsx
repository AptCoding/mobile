import React from "react";
import { View } from "react-native";

import colors from "~/app/_styles/colors";
import { Socket } from "../../atoms/assets/icons";
import ProgressBar from "../../atoms/progress-bar";
import { ThemedText } from "../../atoms/themed";

export default function BLEPushConfiguration({
  progress,
}: {
  progress: number;
}) {
  return (
    <View className="flex-1">
      <View className="flex-row items-center gap-2 pt-7">
        <ThemedText className="text-4xl">Configuring</ThemedText>
      </View>

      <View className="flex-1 flex-row items-center justify-center">
        <Socket color="white" size={180} />
      </View>

      <View className="flex items-center p-4 pt-8">
        <ThemedText className="mb-4" style={{ color: colors.light.green }}>
          Applying Configuration
        </ThemedText>
        <ProgressBar progress={progress} />
      </View>
    </View>
  );
}
