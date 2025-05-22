import type { Control } from "react-hook-form";
import React, { useState } from "react";
import { FlatList, Modal, Pressable, View } from "react-native";
import { useColorScheme } from "nativewind";
import { Controller } from "react-hook-form";

import type { EvoConfiguration, EvoInput } from "~/utils/schemas/types";
import colors from "~/app/_styles/colors";
import { ChevronDown } from "../../atoms/assets/icons";
import { ThemedText } from "../../atoms/themed";
import ActionSheet from "../action-sheet";

interface BLEConfigSelectProps extends React.PropsWithChildren {
  inputHandle: string;
  control: Control;
  input: EvoInput;
  error: string | null;
  prop: EvoConfiguration;
}

export default function BLEConfigSelect({
  inputHandle,
  control,
  input,
  error,
  prop,
}: BLEConfigSelectProps) {
  const { colorScheme } = useColorScheme();
  const readOnly = prop.permissions.installer === "r";
  const basises = [25, 50, 75, 100];
  const basis = basises[input.colspan - 1] ?? 100;

  const [modalVisible, setModalVisible] = useState(false);

  if (!input.options || input.options.length === 0) return null;

  return (
    <Controller
      control={control}
      name={inputHandle}
      render={({ field: { onChange, value } }) => (
        <>
          <View className={`flex px-2`} style={{ flexBasis: `${basis}%` }}>
            <View>
              <ThemedText className="mb-1">{input.displayName}</ThemedText>
              <Pressable onPress={() => setModalVisible(true)}>
                <View
                  style={{
                    borderColor: colors[colorScheme ?? "light"].mainBorder,
                    backgroundColor: readOnly
                      ? colors[colorScheme ?? "light"].disabledBg
                      : "transparent",
                    height: 58,
                  }}
                  className={`font-montserrat mb-4 flex flex-row items-center justify-between rounded-lg border p-4`}
                >
                  <ThemedText
                    style={{
                      color: readOnly
                        ? colors[colorScheme ?? "light"].disabled
                        : colors[colorScheme ?? "light"].text,
                    }}
                  >
                    {input.options?.find((o) => o.value == value)?.label ??
                      "Select"}
                  </ThemedText>
                  <ChevronDown
                    size={14}
                    color={colors[colorScheme ?? "light"].text}
                  />
                </View>
              </Pressable>

              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <ActionSheet
                  isVisible={modalVisible}
                  onClose={() => {
                    setModalVisible(!modalVisible);
                  }}
                  title={input.displayName}
                >
                  <FlatList
                    scrollEnabled={true}
                    data={input.options}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <Pressable
                        onPress={() => {
                          onChange(item.value.toString());
                          setModalVisible(false);
                        }}
                      >
                        {index > 0 && (
                          <View className="h-1 w-full bg-white opacity-5" />
                        )}
                        <ThemedText className="py-6 text-lg">
                          {item.label}
                        </ThemedText>
                      </Pressable>
                    )}
                  />
                </ActionSheet>
              </Modal>
              {error && (
                <ThemedText style={{ color: "red" }}>{error}</ThemedText>
              )}
            </View>
          </View>
        </>
      )}
    />
  );
}
