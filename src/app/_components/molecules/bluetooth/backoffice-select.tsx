import type { Control } from "react-hook-form";
import React from "react";

import type {
  EvoConfiguration,
  EvoInput,
  EvoOption,
} from "~/utils/schemas/types";
import { api } from "~/utils/api";
import BLEConfigSelect from "./select";

interface BLEConfigInputProps {
  inputHandle: string;
  control: Control;
  input: EvoInput;
  error: string | null;
  prop: EvoConfiguration;
}

export default function BLEBackOfficeSelect({
  inputHandle,
  control,
  input,
  error,
  prop,
}: BLEConfigInputProps) {
  const { data: csmsData } = api.mobile.connect.query.getCsmsData.useQuery();
  if (!csmsData) return null;

  let additionalSelect: EvoInput | null = null;
  additionalSelect = JSON.parse(JSON.stringify(input)) as EvoInput;
  additionalSelect.displayName = "Your Back Office";

  const options: EvoOption[] = csmsData.map((bo) => ({
    label: bo.value,
    value: bo.key,
  }));
  additionalSelect.options = options;

  // additionalSelect.options = [
  //   {
  //     label: "EVO Home",
  //     value: "wss://evo.rolec.app/ocpp/websocket/CentralSystemService",
  //   },
  //   {
  //     label: "Rolec Test Network",
  //     value: "wss://ocpp-test.vendelectric.com",
  //   },
  // ];

  return (
    <BLEConfigSelect
      inputHandle={inputHandle}
      control={control}
      input={additionalSelect}
      error={error}
      prop={prop}
    />
  );
}
