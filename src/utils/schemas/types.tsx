import type { Formatter } from "./formatters";

export interface Permissions {
  user: "rw" | "r" | "w";
  installer: "rw" | "r" | "w";
  manufacturer: "rw" | "r" | "w";
}

export interface EvoInput {
  displayName: string;
  responseDataKey: string;
  colspan: number;
  required: boolean;
  options?: EvoOption[];
  prefix?: string;
  suffix?: string;
  formatter?: Formatter;
  conditionalSettings?: ConditionalSetting[];
}

export interface EvoParameter {
  responseDataKey: string;
  value: string;
}

export interface EvoOption {
  value: string | number;
  label: string;
}

export interface ConditionalSetting {
  value: string | number;
  settings: ConditionalSettingProperty[];
}

export interface ConditionalSettingProperty {
  handle: string;
  value: EvoParameter[];
}

export interface EvoConfiguration {
  handle: string;
  group: string;
  tab: string;
  systemKey: boolean;
  writeKey: string | null;
  readKey: string | null;
  inputs: EvoInput[];
  parameters?: EvoParameter[];
  permissions: Permissions;
}
