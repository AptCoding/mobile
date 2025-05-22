import type { ResponseResultsSchemaType } from "@Rolec-Services/rolec-bluetooth";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { converter } from "@Rolec-Services/rolec-bluetooth";

import type { BleConfigProp } from "~/utils/schemas/evo/utils";
import { findDataKeysFromResponse } from "~/utils/schemas/evo/utils";
import {
  CheckCircle,
  CloseOctagon,
  Connector,
  Refresh,
  ThumbsUpGreen,
  Zap,
} from "../../atoms/assets/icons";
import BigButton from "../../atoms/big-button";
import BigRedButton from "../../atoms/big-red-button";
import { ThemedText } from "../../atoms/themed";
import ConnectorFlashing from "../../molecules/connector-flashing";
import { useBleConnection } from "./ble-connection-provider";

interface ChargingData {
  "Connection status": string;
  "Current (L1)": string;
  "Current (L2)": string;
  "Current (L3)": string;
  "Fault code": string;
  "Voltage (L1)": string;
  "Voltage (L2)": string;
  "Voltage (L3)": string;
  "Working status": string;
  meterRegister: string;
  meterStart: string;
  timeStart: string;
  timestamp: string;
}

interface TestResult {
  pass: boolean;
  status: string;
  meter: string;
  faultCode: string;
}

export default function BLETestEvo() {
  const { handleRead, deviceHandler } = useBleConnection();

  const [isTestActive, setIsTestActive] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [chargingState, setChargingState] = useState<ChargingData>();
  const idTag = "TEST1234";

  const intervalRef = useRef<NodeJS.Timeout>();

  // Periodically checking for the
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      void handleRead("Charging data query");
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, [isTestActive, handleRead, chargingState]);

  if (deviceHandler === null) return null;

  const statuses = {
    "0": "Available",
    "1": "Preparing",
    "2": "Charging",
    "3": "Faulted",
    "4": "Upgrade",
    "5": "Unavailable",
  };

  if (deviceHandler.protocol === "Rolec_E") {
    deviceHandler.notificationCallback((res: ResponseResultsSchemaType) => {
      console.log("Got it from testing:");
      console.log(res);

      if (res.key === "Start and stop charging response") {
        const newData: BleConfigProp[] = findDataKeysFromResponse(res);
        console.log(newData);
        if (
          newData[0] &&
          newData[0].handle === "STARTSTOPCHARGE__Results" &&
          newData[0].value == "0"
        ) {
          console.log(!isTestActive);
          setIsTestActive(!isTestActive);
        }
      }

      if (res.key === "Charging data query response") {
        console.log(res.data);
        const newChargeState = res.data as unknown as ChargingData;
        setChargingState(newChargeState);
      }
    });
  }

  const startTest = async () => {
    if (!isTestActive) {
      const data =
        converter.numToLittleEndianHex(0, 4) +
        converter.asciiToHexString(idTag.padEnd(20, "\0"));
      await handleRead("Start and stop charging", data);
    }
  };

  const stopTest = async () => {
    if (isTestActive) {
      if (chargingState) {
        const passed =
          chargingState["Working status"] == "2" &&
          subtractMeterStrings(
            chargingState.meterRegister,
            chargingState.meterStart,
          ) >= 0.01 &&
          chargingState["Fault code"] == "0";
        const newTestResult: TestResult = {
          pass: passed,
          status: passed ? "Pass" : "Fail",
          meter: getMeterString(
            chargingState.meterRegister,
            chargingState.meterStart,
          ),
          faultCode: chargingState["Fault code"],
        };

        setTestResult(newTestResult);
      }

      // Stop the charge session
      const data =
        converter.numToLittleEndianHex(1, 4) +
        converter.asciiToHexString(idTag.padEnd(20, "\0"));
      await handleRead("Start and stop charging", data);
    }
  };

  const resetTest = () => {
    setIsTestActive(false);
    setTestResult(null);
  };

  function subtractMeterStrings(meter: string, meterStart: string): number {
    if (
      !meter ||
      !meterStart ||
      isNaN(Number(meter)) ||
      isNaN(Number(meterStart))
    ) {
      return 0;
    }
    const num1 = Number(meter);
    const num2 = Number(meterStart);
    if (num2 === 0) return 0;

    const difference = (num1 - num2) / 1000;
    return difference;
  }

  function getMeterString(meter: string, meterStart: string): string {
    if (
      !meter ||
      !meterStart ||
      isNaN(Number(meter)) ||
      isNaN(Number(meterStart))
    ) {
      return "No Meter";
    }
    return subtractMeterStrings(meter, meterStart).toString();
  }

  if (testResult)
    return (
      <View className="flex-1">
        <View className="flex-row items-center gap-2 pt-7">
          <ThemedText className="text-4xl">
            Test {testResult.pass ? "Passed" : "Fail"}
          </ThemedText>
        </View>

        <View className="flex-1 flex-row items-center justify-center">
          {testResult.pass ? (
            <ThumbsUpGreen color="white" size={120} />
          ) : (
            <Connector color="white" size={180} />
          )}
        </View>

        <View className="p-4">
          {chargingState && (
            <View className="mb-8 flex-row flex-wrap">
              <View className="flex-1 basis-1/2">
                <ThemedText className="font-montserrat_light text-lg opacity-70">
                  Status
                </ThemedText>
                <ThemedText
                  className={`mb-8 text-xl ${testResult.pass ? "color-ev-500" : "color-red-500"}`}
                >
                  {testResult.status}
                </ThemedText>
              </View>

              <View className="flex-1 basis-1/2">
                <ThemedText className="font-montserrat_light text-lg opacity-70">
                  Meter
                </ThemedText>
                <ThemedText
                  className={`mb-8 text-xl ${testResult.pass ? "color-ev-500" : "color-red-500"}`}
                >
                  {testResult.meter}kWh
                </ThemedText>
              </View>

              <View className="flex-1 basis-1/2">
                <ThemedText className="font-montserrat_light text-lg opacity-70">
                  Error
                </ThemedText>
                <ThemedText className="mb-8 text-xl">
                  {testResult.faultCode == "0"
                    ? "No Error"
                    : testResult.faultCode}
                </ThemedText>
              </View>

              {/* <View className="flex-1 basis-1/2">
                <ThemedText className="font-montserrat_light text-lg opacity-70">
                  WiFi Signal
                </ThemedText>
                <ThemedText className="mb-8 text-xl">
                  Good
                </ThemedText>
              </View> */}
            </View>
          )}

          <View className="flex-col">
            <View className="mb-3">
              <BigButton
                label="Finish Test"
                icon={<CheckCircle size={16} color="#ffffff" />}
                onPress={() => router.back()}
              />
            </View>

            <View>
              <BigButton
                variant="outline"
                label="Test Again"
                icon={<Refresh size={16} color="#ffffff" />}
                onPress={resetTest}
              />
            </View>
          </View>
        </View>
      </View>
    );

  if (isTestActive)
    return (
      <View className="flex-1">
        <View className="flex-row items-center gap-2 pt-7">
          <ThemedText className="text-4xl">Testing Connectors</ThemedText>
        </View>

        <View className="flex-1 flex-row items-center justify-center">
          <ConnectorFlashing size={180} color="white" flashColor="white" />
        </View>

        <View className="p-4">
          {chargingState && (
            <View className="mb-8 flex-row flex-wrap">
              <View className="flex-1 basis-1/2">
                <ThemedText className="font-montserrat_light text-lg opacity-70">
                  Status
                </ThemedText>
                <ThemedText className="mb-8 text-xl">
                  {
                    statuses[
                      chargingState["Working status"] as keyof typeof statuses
                    ]
                  }
                </ThemedText>
              </View>

              <View className="flex-1 basis-1/2">
                <ThemedText className="font-montserrat_light text-lg opacity-70">
                  Meter
                </ThemedText>
                <ThemedText className="mb-8 text-xl">
                  {getMeterString(
                    chargingState.meterRegister,
                    chargingState.meterStart,
                  )}
                  kWh
                </ThemedText>
              </View>

              <View className="flex-1 basis-1/2">
                <ThemedText className="font-montserrat_light text-lg opacity-70">
                  Error
                </ThemedText>
                <ThemedText className="mb-8 text-xl">
                  {chargingState["Fault code"] == "0"
                    ? "No Error"
                    : chargingState["Fault code"]}
                </ThemedText>
              </View>

              {/* <View className="flex-1 basis-1/2">
                  <ThemedText className="font-montserrat_light text-lg opacity-70">
                    WiFi Signal
                  </ThemedText>
                  <ThemedText className="mb-8 text-xl">
                    Good
                  </ThemedText>
                </View> */}
            </View>
          )}

          <BigRedButton
            label="Stop Testing"
            icon={<CloseOctagon size={16} color="#ffffff" />}
            onPress={stopTest}
          />
        </View>
      </View>
    );

  return (
    <View className="flex-1">
      <View className="flex-row items-center gap-2 pt-7">
        <ThemedText className="text-4xl">Test Connector</ThemedText>
      </View>

      <View className="flex-1 flex-row items-center justify-center">
        <Connector color="white" size={180} />
      </View>

      <View className="p-4">
        <ThemedText className="mb-2 text-2xl">
          Ready to Test the Connector
        </ThemedText>
        <ThemedText className="font-montserrat_light mb-12 text-lg opacity-70">
          Your chargepoint is now configured and ready for testing. Please test
          the connector to ensure proper operation.
        </ThemedText>

        <BigButton
          label="Start Testing"
          icon={<Zap size={16} color="#ffffff" />}
          onPress={startTest}
        />
      </View>
    </View>
  );
}
