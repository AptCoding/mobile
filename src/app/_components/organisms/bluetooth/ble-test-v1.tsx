import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";

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
import SimpleSelect from "../../atoms/simple-select";
import { ThemedText } from "../../atoms/themed";
import ConnectorFlashing from "../../molecules/connector-flashing";
import { useBleConnection } from "./ble-connection-provider";

interface ChargingData {
  "Fault code": string;
  meterRegister: string;
  meterStart: string;
}

interface TestResult {
  pass: boolean;
  status: string;
  meter: string;
  faultCode: string;
}

export default function BLETestV1() {
  const { handleRead, handleWrite, deviceHandler } = useBleConnection();

  const [isTestActive, setIsTestActive] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [chargingState, setChargingState] = useState<ChargingData>();
  const chargingStateRef = useRef<ChargingData>();

  const [NumOfConnectors, setNumOfConnectors] = useState(1);
  const [selectedConnector, setSelectedConnector] = useState("1");

  const intervalRef = useRef<NodeJS.Timeout>();

  async function getNumberOfConnectors() {
    try {
      const connectors = await handleRead("NumberOfConnectors");
      if (+connectors) setNumOfConnectors(+connectors);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      void collectResults();
    }, 2000);
    void getNumberOfConnectors();

    return () => clearInterval(intervalRef.current);
  }, []);

  async function collectResults() {
    try {
      const meter = await handleRead("MeterValue");
      const fault = await handleRead("ErrorCode");

      if ((meter as string) != "0") {
        if (!chargingStateRef.current)
          chargingStateRef.current = {
            "Fault code": fault as string,
            meterStart: meter as string,
            meterRegister: meter as string,
          };
        else {
          chargingStateRef.current = {
            ...chargingStateRef.current,
            "Fault code": fault as string,
            meterRegister: meter as string,
          };
        }
        setChargingState(chargingStateRef.current);
      }

      console.log(meter);
      console.log(fault);
    } catch (error) {
      console.log(error);
    }
  }

  if (deviceHandler === null) return null;

  const startTest = async () => {
    if (!isTestActive) {
      await handleWrite("StartChargeOnSocket", selectedConnector);
      setIsTestActive(true);
    }
  };

  const stopTest = async () => {
    if (isTestActive) {
      if (chargingState) {
        const passed =
          subtractMeterStrings(
            chargingState.meterRegister,
            chargingState.meterStart,
          ) >= 0.01 && chargingState["Fault code"] == "NoError";
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
      await handleWrite("StartChargeOnSocket", "0");
      setIsTestActive(false);
    }
  };

  const resetTest = () => {
    setIsTestActive(false);
    setTestResult(null);
    chargingStateRef.current = undefined;
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
    if (num1 == 0) return 0;

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
                <ThemedText className="mb-8 text-xl">Ongoing</ThemedText>
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

        <SimpleSelect
          displayName="Choose a Connector to Test"
          options={Array.from({ length: NumOfConnectors }, (_, index) => ({
            value: [index + 1].toString(),
            label: (index + 1).toString(),
          }))}
          value={selectedConnector}
          onChange={setSelectedConnector}
        ></SimpleSelect>

        <BigButton
          label="Start Testing"
          icon={<Zap size={16} color="#ffffff" />}
          onPress={startTest}
        />
      </View>
    </View>
  );
}
