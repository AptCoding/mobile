import type { ResponseResultsSchemaType } from "@Rolec-Services/rolec-bluetooth";
import { converter } from "@Rolec-Services/rolec-bluetooth";

import type { EvoParameter } from "../types";
import eProtocol from "./protocol";
import eSchema from "./schema";

export interface BleConfigProp {
  handle: string;
  value: string;
}

export interface ValidationResult {
  valid: boolean;
  writeKey?: string;
  data?: string;
  errors: string[];
}

export interface ParameterResult {
  valid: boolean;
  data?: string;
  errors: string[];
}

export function findDataKeysFromResponse(
  event: ResponseResultsSchemaType,
): BleConfigProp[] {
  // Find the event schema with the matching key (description)
  const matchingEventSchema = eProtocol.properties[event.key];

  if (!matchingEventSchema) {
    console.log("No matching event schema found.");
    return [];
  }

  if (
    matchingEventSchema.messageType !== "response" ||
    !matchingEventSchema.data
  ) {
    console.log("Not a response type.");
    return [];
  }

  // Find the form schema with the matching readKey
  const matchingFormSchema = eSchema.find(
    (form) =>
      form.readKey === matchingEventSchema.description &&
      hasMatchingResponseParameter(event.data, form.parameters),
  );

  console.log("Matching Form Schema");
  console.log(matchingFormSchema);

  if (!matchingFormSchema) {
    console.log("No matching form schema found.");
    return [];
  }

  // Extract the data keys (e.g., "SSID", "Password") from the event schema
  const dataKeys = Object.keys(matchingEventSchema.data);

  // Push the corresponding data keys into an array based on the form schema
  const expectedDataKeys: BleConfigProp[] = [];

  // Loop through the inputs in the form schema and match with data keys
  matchingFormSchema.inputs.forEach((input) => {
    if (dataKeys.includes(input.responseDataKey)) {
      expectedDataKeys.push({
        handle: `${matchingFormSchema.handle}__${input.responseDataKey}`,
        value: event.data[input.responseDataKey] ?? "",
      });
    }
  });

  return expectedDataKeys;
}

function hasMatchingResponseParameter(
  responseData: Record<string, string>,
  parameters: EvoParameter[] | undefined,
): boolean {
  // No paramters no need to chaeck
  if (!parameters) return true;

  // Iterate through the parameters and check if the response matches
  return parameters.every((param) => {
    const responseValue = responseData[param.responseDataKey];
    return responseValue !== undefined && String(responseValue) === param.value;
  });
}

export function sanitizeWriteData(
  schemaHandle: string,
  data: Record<string, string>,
): ValidationResult {
  // Find the matching schema entry based on handle
  const schemaConfig = eSchema.find((config) => config.handle === schemaHandle);
  if (!schemaConfig) {
    return {
      valid: false,
      errors: [`Schema with handle "${schemaHandle}" not found.`],
    };
  }

  if (!schemaConfig.writeKey) {
    return {
      valid: false,
      errors: [
        `Schema with handle "${schemaHandle}" does not have a write key.`,
      ],
    };
  }

  // Find the corresponding protocol description (the response type)
  const protocolKey = schemaConfig.readKey;
  const protocolData = eProtocol.properties[protocolKey + " response"];
  if (!protocolData?.data)
    return {
      valid: false,
      errors: [`No protocol data found for "${protocolKey} response".`],
    };

  // Prepare a list of errors and validate the data
  const errors: string[] = [];
  let writeData = "";

  if (schemaConfig.parameters && schemaConfig.parameters.length > 0) {
    schemaConfig.parameters.forEach((param) => {
      const paramKey = param.responseDataKey;

      // If the protocol data has a corresponding key
      const protocolDataEntry = protocolData.data?.[paramKey];
      if (protocolDataEntry) {
        const expectedLength = protocolDataEntry.length;
        if (protocolDataEntry.type.toUpperCase() === "INTEGER") {
          const numValue = parseInt(param.value);
          writeData += converter.numToLittleEndianHex(numValue, expectedLength);
        } else {
          const paddedValue = param.value.padEnd(expectedLength, "\0");

          // Check if the length matches (if providedValue is a string or array)
          if (
            paddedValue &&
            typeof paddedValue === "string" &&
            paddedValue.length !== expectedLength
          ) {
            errors.push(
              `${param.responseDataKey} should have a length of "${expectedLength}", but got "${param.value.length}".`,
            );
          }

          if (paddedValue) writeData += converter.asciiToHexString(paddedValue);
        }
      } else {
        errors.push(
          `Missing protocol data for "${paramKey}" in "${protocolKey} response".`,
        );
      }
    });
  }

  schemaConfig.inputs.forEach((input) => {
    const inputKey = input.responseDataKey;

    // If the protocol data has a corresponding key
    const protocolDataEntry = protocolData.data?.[inputKey];
    if (protocolDataEntry) {
      const expectedLength = protocolDataEntry.length;
      const providedValue = data[inputKey] ?? "";

      if (protocolDataEntry.type.toUpperCase() === "INTEGER") {
        const numValue = parseInt(providedValue);
        writeData += converter.numToLittleEndianHex(numValue, expectedLength);
      } else {
        const paddedValue = providedValue.padEnd(expectedLength, "\0");

        // Check if the length matches (if providedValue is a string or array)
        if (
          paddedValue &&
          typeof paddedValue === "string" &&
          paddedValue.length !== expectedLength
        ) {
          errors.push(
            `${input.displayName} should have a length of "${expectedLength}", but got "${providedValue.length}".`,
          );
        }

        if (paddedValue) writeData += converter.asciiToHexString(paddedValue);
      }
    } else {
      errors.push(
        `Missing protocol data for "${inputKey}" in "${protocolKey} response".`,
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors,
    data: writeData,
    writeKey: schemaConfig.writeKey,
  };
}

export function fetchAndSanitizeReadParameters(
  schemaHandle: string,
): ParameterResult {
  // Find the matching schema entry based on handle
  const schemaConfig = eSchema.find((config) => config.handle === schemaHandle);
  if (!schemaConfig) {
    return {
      valid: false,
      errors: [`Schema with handle "${schemaHandle}" does not exist.`],
    };
  }

  console.log(schemaConfig);
  // So we know whether there are some parameters worth worrying about
  if (!schemaConfig.parameters || schemaConfig.parameters.length === 0) {
    return { valid: true, errors: [] };
  }

  // Find the corresponding protocol description (the response type)
  const protocolKey = schemaConfig.readKey;
  const protocolData = eProtocol.properties[protocolKey + " response"];
  if (!protocolData?.data)
    return {
      valid: false,
      errors: [`No protocol data found for "${protocolKey} response".`],
    };

  // Prepare a list of errors and validate the data
  const errors: string[] = [];
  let writeData = "";

  schemaConfig.parameters.forEach((param) => {
    const paramKey = param.responseDataKey;

    // If the protocol data has a corresponding key
    const protocolDataEntry = protocolData.data?.[paramKey];
    if (protocolDataEntry) {
      const expectedLength = protocolDataEntry.length;
      if (protocolDataEntry.type.toUpperCase() === "INTEGER") {
        const numValue = parseInt(param.value);
        writeData += converter.numToLittleEndianHex(numValue, expectedLength);
      } else {
        const paddedValue = param.value.padEnd(expectedLength, "\0");

        // Check if the length matches (if providedValue is a string or array)
        if (
          paddedValue &&
          typeof paddedValue === "string" &&
          paddedValue.length !== expectedLength
        ) {
          errors.push(
            `${param.responseDataKey} should have a length of "${expectedLength}", but got "${param.value.length}".`,
          );
        }

        if (paddedValue) writeData += converter.asciiToHexString(paddedValue);
      }
    } else {
      errors.push(
        `Missing protocol data for "${paramKey}" in "${protocolKey} response".`,
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors,
    data: writeData,
  };
}

export default { findDataKeysFromResponse, sanitizeWriteData };
