import type {
  DConfigurations,
  Device,
  DeviceHandlerDiscriminated,
  EConfigurations,
  ResponseResultsSchemaType,
} from "@Rolec-Services/rolec-bluetooth";
import type { ReactNode } from "react";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  dUtils,
  requestPermissions,
  useBLE,
} from "@Rolec-Services/rolec-bluetooth";

import type { BleCommonAlertTypes } from "./ble-common-alert";
import type { BleConfigProp } from "~/utils/schemas/evo/utils";
import type { EvoConfiguration } from "~/utils/schemas/types";
import { api } from "~/utils/api";
import { formatHandleString } from "~/utils/helpers";
import evoschema from "~/utils/schemas/evo/schema";
import {
  fetchAndSanitizeReadParameters,
  findDataKeysFromResponse,
} from "~/utils/schemas/evo/utils";
import v1schema from "~/utils/schemas/v1/v4/schema";
import BleCommonAlert from "./ble-common-alert";

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

interface BleConnectionContextProps {
  scanning: boolean;
  connected: boolean;
  authenticate: (pass: string) => Promise<boolean | undefined>;
  authenticated: boolean;
  authenticating: boolean;
  deviceName: string | null;
  deviceHandler: DeviceHandlerDiscriminated | null;
  connectToDevice: (device: string) => Promise<boolean>;
  deviceConfig: BleConfigProp[];
  hasFetchedConfig: boolean;
  progress: number;
  handleRead: (key: string, data?: string) => Promise<boolean | string>;
  handleReboot: () => Promise<boolean | void>;
  handleWrite: (key: string, writeValue: string) => Promise<boolean | string>;
  fetchConfig: () => void;
  pin: string | undefined;
  mode: "CONFIGURE" | "CONFIGURED" | "TEST" | "UPDATE";
  setMode: (e: "CONFIGURE" | "CONFIGURED" | "TEST" | "UPDATE") => void;
}

const BleConnectionContext = createContext<
  BleConnectionContextProps | undefined
>(undefined);

interface BleConnectionProviderProps {
  children: ReactNode;
}

export default function BleConnectionProvider({
  children,
}: BleConnectionProviderProps) {
  // Managing the connection state
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const isConnecting = useRef(false);

  // Managing the configuration data state on the device
  const [progress, setProgress] = useState(0);
  const [hasFetchedConfig, setHasFetchedConfig] = useState(false);
  const [numberOfExpectedKeys, setNumberOfExpectedKeys] = useState<
    number | null
  >(null);
  const [config, setConfig] = useState<BleConfigProp[]>([]);
  const configRef = useRef<BleConfigProp[]>([]);
  const [pin, setPin] = useState<string>();
  const [connectedDevice, setConnectedDevice] = useState<Device>();

  // TRPC config calls
  const { refetch: refetchExists } =
    api.mobile.chargepoint.query.configurationExists.useQuery(
      { serialNumber: deviceName?.toUpperCase() ?? "" },
      { enabled: false },
    );

  const { refetch: setInitConfig } =
    api.mobile.chargepoint.mutate.initConfiguration.useQuery(
      {
        serialNumber: deviceName?.toUpperCase() ?? "",
        configurations: configRef.current.map((c) => ({
          key: formatHandleString(c.handle),
          value: c.value,
        })),
      },
      { enabled: false },
    );

  // Options are CONFIGURE, TEST or UPDATE
  const [mode, setMode] = useState<
    "CONFIGURE" | "CONFIGURED" | "TEST" | "UPDATE"
  >("CONFIGURE");

  const [showCommonError, setShowCommonError] =
    useState<BleCommonAlertTypes>(null);

  // Using the BLE Library
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { allDevices, connect, disconnect, connected, deviceHandler } = useBLE({
    scanning,
    protocolConfigurations: {
      d,
      e,
    },
  });

  // Trigger the want to connect to a device using a set name
  const connectToDevice = async (name: string): Promise<boolean> => {
    setDeviceName(name);
    const permissionsGranted = await requestPermissions();
    if (!permissionsGranted) return false;

    setScanning(true);
    return true;
  };

  const BLEControlledConnect = (device: Device) => {
    if (isConnecting.current === false) {
      isConnecting.current = true;
      connect(device)
        .then((hasConnected) => {
          console.log("-----HAS CONNECTED TO THE DEVICE-----");
          setIsConnected(hasConnected);

          // Currently only works for EVO
          if (deviceHandler?.protocol == "Rolec_E") setConnectedDevice(device);

          setScanning(false);
        })
        .catch((err) => {
          setScanning(false);
          setShowCommonError("UNABLE_TO_CONNECT");

          // Currently only works for EVO
          if (connectedDevice && deviceHandler?.protocol == "Rolec_E")
            setConnectedDevice(undefined);

          console.log("unable to connect");
          console.log(err);
        })
        .finally(() => {
          isConnecting.current = false;
        });
    }
  };

  // If we find some devices, we are scanning and are not connected
  // then we need to connnect and update the states
  useEffect(() => {
    if (scanning && !connected && allDevices.length > 0) {
      console.log(`Found devices, looking for ${deviceName}`);
      const device = allDevices.find(
        (device) =>
          device.localName?.toUpperCase() === deviceName?.toUpperCase(),
      );
      if (device) {
        console.log("Device found");
        BLEControlledConnect(device);
      }
    }
  }, [allDevices, scanning]);

  //  When we have connected make sure we are not scanning
  //  and disconnect on exit
  useEffect(() => {
    if (connected) {
      setIsConnected(true);
      setScanning(false);
    } else {
      console.log("---WE DROPPED OFF---");
      console.log(deviceHandler);
      console.log(allDevices);

      // This is a back up to if the unit is disconnected
      // but we are in the middle of something
      // Only works for EVO at this point
      if (connectedDevice && deviceHandler === null && deviceName !== null)
        void connectToDevice(deviceName);

      setIsConnected(false);
      setIsAuthenticated(false);
      setHasFetchedConfig(false);
      setProgress(0);
    }

    return () => {
      if (connected)
        disconnect()
          .then(() => {
            // Do nothing
          })
          .catch((err) => {
            console.log("unable to disconnect");
            console.log(err);
          });
    };
  }, [connected]);

  // Handling incoming notifications from the Bluetooth device
  useEffect(() => {
    if (!deviceHandler) return;

    if (deviceHandler.protocol === "Rolec_E") {
      deviceHandler.notificationCallback((res: ResponseResultsSchemaType) => {
        console.log(`Callback ${res.key}`);

        // Check if this is an authentication response
        if (res.key === "Device password authentication response") {
          // This loop is just for testing currently
          for (const key in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, key)) {
              const value = res.data[key]; // value is of type string
              console.log(`Key: ${key}, Value: ${value}`);
            }
          }
          if (JSON.stringify(res.data) === `{"Lock time":"0"}`)
            setIsAuthenticated(true);
          else {
            setIsAuthenticated(false);
            if (
              res.data["Lock time"] &&
              isNaN(Number(res.data["Lock time"])) === false &&
              Number(res.data["Lock time"]) > 10
            ) {
              setShowCommonError("LOCKED");
            } else {
              setShowCommonError("INVALID_PASS");
            }
          }
          setIsAuthenticating(false);
        } else {
          console.log(res.data);
          const newData: BleConfigProp[] = findDataKeysFromResponse(res);
          setConfigKeys(newData);
        }
      });
    }

    if (connected && deviceHandler.protocol === "Rolec_D")
      void validateV1Authentication();
  }, [deviceHandler]);

  // Trigger an initial fetch on config when first authenticated
  useEffect(() => {
    setIsAuthenticating(false);
    if (isAuthenticated && !hasFetchedConfig) {
      async function grabConfig() {
        await delay(1000);
        fetchConfig();
      }
      void grabConfig();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    console.log(config);
    if (numberOfExpectedKeys !== null && config.length >= numberOfExpectedKeys)
      void setInitialConfig();
  }, [config]);

  const authenticate = async (pass: string) => {
    if (!connected || !deviceHandler) return false;

    setPin(pass);
    setIsAuthenticating(true);

    try {
      await deviceHandler.authenticate(pass);
      if (deviceHandler.protocol == "Rolec_D")
        await validateV1Authentication(true);

      return true;
    } catch (error) {
      console.log(error);
      setIsAuthenticating(false);
      return false;
    }
  };

  const validateV1Authentication = async (feedback = false) => {
    if (!connected || !deviceHandler) return false;

    if (deviceHandler.protocol === "Rolec_D") {
      console.log(deviceHandler);
      console.log("Trying to read the firmware version");
      try {
        await delay(500);
        const fw = await handleRead("FirmwareVersionMCU");
        console.log(fw);
        if (typeof fw == "string") {
          if (fw.toUpperCase() == "NOT AUTHENTICATED") {
            if (isAuthenticated) setIsAuthenticated(false);
            if (feedback) setShowCommonError("INVALID_PASS");
          } else {
            console.log("is authenticated");
            setIsAuthenticated(true);
          }
        }
        setIsAuthenticating(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  function fetchConfig() {
    if (deviceHandler) {
      if (deviceHandler.protocol === "Rolec_E") void fetchEvoConfig();

      if (deviceHandler.protocol === "Rolec_D") void fetchV1Config();
    }
  }

  async function fetchEvoConfig() {
    console.log("READING FULL");
    let progress = 0;
    setProgress(progress);
    const props: EvoConfiguration[] = evoschema.filter(
      (p) => p.systemKey === false && p.readKey !== null,
    );
    const step = 100 / props.length;
    const numOfKeys = props.reduce((total, obj) => {
      return total + obj.inputs.length;
    }, 0);
    console.log(numOfKeys);
    setNumberOfExpectedKeys(numOfKeys);

    for (const prop of props) {
      if (prop.readKey !== null) {
        console.log(`I want to read ${prop.readKey}`);
        const hasParams = fetchAndSanitizeReadParameters(prop.handle);
        console.log(hasParams);
        // Do a quick check on params, it should always return valid even with no params
        if (hasParams.valid === true) {
          const data = hasParams.data ?? "";
          await handleRead(prop.readKey, data);
        }
        // Add an else to throw an error

        progress += step;
        setProgress(progress);

        // Wait for 700 milliseconds before continuing to the next iteration.. nice :)
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    }
    setHasFetchedConfig(true);
  }

  async function fetchV1Config() {
    console.log("READING FULL V1");
    let progress = 0;
    setProgress(progress);
    const props: EvoConfiguration[] = v1schema.filter(
      (p) => p.systemKey === false && p.readKey !== null,
    );
    const step = 100 / props.length;
    setNumberOfExpectedKeys(props.length);

    for (const prop of props) {
      if (prop.readKey !== null) {
        console.log(`I want to read ${prop.readKey}`);
        const value = await handleRead(prop.readKey);

        if (typeof value == "string") {
          const newData: BleConfigProp[] = [
            {
              handle: `${prop.handle}__`,
              value,
            },
          ];

          setConfigKeys(newData);
        }

        progress += step;
        setProgress(progress);
      }
    }

    await setInitialConfig();
    setHasFetchedConfig(true);
  }

  function setConfigKeys(newData: BleConfigProp[]) {
    // Update config with the new values, while keeping existing values
    // the state update is a function to ensure it always gets the most up to date data
    setConfig(() => {
      configRef.current = [
        ...configRef.current.filter(
          (item) => !newData.some((newItem) => newItem.handle === item.handle),
        ),
        ...newData,
      ];
      return configRef.current;
    });
  }

  async function setInitialConfig() {
    try {
      const configExists = await refetchExists();
      if (configExists.data === false) {
        await setInitConfig();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleWrite(key: string, writeValue: string) {
    console.log("handleWrite");
    if (deviceHandler && key) {
      try {
        console.log(writeValue);
        const res = await deviceHandler.write(key, writeValue);
        console.log(res);
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    } else return false;
  }

  async function handleRead(key: string, data?: string) {
    console.log("handleRead: selectedKey: ", key);

    // No key no read
    if (!key) return false;

    console.log(deviceHandler?.protocol);

    try {
      if (deviceHandler && key && deviceHandler.protocol === "Rolec_D") {
        const value = await deviceHandler.read(
          dUtils.getPropertybyKey(key).characteristicId,
        );
        console.log("Read:", value);

        // Check for potential boolean values
        if (value === "true") return "1";

        if (value === "false") return "0";

        return value;
      } else {
        console.log(`Reading ${key}`);
        const value = deviceHandler?.write(key, data ?? "");
        console.log(value);
        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async function handleReboot() {
    console.log("Rebooting");

    console.log(deviceHandler?.protocol);

    try {
      if (deviceHandler && deviceHandler.protocol === "Rolec_D") {
        const value = await deviceHandler.write("SystemRestart", "17");
        console.log("Read:", value);
        return value;
      } else {
        const value = deviceHandler?.write("System reboot", "");
        console.log(value);
        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const contextValue: BleConnectionContextProps = {
    scanning,
    connected: isConnected,
    authenticate,
    deviceName,
    deviceHandler,
    connectToDevice,
    authenticated: isAuthenticated,
    authenticating: isAuthenticating,
    progress,
    hasFetchedConfig,
    deviceConfig: config,
    handleWrite,
    handleRead,
    handleReboot,
    fetchConfig,
    pin,
    mode,
    setMode,
  };

  return (
    <BleConnectionContext.Provider value={contextValue}>
      {children}
      <BleCommonAlert
        alert={showCommonError}
        onDismiss={() => setShowCommonError(null)}
      />
    </BleConnectionContext.Provider>
  );
}

export const useBleConnection = (): BleConnectionContextProps => {
  const context = useContext(BleConnectionContext);
  if (context === undefined) {
    throw new Error(
      "useBleConnection must be used within a BleConnectionProvider",
    );
  }
  return context;
};
