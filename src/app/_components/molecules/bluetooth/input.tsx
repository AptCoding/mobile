import type { Control } from "react-hook-form";
import React from "react";
import { Text, TextInput, View } from "react-native";
import { useColorScheme } from "nativewind";
import { Controller } from "react-hook-form";

import type { EvoConfiguration, EvoInput } from "~/utils/schemas/types";
import colors from "~/app/_styles/colors";
import { ThemedText } from "../../atoms/themed";
import BLEBackOfficeSelect from "./backoffice-select";
import BLEConfigSelect from "./select";

interface BLEConfigInputProps {
  inputHandle: string;
  control: Control;
  input: EvoInput;
  error: string | null;
  prop: EvoConfiguration;
}

export default function BLEConfigInput({
  inputHandle,
  control,
  input,
  error,
  prop,
}: BLEConfigInputProps) {
  const { colorScheme } = useColorScheme();
  const readOnly = prop.permissions.installer === "r";
  const basises = [25, 50, 75, 100];
  const basis = basises[input.colspan - 1] ?? 100;

  if (input.options && input.options.length > 0)
    return (
      <BLEConfigSelect
        inputHandle={inputHandle}
        control={control}
        input={input}
        error={error}
        prop={prop}
      />
    );

  return (
    <>
      {(prop.handle == "BESURL" || prop.handle == "OCPP_URL") && (
        <BLEBackOfficeSelect
          inputHandle={inputHandle}
          control={control}
          input={input}
          error={error}
          prop={prop}
        />
      )}

      <View className={`flex px-2`} style={{ flexBasis: `${basis}%` }}>
        <Controller
          control={control}
          name={inputHandle}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="relative">
              {input.suffix && (
                <View className="absolute bottom-4 right-4 z-10 py-4">
                  <ThemedText className="opacity-40">{input.suffix}</ThemedText>
                </View>
              )}
              <ThemedText className="mb-1">{input.displayName}</ThemedText>
              <TextInput
                style={{
                  borderColor: colors[colorScheme ?? "light"].mainBorder,
                  backgroundColor: readOnly
                    ? colors[colorScheme ?? "light"].disabledBg
                    : "transparent",
                  color: readOnly
                    ? colors[colorScheme ?? "light"].disabled
                    : colors[colorScheme ?? "light"].text,
                }}
                className={`font-montserrat mb-4 rounded-lg border p-4`}
                onChangeText={(text) => {
                  if (input.formatter && text) {
                    onChange(input.formatter.unformat(text));
                  } else {
                    onChange(text);
                  }
                }}
                onBlur={onBlur}
                value={
                  input.formatter && value
                    ? input.formatter.format(value as string)
                    : (value as string)
                }
                readOnly={readOnly}
              />
              {error && <Text style={{ color: "red" }}>{error}</Text>}
            </View>
          )}
        />
      </View>
    </>
  );
}
