import type { ReactElement } from "react";
import type { ZodSchema } from "zod";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { ScrollableIconTab } from "../../molecules/scrollable-icon-tabs";
import type {
  BleConfigProp,
  ValidationResult,
} from "~/utils/schemas/evo/utils";
import type { EvoConfiguration } from "~/utils/schemas/types";
import { api } from "~/utils/api";
import { formatHandleString } from "~/utils/helpers";
import { sanitizeWriteData } from "~/utils/schemas/evo/utils";
import { Monitor, Radio, Sliders, Zap } from "../../atoms/assets/icons";
import { ThemedText } from "../../atoms/themed";
import BLECompleteConfiguration from "../../molecules/bluetooth/configuration-complete";
import BLEConfirmConfiguration from "../../molecules/bluetooth/configuration-confirm";
import BLEPushConfiguration from "../../molecules/bluetooth/configuration-push";
import BLEConfigInput from "../../molecules/bluetooth/input";
import ScrollableIconTabs from "../../molecules/scrollable-icon-tabs";
import BLEConnectionHeader from "./ble-connection-header";
import { useBleConnection } from "./ble-connection-provider";

interface DynamicFormProps {
  schema: EvoConfiguration[];
}

interface HandleDataPair {
  handle: string;
  data: Record<string, string>;
}

export default function BLEConfigurationForm({ schema }: DynamicFormProps) {
  const {
    deviceConfig,
    handleWrite,
    deviceName,
    deviceHandler,
    handleReboot,
    mode,
    setMode,
  } = useBleConnection();

  const [logChanges, setLogChanges] = useState<BleConfigProp[]>([]);
  const { refetch: updateConfiguration } =
    api.mobile.chargepoint.mutate.updateConfiguration.useQuery(
      {
        serialNumber: deviceName?.toUpperCase() ?? "",
        configurations: logChanges.map((c) => ({
          key: formatHandleString(c.handle),
          value: c.value,
        })),
      },
      { enabled: false },
    );

  // CONFIGURE, CONFIRM, CONFIGURING, CONFIGURED
  const [state, setState] = useState<
    "CONFIGURE" | "CONFIRM" | "CONFIGURING" | "CONFIGURED"
  >(mode === "CONFIGURED" ? "CONFIGURED" : "CONFIGURE");

  const initialValues: Record<string, string> = {};
  const validationSchema: Record<string, ZodSchema<unknown>> = {};

  const [pushProgress, setPushProgress] = useState(0);

  schema
    .filter((s) => s.systemKey === false)
    .forEach((config) => {
      config.inputs.forEach((input) => {
        const { responseDataKey, required, displayName } = input;
        const inputHandle = `${config.handle}__${responseDataKey}`;

        // Initialize the validation schema as a string
        const validation = z.string();

        // Store the initial value
        const findValue = deviceConfig.find((c) => c.handle === inputHandle);
        initialValues[inputHandle] = findValue?.value ?? "";

        // Apply required validation if needed
        if (required) {
          validationSchema[inputHandle] = validation.min(
            1,
            `${displayName} is required`,
          );
        } else {
          validationSchema[inputHandle] = validation;
        }
      });
    });

  const zodSchema = z.object(validationSchema);
  type FormData = z.infer<typeof zodSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>({
    defaultValues: initialValues,
    resolver: (data) => {
      try {
        zodSchema.parse(data);
        return { values: data, errors: {} };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatedErrors = error.issues.reduce(
            (acc, issue) => {
              const path = issue.path.join(".");
              acc[path] = {
                type: issue.code,
                message: issue.message,
              };
              return acc;
            },
            {} as Record<string, { type: string; message: string }>,
          );

          return {
            values: {},
            errors: formatedErrors,
          };
        }
        return { values: {}, errors: {} };
      }
    },
  });

  useEffect(() => {
    function checkStateChanges() {
      const form = getValues();
      const formKeys = Object.keys(form);

      deviceConfig.forEach((dc) => {
        if (formKeys.includes(dc.handle)) {
          if (form[dc.handle] !== dc.value) setValue(dc.handle, dc.value);
        }
      });
    }
    checkStateChanges();
  }, [deviceConfig]);

  const handleConfirm = () => {
    setState("CONFIRM");
  };

  const onSubmit = (data: FormData) => {
    console.log("configuring");

    // Firstly we need to see which values have been changed,
    // but specify this by handle and not property
    console.log(data);
    console.log(deviceConfig);

    setState("CONFIGURING");
    setPushProgress(0);

    //  First things first, the data coming in from the form
    //  is in a format like `GRIDCT__Parameter values`
    //  and this is because on EVO you may have things like
    //  WIFI__SSID and WIFI__Password
    //
    //  Two values `SSID` and `Password` being sent via the same BLE command `WIFI`

    const handlesChanged: string[] = []; // Which handles have any changes
    const writes: ValidationResult[] = []; // What BLE props need writing to
    const newLogChanges: BleConfigProp[] = []; // The log of changes to be sent to server

    // Loop through the current known config of the device
    deviceConfig.forEach((config) => {
      // Check if the handle is with the form data and that the value has been changed
      if (
        typeof data[config.handle] !== "undefined" &&
        config.value !== data[config.handle]
      ) {
        // Grab the parent handle
        const handle = config.handle.split("__")[0];
        if (handle) {
          // Store the change to be sent to the server
          newLogChanges.push({
            handle: config.handle,
            value: data[config.handle] as string,
          });
          // Mark this handle as having been changed
          handlesChanged.push(handle);
        }
      }
    });
    setLogChanges(newLogChanges);

    // Now we split the data down into individual handles
    // This will give you the data against a single handle
    // like {handle: WIFI, data: {SSID:`TEST_WIFI`, Password:`factorytest`}}
    const splitData = combineToHandleData(data);
    console.log("Split Data", splitData);

    // Only update those handles which have changed
    handlesChanged.forEach((handle) => {
      // Let's just check firstly that this handle is not read only
      const prop = schema.find((prop) => prop.handle === handle);

      console.log(prop);

      if (prop?.permissions.installer.includes("w")) {
        if (deviceHandler?.protocol === "Rolec_E") {
          const changableData = splitData.find((d) => d.handle === handle);
          if (changableData) {
            const result = sanitizeWriteData(
              changableData.handle,
              changableData.data,
            );
            console.log(result);
            if (
              result.valid &&
              result.errors.length === 0 &&
              result.data &&
              result.writeKey
            ) {
              writes.push(result);

              //  At this point the handle is being written to
              //  We need to check if there are any other conditional
              //  properties that need writing to as a result

              //  Grab the prop, find the input key and see if there are
              //  any conditional changes to be made
              prop.inputs.forEach((input) => {
                if (input.conditionalSettings?.length) {
                  // Grab the value being set
                  const value = changableData.data[input.responseDataKey];

                  if (value) {
                    const conditionalSetting = input.conditionalSettings.find(
                      (setting) => setting.value == value,
                    );
                    if (conditionalSetting) {
                      conditionalSetting.settings.forEach((requiredSetting) => {
                        const requiredSettingData: Record<string, string> =
                          requiredSetting.value.reduce(
                            (acc, { responseDataKey, value }) => {
                              acc[responseDataKey] = value;
                              return acc;
                            },
                            {} as Record<string, string>,
                          );
                        const sanitizedConditionalSetting = sanitizeWriteData(
                          requiredSetting.handle,
                          requiredSettingData,
                        );
                        if (
                          sanitizedConditionalSetting.valid &&
                          sanitizedConditionalSetting.errors.length === 0 &&
                          sanitizedConditionalSetting.data &&
                          sanitizedConditionalSetting.writeKey
                        )
                          writes.push(sanitizedConditionalSetting);
                      });
                    }
                  }
                }
              });
            }
          }
        }

        if (deviceHandler?.protocol === "Rolec_D") {
          const newWrite: ValidationResult = {
            valid: true,
            writeKey: prop.writeKey ?? "",
            data: data[`${handle}__`] as string,
            errors: [],
          };

          writes.push(newWrite);
        }
      }
    });

    //  As much as we can await the write in the above
    //  This way, we have a total number of expected and this should
    //  allow us to display this a bit better on the front end
    const totalWrites = writes.length;
    let completedWrites = 0;

    if (deviceHandler?.protocol === "Rolec_D") {
      writes.push({
        valid: true,
        writeKey: "SaveConfig",
        data: "17",
        errors: [],
      });
    }

    const writePromises = writes.map(async (write) => {
      if (write.writeKey && write.data) {
        await handleWrite(write.writeKey, write.data);
        completedWrites++;
        setPushProgress(Math.floor((completedWrites / totalWrites) * 100));
      }
    });

    // Wait for all writes to complete before moving to the next state
    Promise.allSettled(writePromises)
      .then(() => {
        setTimeout(() => {
          void updateConfiguration();
          void handleReboot();
          setState("CONFIGURED");
          setMode("CONFIGURED");
        }, 2000);
      })
      .catch((err) => console.log(err));
  };

  function combineToHandleData(input: FormData): HandleDataPair[] {
    const result: HandleDataPair[] = [];

    for (const key in input) {
      const [handle, data] = key.split("__");

      if (handle && data && typeof input[key] !== "undefined") {
        // Check if the handle already exists in the result array
        let dataPair = result.find((item) => item.handle === handle);
        if (!dataPair) {
          dataPair = { handle, data: {} };
          result.push(dataPair);
        }

        // Assign the data value to the corresponding handle
        dataPair.data[data] = input[key] as string;
      }
    }

    return result;
  }

  function makeTabForm(tab: string) {
    interface Group {
      name: string;
      configs: EvoConfiguration[];
    }

    const inputs = schema.filter((s) => s.tab === tab);

    const groups: Group[] = [
      ...new Set(inputs.map((config) => config.group)),
    ].map((g) => ({
      name: g,
      configs: inputs.filter((i) => i.group === g),
    }));

    return (
      <View className="m-0 w-full p-0">
        <View className="mb-7 flex-row items-center pt-7">
          <ThemedText className="text-4xl">{tab}</ThemedText>
        </View>
        {groups.map((group) => (
          <View key={group.name} className="flex w-full flex-row flex-wrap">
            {group.configs.map((config) => {
              return config.inputs.map((input) => {
                const inputHandle = `${config.handle}__${input.responseDataKey}`;
                return (
                  <BLEConfigInput
                    key={inputHandle}
                    control={control}
                    inputHandle={inputHandle}
                    input={input}
                    error={errors[inputHandle]?.message ?? null}
                    prop={config}
                  />
                );
              });
            })}
          </View>
        ))}
      </View>
    );
  }

  function handleBack() {
    if (state === "CONFIGURE") router.back();
    else {
      setState("CONFIGURE");
      setMode("CONFIGURE");
    }
  }

  const tabNames = [
    ...new Set(schema.filter((s) => s.systemKey === false).map((s) => s.tab)),
  ];
  const formTabs: ScrollableIconTab[] = [];

  const icons: Record<string, ReactElement> = {
    SPECIFICATIONS: <Zap size={24} />,
    "BACK OFFICE": <Monitor size={24} />,
    NETWORK: <Radio size={24} />,
    CONTROLS: <Sliders size={24} />,
  };

  tabNames.forEach((name, idx) => {
    formTabs.push({
      id: idx,
      title: name,
      icon: icons[name.toUpperCase()] ?? <Zap size={24} />,
      content: makeTabForm(name),
    });
  });

  return (
    <>
      <BLEConnectionHeader onBack={handleBack} />
      {state === "CONFIGURE" && (
        <View className="mb-4 flex-1">
          <ScrollableIconTabs
            tabs={formTabs}
            showNext={true}
            onFinish={handleConfirm}
          />
        </View>
      )}

      {state === "CONFIRM" && (
        <BLEConfirmConfiguration onSubmit={handleSubmit(onSubmit)} />
      )}
      {state === "CONFIGURING" && (
        <BLEPushConfiguration progress={pushProgress} />
      )}
      {state === "CONFIGURED" && <BLECompleteConfiguration />}
    </>
  );
}
