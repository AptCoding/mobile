import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";

import { useBleConnection } from "~/app/_components/organisms/bluetooth/ble-connection-provider";
import { ensureRolecPrefix } from "~/utils/helpers";
import BLEConnect from "../../molecules/bluetooth/connect";
import BLEPasswordAuth from "../../molecules/bluetooth/password-auth";
import BLEPinAuth from "../../molecules/bluetooth/pin-auth";
import BLEConfigurationEvo from "./ble-configuration-evo";
import BLEConfigurationV1 from "./ble-configuration-v1";
import BLEConnectionHeader from "./ble-connection-header";
import BLETestEvo from "./ble-test-evo";
import BLETestV1 from "./ble-test-v1";

interface BleConnectorProps {
  deviceName: string;
  barcodePin?: string | undefined;
}

export default function BLEConnector({
  deviceName,
  barcodePin,
}: BleConnectorProps) {
  const {
    scanning,
    connected,
    deviceHandler,
    connectToDevice,
    authenticated,
    authenticate,
    authenticating,
    pin,
    mode,
  } = useBleConnection();
  const [protocol, setProtocol] = useState<string>();

  // Handling the call to make that unauthenticated connection with a device
  async function handleConnect() {
    const device = ensureRolecPrefix(deviceName);
    await connectToDevice(device);
  }

  const handlePasswordSubmit = async (pin: string) => {
    if (!connected || !deviceHandler) return false;

    try {
      await authenticate(pin);
    } catch (error) {
      console.log("Authentication Error");
      console.log(error);
    }
  };

  // When the connection changes
  useEffect(() => {
    console.log("device connected: ", connected);
    if (
      connected &&
      !authenticated &&
      pin &&
      deviceHandler?.protocol == "Rolec_E"
    )
      void authenticate(pin);
  }, [connected]);

  useEffect(() => {
    console.log("device handler change");

    if (deviceHandler) {
      console.log(deviceHandler.protocol);

      // Do somenthing with the device handler
      if (protocol !== deviceHandler.protocol)
        setProtocol(deviceHandler.protocol);
    }
  }, [deviceHandler]);

  function handleBack() {
    router.back();
  }

  return (
    <>
      <View className="h-full flex-1 flex-col">
        {!connected && (
          <>
            <BLEConnectionHeader onBack={handleBack} device={deviceName} />
            <BLEConnect handleConnect={handleConnect} scanning={scanning} />
          </>
        )}

        {connected && authenticated && protocol === "Rolec_E" && (
          <>
            {(mode == "CONFIGURE" || mode == "CONFIGURED") && (
              <BLEConfigurationEvo />
            )}
            {mode == "TEST" && <BLETestEvo />}
          </>
        )}

        {connected && authenticated && protocol === "Rolec_D" && (
          <>
            {(mode == "CONFIGURE" || mode == "CONFIGURED") && (
              <BLEConfigurationV1 />
            )}
            {mode == "TEST" && <BLETestV1 />}
          </>
        )}
      </View>

      {connected && !authenticated && protocol === "Rolec_E" && (
        <BLEPinAuth
          isVisible={true}
          handleSubmit={handlePasswordSubmit}
          deviceName={deviceName}
          initialPin={pin ?? barcodePin ?? ""}
          waiting={authenticating}
        />
      )}

      {connected && !authenticated && protocol === "Rolec_D" && (
        <BLEPasswordAuth
          isVisible={true}
          handleSubmit={handlePasswordSubmit}
          deviceName={deviceName}
          initialPin={pin ?? barcodePin ?? ""}
          waiting={authenticating}
        />
      )}
    </>
  );
}
