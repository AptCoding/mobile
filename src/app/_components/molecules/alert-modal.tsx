import React from "react";
import { Modal, Pressable, View } from "react-native";
import { useColorScheme } from "nativewind";

import colors from "~/app/_styles/colors";
import { ThemedText } from "../atoms/themed";

interface AlertModalProps {
  title: string;
  message: string;
  buttonLabel: string;
  onClose: () => void;
  show: boolean;
}

export default function AlertModal({
  title,
  message,
  buttonLabel,
  onClose,
  show,
}: AlertModalProps) {
  const { colorScheme } = useColorScheme();

  return (
    <Modal
      transparent={true}
      visible={show}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View
          className="flex max-w-sm items-center rounded-xl p-10 shadow-lg"
          style={{
            backgroundColor: colors[colorScheme ?? "light"].optionsMenuBg,
          }}
        >
          <ThemedText className="font-montserrat_semibold text-center text-2xl">
            {title}
          </ThemedText>
          <ThemedText className="mt-2 text-center text-lg opacity-80">
            {message}
          </ThemedText>
          <Pressable
            className="mt-3 rounded-xl bg-ev-500 p-4"
            onPress={onClose}
          >
            <ThemedText>{buttonLabel}</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
