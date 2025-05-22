// Check if the device id has the ROLEC_ prefix
export function ensureRolecPrefix(input: string): string {
  if (input.toUpperCase().startsWith("ROLEC_")) {
    return input;
  } else {
    return "ROLEC_" + input;
  }
}

export function getHandleFromInput(input: string): string | null {
  return input.split("__")[0] ?? null;
}

export function formatHandleString(value: string): string {
  if (value.endsWith("__")) {
    return value.slice(0, -2);
  }

  if (value.includes("__")) {
    return value.replace(/__/g, "_");
  }

  return value;
}
