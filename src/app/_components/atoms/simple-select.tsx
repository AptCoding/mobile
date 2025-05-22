import React, { useState } from "react";
import { FlatList, Modal, Pressable, View } from "react-native";
import { useColorScheme } from "nativewind";

import colors from "~/app/_styles/colors";
import ActionSheet from "../molecules/action-sheet";
import { ChevronDown } from "./assets/icons";
import { ThemedText } from "./themed";

export interface SimpleSelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.PropsWithChildren {
  displayName: string;
  options: SimpleSelectOption[];
  value: string;
  onChange: (e: string) => void;
}

export default function SimpleSelect({
  displayName,
  options,
  value,
  onChange,
}: SelectProps) {
  const { colorScheme } = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);

  if (options.length === 0) return null;

  return (
    <>
      <View>
        <ThemedText className="mb-1">{displayName}</ThemedText>
        <Pressable onPress={() => setModalVisible(true)}>
          <View
            style={{
              borderColor: colors[colorScheme ?? "light"].mainBorder,
              height: 58,
            }}
            className={`font-montserrat mb-4 flex flex-row items-center justify-between rounded-lg border p-4`}
          >
            <ThemedText>
              {options.find((o) => o.value == value)?.label ?? "Select"}
            </ThemedText>
            <ChevronDown
              size={14}
              color={colors[colorScheme ?? "light"].text}
            />
          </View>
        </Pressable>
      </View>
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
          title={displayName}
        >
          <FlatList
            scrollEnabled={true}
            data={options}
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
                <ThemedText className="py-6 text-lg">{item.label}</ThemedText>
              </Pressable>
            )}
          />
        </ActionSheet>
      </Modal>
    </>
  );
}
