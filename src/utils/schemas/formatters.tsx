export interface Formatter {
  format: (value: string) => string;
  unformat: (value: string) => string;
}

function multiplyBy100(value: string): string {
  const num = Number(value);
  if (!isNaN(num)) {
    return String(num * 100);
  }
  return value;
}

function divideBy100(value: string): string {
  const num = Number(value);
  if (!isNaN(num)) {
    return String(num / 100);
  }
  return value;
}

export const centiampereToAmpere: Formatter = {
  format: divideBy100,
  unformat: multiplyBy100,
};

export default { centiampereToAmpere };
