import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Rolec Connect",
  slug: "connect",
  scheme: "app.rolec.connect",
  version: "1.0.8",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/splash-dark.png",
    resizeMode: "contain",
    backgroundColor: "#000000",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "app.rolec.connect",
    supportsTablet: false,
    requireFullScreen: true,
    userInterfaceStyle: "dark",
    splash: {
      backgroundColor: "#000000",
      image: "./assets/splash-dark.png",
      resizeMode: "contain",
    },
    buildNumber: "23",
    infoPlist: {
      NSCameraUsageDescription:
        "This app uses the camera to scan barcodes and QR codes on your Rolec devices.",
      NSBluetoothAlwaysUsageDescription:
        "This app uses Bluetooth to allow you to connect to your Rolec devices.",
    },
  },
  android: {
    googleServicesFile: "./google-services.json",
    package: "app.rolec.connect",
    userInterfaceStyle: "dark",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#000000",
    },
    permissions: [
      "android.permission.BLUETOOTH",
      "android.permission.BLUETOOTH_ADMIN",
      "android.permission.BLUETOOTH_CONNECT",
    ],
    versionCode: 23,
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  extra: {
    eas: {
      projectId: "227e1f63-a5fb-4d92-b52a-2f4a92e5eb9e",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "react-native-ble-plx",
      {
        isBackgroundEnabled: true,
        modes: ["peripheral", "central"],
        bluetoothAlwaysPermission:
          "Allow $(PRODUCT_NAME) to connect to bluetooth devices",
      },
    ],
  ],
});
