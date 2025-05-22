import type { CameraType } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Camera, CameraView, PermissionStatus } from "expo-camera";
import { router } from "expo-router";

import colors from "~/app/_styles/colors";
import { BlueTooth, ChevronLeft, ScanIcon } from "../atoms/assets/icons";
import BigButton from "../atoms/big-button";

export default function ScannerQR({
  productType,
}: {
  productType?: "EVO" | "V1";
}) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const type: CameraType = "back";

  useEffect(() => {
    void (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === PermissionStatus.GRANTED);
    })();
  }, []);

  //  Validate the data matches ROLEC_DK12345 or DKJ12455.
  //  The first letter can be a D or E followed by two more letters and 5 numbers
  //  and can either have ROLEC_ or not at the beginning case insensitive
  function validData(data: string): boolean {
    const regex =
      /^(?:[A-Z]{3}\d{5})(?:\s+[A-Za-z0-9+-]+(?:\s+[A-Z]{3}\d{5}))?$/;
    return regex.test(data);
  }

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    console.log(`Code with type ${type} and data ${data} has been scanned!`);
    if (validData(data)) {
      router.push({
        pathname: "/installer/connect/[id]",
        params: {
          id: data,
        },
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleScanForDevices = () => {
    router.push("/installer/discover");
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={type}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417", "code128"],
        }}
        onBarcodeScanned={handleBarCodeScanned}
        zoom={0.2}
      >
        <Pressable className="absolute left-4 top-8 p-4" onPress={handleBack}>
          <ChevronLeft size={16} color="#ffffff" />
        </Pressable>
        <View className="flex-1 items-center justify-center">
          <View style={styles.scanArea}>
            <ScanIcon color={colors.dark.text} size={280} />
          </View>
        </View>
        <View className="p-10">
          {productType == "EVO" && (
            <>
              <Text className="mb-2 text-2xl font-bold text-white">
                Scan the Barcode
              </Text>
              <Text className="mb-12 text-xl text-white">
                Located on the product sticker on the side of the chargepoint.
              </Text>
            </>
          )}
          {productType != "EVO" && (
            <>
              <Text className="mb-2 text-2xl font-bold text-white">
                Scan the QR Code
              </Text>
              <Text className="mb-12 text-xl text-white">
                Located on the back of the setup guide tag or inside the
                chargepoint.
              </Text>
            </>
          )}
          <BigButton
            label="Search For Devices"
            icon={<BlueTooth size={16} color="#ffffff" />}
            onPress={handleScanForDevices}
          />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 270,
    height: 270,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,.1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scanAgain: {
    position: "absolute",
    bottom: 20,
    color: "black",
    fontSize: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
    zIndex: 9,
  },
});
