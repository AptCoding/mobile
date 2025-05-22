import type {
  DConfigurations,
  Device,
  EConfigurations,
} from "@Rolec-Services/rolec-bluetooth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  View,
} from "react-native";
import { router } from "expo-router";
import { requestPermissions, useBLE } from "@Rolec-Services/rolec-bluetooth";
import { useColorScheme } from "nativewind";

import {
  BlueTooth,
  ChevronLeft,
  QuestionIcon,
  Socket,
} from "~/app/_components/atoms/assets/icons";
import colors from "~/app/_styles/colors";
import BigButton from "../../atoms/big-button";
import { ThemedText } from "../../atoms/themed";

const d: DConfigurations = {
  auth: "0000e000-0000-1000-8000-00805f9b34fb",
  default: "0000e001-0000-1000-8000-00805f9b34fb",
  system: "0000e002-0000-1000-8000-00805f9b34fb",
  passwordCharacteristicUUID: "0000a001-0000-1000-8000-00805f9b34fb",
};

const e: EConfigurations = {
  evbServiceUUID: "0000a002-0000-1000-8000-00805f9b34fb",
  notifyUUID: "0000c305-0000-1000-8000-00805f9b34fb",
  evbWriteUUID: "0000c303-0000-1000-8000-00805f9b34fb",
  evbFrameIdentifier: "6969",
};

export default function BLEDiscover() {
  const { colorScheme } = useColorScheme();
  const [scanning, setScanning] = useState<boolean>(false);
  const { allDevices } = useBLE({
    scanning,
    protocolConfigurations: {
      d,
      e,
    },
  });

  useEffect(() => {
    setTimeout(() => {
      void startScanning();
    }, 1000);
  }, []);

  // Trigger the want to connect to a device using a set name
  const startScanning = async (): Promise<boolean> => {
    const permissionsGranted = await requestPermissions();
    if (!permissionsGranted) return false;

    setScanning(true);
    return true;
  };

  const connectToDevice = (device: Device) => {
    setScanning(false);
    const id = device.localName ?? device.name;

    if (id !== null)
      router.replace({
        pathname: "/installer/connect/[id]",
        params: {
          id: id,
        },
      });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="h-full flex-1 flex-col">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center">
          <Pressable className="p-4" onPress={handleBack}>
            <ChevronLeft size={16} color="#ffffff" />
          </Pressable>
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
      <View className="flex-row items-center gap-2 pt-7">
        <ThemedText className="text-4xl">
          {scanning ? "Checking" : "Scan"} for Devices
        </ThemedText>
      </View>

      <View className="flex-1 flex-row items-center justify-center">
        <Socket color="white" size={180} />
      </View>

      <View className="p-4">
        <ThemedText className="mb-2 text-2xl">
          Select a Nearby Device
        </ThemedText>
        <ThemedText className="font-montserrat_light mb-12 text-lg opacity-70">
          Ensure the chargepoint is powered on and Bluetooth is enabled on your
          device.
        </ThemedText>
        <BigButton
          label="Search For Devices"
          icon={<BlueTooth size={16} color="#ffffff" />}
          onPress={startScanning}
        />
      </View>

      {scanning && (
        <View className="absolute bottom-0 left-0 right-0 top-0 bg-black opacity-70"></View>
      )}
      <Modal animationType="slide" transparent={true} visible={scanning}>
        <View className="flex-1 items-center justify-center">
          <View
            className="w-11/12 rounded-2xl bg-white p-5 shadow-2xl shadow-black"
            style={{
              backgroundColor: colors[colorScheme ?? "light"].optionsMenuBg,
            }}
          >
            <ThemedText className="mb-2 text-center text-xl">
              Select your chargepoint
            </ThemedText>
            <FlatList
              data={allDevices}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Pressable onPress={() => connectToDevice(item)}>
                  <ThemedText className="py-4 text-center text-lg">
                    {item.localName ?? item.name}
                  </ThemedText>
                </Pressable>
              )}
            />
            <ActivityIndicator />
            <View className="mt-2">
              <BigButton label="Cancel" onPress={handleBack} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
